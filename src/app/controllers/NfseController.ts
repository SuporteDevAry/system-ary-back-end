import { Request, Response } from "express";
import { parseString } from "xml2js";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { FocusNfeService } from "../../services/FocusNfeService";
import { BadRequestError } from "../helpers/api-errors";

function mapStatus(status?: string) {
  if (!status) return "";
  const s = String(status).toLowerCase();
  if (s.includes("erro")) return "erro_autorizacao";
  if (s.includes("cancel")) return "cancelada";
  if (s.includes("process")) return "processando_autorizacao";
  if (s.includes("autoriza") || s.includes("autoriz")) return "autorizada";
  return s;
}

function extrairStatusRespostaFocusNfe(result: any): string {
  const candidatos = [
    result?.status,
    result?.Status,
    result?.situacao,
    result?.Situacao,
    result?.message,
    result?.mensagem,
    result?.resultado?.status,
    result?.resultado?.Status,
    result?.resultado?.situacao,
    result?.resultado?.Situacao,
    result?.resultado?.message,
    result?.resultado?.mensagem,
    result?.data?.status,
    result?.data?.Status,
    result?.data?.situacao,
    result?.data?.Situacao,
    result?.data?.message,
    result?.data?.mensagem,
  ];

  for (const candidato of candidatos) {
    const mapped = mapStatus(
      typeof candidato === "string" ? candidato : candidato ? String(candidato) : "",
    );
    if (mapped) return mapped;
  }

  return "";
}

function extrairNumeroNfse(item: any): string | null {
  const valor =
    item?.numero_nfse ||
    item?.numeroNfse ||
    item?.numero ||
    item?.nfs_number ||
    item?.numero_nota ||
    item?.numeroNota ||
    null;
  return valor ? String(valor).trim() : null;
}

function extrairReferenciaLote(item: any, fallback?: string | null): string | null {
  const valor =
    item?.ref ||
    item?.referencia ||
    item?.protocolo_lote ||
    item?.numero_lote ||
    item?.protocolo ||
    fallback ||
    null;
  return valor ? String(valor).trim() : null;
}

function extrairNumeroRpsDaReferencia(referencia?: string | null): string | null {
  if (!referencia) return null;

  const valor = String(referencia).trim();
  const partes = valor.split("-");
  if (partes.length < 4) return null;

  const candidato = partes[partes.length - 1].trim();
  return candidato ? candidato : null;
}

function extrairNumeroRpsRetorno(item: any): string | null {
  const valor =
    item?.numero_rps ||
    item?.numeroRps ||
    item?.rps_number ||
    item?.numero ||
    extrairNumeroRpsDaReferencia(extrairReferenciaLote(item, null)) ||
    null;
  return valor ? String(valor).trim() : null;
}

async function extrairNumerosRpsDoXml(xml: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    parseString(xml, { explicitArray: false }, (err: any, result: any) => {
      if (err) {
        reject(new Error(`Erro ao parsear XML do lote: ${err.message}`));
        return;
      }

      const pedido = result?.PedidoEnvioLoteRPS;
      const rpsArray = pedido?.RPS
        ? Array.isArray(pedido.RPS)
          ? pedido.RPS
          : [pedido.RPS]
        : [];

      const numeros = rpsArray
        .map((rps: any) =>
          String(
            rps?.NumeroRPS ||
              rps?.numeroRps ||
              rps?.numero_rps ||
              rps?.ChaveRPS?.NumeroRPS ||
              rps?.ChaveRPS?.numeroRps ||
              "",
          ).trim(),
        )
        .filter(Boolean);

      resolve(numeros);
    });
  });
}

const focusNfeService = new FocusNfeService();

export const NfseController = {
  /**
   * Envia lote de RPS para a Focus NFe
   * POST /api/nfse/enviar-lote
   * Body: { xml: string }
   */
  async enviarLoteRps(req: Request, res: Response) {
    try {
      const { xml } = req.body;

      if (!xml || typeof xml !== "string") {
        throw new BadRequestError("XML do lote não informado");
      }

      const result: any = await focusNfeService.enviarLoteRps(xml);
      const numerosRpsXml = await extrairNumerosRpsDoXml(xml);
      const resultados: any[] = Array.isArray(result)
        ? result
        : Array.isArray(result?.resultado)
          ? result.resultado
          : result
            ? [result]
            : [];

      if (resultados.length > 1 && numerosRpsXml.length > 0) {
        console.log(
          `[NFSe] XML contém ${numerosRpsXml.length} RPS e a resposta retornou ${resultados.length} itens`,
        );
      }

      for (let index = 0; index < resultados.length; index++) {
        const item = resultados[index] || {};
        const referenciaLote = extrairReferenciaLote(item, result?.ref || null);
        const numeroRpsXml = numerosRpsXml[index] || null;
        const numeroRpsRetorno = extrairNumeroRpsRetorno(item) || "";
        const numeroRps =
          extrairNumeroRpsDaReferencia(referenciaLote) ||
          numeroRpsRetorno ||
          numeroRpsXml ||
          "";

        if (!numeroRps) {
          console.warn(
            `[NFSe] Resultado sem número de RPS identificável no índice ${index}`,
          );
          continue;
        }

        if (numeroRpsXml && numeroRpsXml !== numeroRps) {
          console.warn(
            `[NFSe] Divergência de mapeamento no índice ${index}: XML=${numeroRpsXml} retorno=${numeroRps}`,
          );
        }

        if (numeroRpsRetorno && numeroRpsRetorno !== numeroRps) {
          console.warn(
            `[NFSe] Retorno da API indicou RPS ${numeroRpsRetorno}, mas a referência aponta para RPS ${numeroRps}`,
          );
        }

        if (numeroRpsXml && numeroRpsXml !== numeroRpsRetorno && numeroRpsRetorno) {
          console.warn(
            `[NFSe] Retorno da API trouxe RPS ${numeroRpsRetorno}, que não foi localizado no XML enviado`,
          );
        }

        const invoice =
          (referenciaLote &&
            (await InvoiceRepository.findByProtocoloLote(referenciaLote))) ||
          (await InvoiceRepository.findByRps_number(numeroRps));
        if (invoice) {
          const numeroNfse = extrairNumeroNfse(item);
          await InvoiceRepository.update(invoice.id, {
            status: item.status ? mapStatus(item.status) : null,
            ...(numeroNfse && { nfs_number: numeroNfse }),
            ...(referenciaLote && { protocolo_lote: referenciaLote }),
            xml_nfse: xml,
          });
        } else {
          console.warn(`[DB] RPS não encontrada: ${numeroRps}`);
        }
      }

      const protocolo =
        extrairReferenciaLote(Array.isArray(result) ? result[0] : result) ||
        extrairReferenciaLote(resultados[0]) ||
        null;

      return res.status(200).json({
        message: "Lote enviado com sucesso",
        protocolo,
        resultado: result,
      });
    } catch (error: any) {
      console.error("Erro ao enviar lote RPS:", error);
      return res.status(500).json({
        message: "Erro ao enviar lote RPS",
        error: error.message,
      });
    }
  },

  /**
   * Consulta status de uma RPS individual
   * GET /api/nfse/consultar-rps/:rps_number
   */
  async consultarRps(req: Request, res: Response) {
    try {
      const { rps_number } = req.params;

      if (!rps_number) {
        throw new BadRequestError("Número da RPS não informado");
      }

      const invoice = await InvoiceRepository.findByRps_number(rps_number);
      if (!invoice || !invoice.protocolo_lote) {
        return res.status(404).json({
          message:
            "RPS não encontrada ou sem protocolo_lote para consulta na FocusNFE",
        });
      }

      let result;
      try {
        result = await focusNfeService.consultarRps(invoice.protocolo_lote);

        const remoteStatus =
          (result && (result.status || result.Status)) || null;
        const mapped = mapStatus(remoteStatus);
        const updates: any = {};
        if (mapped && mapped !== invoice.status) updates.status = mapped;
        if (result?.url_danfse && result.url_danfse !== invoice.url_danfse)
          updates.url_danfse = result.url_danfse;
        if (Object.keys(updates).length > 0) {
          await InvoiceRepository.update(invoice.id, updates);
        }
      } catch (error: any) {
        if (error.message && error.message.includes("API Error 404")) {
          return res.status(404).json({
            message:
              "Lote não encontrado ou ainda não processado na FocusNFE. Aguarde alguns minutos e tente novamente.",
            error: error.message,
          });
        }
        return res.status(500).json({
          message: "Erro ao consultar RPS",
          error: error.message,
        });
      }

      return res.status(200).json({ resultado: result });
    } catch (error: any) {
      console.error("Erro ao consultar RPS:", error);
      return res.status(500).json({
        message: "Erro ao consultar RPS",
        error: error.message,
      });
    }
  },

  /**
   * Consulta status do lote pelo protocolo
   * GET /api/nfse/consultar-lote/:protocolo
   */
  async consultarLote(req: Request, res: Response) {
    try {
      const { protocolo } = req.params;

      if (!protocolo) {
        throw new BadRequestError("Protocolo não informado");
      }

      const result = await focusNfeService.consultarLote(protocolo);

      try {
        const handleSingle = async (obj: any) => {
          const rpsNum = obj.numero_rps || obj.numero || null;
          if (!rpsNum) return;
          const invoice = await InvoiceRepository.findByRps_number(
            String(rpsNum),
          );
          if (!invoice) return;
          const mapped = mapStatus(obj.status || obj.Status || null);
          const updates: any = {};
          if (mapped && mapped !== invoice.status) updates.status = mapped;
          if (obj?.url_danfse && obj.url_danfse !== invoice.url_danfse)
            updates.url_danfse = obj.url_danfse;
          if (Object.keys(updates).length > 0) {
            await InvoiceRepository.update(invoice.id, updates);
          }
        };

        if (Array.isArray(result)) {
          for (const item of result) {
            await handleSingle(item);
          }
        } else {
          await handleSingle(result);
        }
      } catch (errUpdate) {
        console.warn(
          "Falha ao atualizar invoice após consulta de lote:",
          errUpdate,
        );
      }

      return res.status(200).json({ resultado: result });
    } catch (error: any) {
      console.error("Erro ao consultar lote:", error);
      return res.status(500).json({
        message: "Erro ao consultar lote",
        error: error.message,
      });
    }
  },

  /**
   * Cancela uma NFS-e
   * DELETE /api/nfse/:referencia
   * Body: { referencia: string, justificativa: string }
   */
  async cancelarNfse(req: Request, res: Response) {
    try {
      const referencia =
        req.params.referencia ||
        req.body.referencia ||
        req.body.nfseNumber ||
        req.body.numeroNfse ||
        req.body.protocolo;
      const justificativa =
        req.body.justificativa ||
        req.body.motivo ||
        req.body.motivo_cancelamento;

      if (!referencia) {
        throw new BadRequestError("Referência da NFSe não informada");
      }

      if (!justificativa) {
        throw new BadRequestError("Justificativa do cancelamento não informada");
      }

      const justificativaFormatada = String(justificativa).trim();
      if (
        justificativaFormatada.length < 15 ||
        justificativaFormatada.length > 255
      ) {
        throw new BadRequestError(
          "Justificativa deve ter entre 15 e 255 caracteres",
        );
      }

      const invoice =
        (await InvoiceRepository.findByNfs_number(String(referencia).trim())) ||
        (await InvoiceRepository.findByRps_number(String(referencia).trim())) ||
        (await InvoiceRepository.findByProtocoloLote(
          String(referencia).trim(),
        ));

      const referenciaCancelamento =
        invoice?.protocolo_lote || String(referencia).trim();

      const result = await focusNfeService.cancelarNfse(
        referenciaCancelamento,
        justificativaFormatada,
      );

      const retornoStatus = extrairStatusRespostaFocusNfe(result);

      if (invoice && retornoStatus) {
        await InvoiceRepository.update(invoice.id, {
          status: retornoStatus,
        });
      }

      return res.status(200).json({
        message: "NFSe cancelada com sucesso",
        resultado: result,
      });
    } catch (error: any) {
      console.error("Erro ao cancelar NFSe:", error);
      return res.status(500).json({
        message: "Erro ao cancelar NFSe",
        error: error.message,
      });
    }
  },

  /**
   * Testa configuração do serviço
   * GET /api/nfse/testar-conexao
   */
  async testarConexao(req: Request, res: Response) {
    try {
      return res.status(200).json({
        message: "Serviço FocusNFE configurado com sucesso",
        ambiente: (process.env.FOCUS_NFE_API_URL || "").includes("homologacao")
          ? "HOMOLOGAÇÃO"
          : "PRODUÇÃO",
        prestador: {
          cnpj: process.env.PRESTADOR_CNPJ,
          inscricaoMunicipal: process.env.PRESTADOR_IM,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao verificar configuração",
        error: error.message,
      });
    }
  },
};
