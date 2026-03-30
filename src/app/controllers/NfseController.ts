import { Request, Response } from "express";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { getNfseService } from "../../services/NfseServiceAdapter";
import { NfseProvider } from "../../services/NfseServiceAdapter";
import { NfseSpService } from "../../services/NfseSpService";
import { BadRequestError } from "../helpers/api-errors";

function mapStatus(status?: string) {
  if (!status) return "";
  const s = String(status).toLowerCase();
  if (s.includes("autoriza") || s.includes("autoriz")) return "autorizada";
  if (s.includes("cancel")) return "cancelada";
  if (s.includes("erro")) return "erro_autorizacao";
  if (s.includes("process")) return "processando_autorizacao";
  return s;
}

export const NfseController = {
  /**
   * Consulta status de uma RPS individual (FocusNFE)
   * GET /api/nfse/consultar-rps/:rps_number
   * Query: { provider?: "prefeitura"|"focusnfe" }
   */
  async consultarRps(req: Request, res: Response) {
    try {
      const { rps_number } = req.params;
      const { provider } = req.query;

      if (!rps_number) {
        throw new BadRequestError("Número da RPS não informado");
      }

      const nfseService = getNfseService();
      if (provider) {
        nfseService.setProvider(provider as NfseProvider);
      }
      const activeProvider = nfseService.getProvider();

      // FocusNFE: consultar_nfse por protocolo_lote/ref
      // https://doc.focusnfe.com.br/reference/consultar_nfse
      let result;
      if (activeProvider === "focusnfe") {
        // Buscar invoice para obter protocolo_lote/ref
        const invoice = await InvoiceRepository.findByRps_number(rps_number);
        if (!invoice || !invoice.protocolo_lote) {
          return res.status(404).json({
            message:
              "RPS não encontrada ou sem protocolo_lote/ref para consulta na FocusNFE",
          });
        }
        try {
          result = await nfseService.consultarRps(invoice.protocolo_lote);
          // Atualiza status/url_danfse no DB se necessário
          try {
            const remoteStatus =
              (result && (result.status || result.Status)) || null;
            const mapped = mapStatus(remoteStatus);
            const updates: any = {};
            if (mapped && mapped !== invoice.status) updates.status = mapped;
            if (
              result &&
              result.url_danfse &&
              result.url_danfse !== invoice.url_danfse
            )
              updates.url_danfse = result.url_danfse;
            // Monta e salva xml_nfse quando disponível (FocusNFE)
            if (result && result.caminho_xml_nota_fiscal && result.url_danfse) {
              try {
                const caminho = String(result.caminho_xml_nota_fiscal || "");
                let xmlUrl: string | null = null;
                if (caminho.startsWith("/")) {
                  const u = new URL(String(result.url_danfse));
                  xmlUrl = `${u.origin}${caminho}`;
                } else {
                  const m = String(result.url_danfse).match(/\/(\d{6})\//);
                  if (m && m.index != null) {
                    const idx = m.index + m[0].length;
                    const base = String(result.url_danfse).slice(0, idx);
                    xmlUrl = base + caminho.replace(/^\//, "");
                  } else {
                    try {
                      const u = new URL(String(result.url_danfse));
                      xmlUrl = `${u.origin}/${caminho.replace(/^\//, "")}`;
                    } catch (e) {
                      xmlUrl = null;
                    }
                  }
                }
                if (xmlUrl) updates.xml_nfse = xmlUrl;
              } catch (e) {
                // ignore assembly errors
              }
            }
            if (Object.keys(updates).length > 0) {
              await InvoiceRepository.update(invoice.id, updates);
            }
          } catch (errUpdate) {
            console.warn(
              "Falha ao atualizar invoice após consulta RPS:",
              errUpdate,
            );
          }
        } catch (error: any) {
          // Tratamento especial para erro 404 FocusNFE
          if (error.message && error.message.includes("API Error 404")) {
            return res.status(404).json({
              message:
                "Lote não encontrado ou ainda não processado na FocusNFE. Aguarde alguns minutos e tente novamente.",
              error: error.message,
            });
          }
          // Outros erros
          return res.status(500).json({
            message: "Erro ao consultar RPS",
            error: error.message,
          });
        }
      } else {
        // Para prefeitura, não implementado
        return res.status(400).json({
          message:
            "Consulta de RPS individual não suportada para Prefeitura de SP",
        });
      }

      return res.status(200).json({
        provider: activeProvider,
        resultado: result,
      });
    } catch (error: any) {
      console.error("Erro ao consultar RPS:", error);
      return res.status(500).json({
        message: "Erro ao consultar RPS",
        error: error.message,
      });
    }
  },
  /**
   * Envia lote de RPS para a Prefeitura de SP ou Focus NFe (conforme NFSE_PROVIDER)
   * POST /api/nfse/enviar-lote
   * Body: { xml: string, provider?: "prefeitura"|"focusnfe", debug?: boolean }
   */
  async enviarLoteRps(req: Request, res: Response) {
    try {
      const { xml, debug, provider } = req.body;

      if (!xml || typeof xml !== "string") {
        throw new BadRequestError("XML do lote não informado");
      }

      // Criar serviço (usa adapter para provider switching)
      const nfseService = getNfseService();

      // Se especificou provider na request, usa esse
      if (provider) {
        nfseService.setProvider(provider as NfseProvider);
      }

      const activeProvider = nfseService.getProvider();

      // Se debug=true, retorna apenas o XML assinado sem enviar (apenas para Prefeitura)
      if (debug && activeProvider === "prefeitura") {
        const prefeituraService = new NfseSpService();
        const xmlSigned = (prefeituraService as any).signXml(xml);
        return res.status(200).json({
          message: "XML assinado (não enviado - modo debug)",
          provider: activeProvider,
          xmlAssinado: xmlSigned,
        });
      }

      const result = await nfseService.enviarLoteRps(xml);
      if (result) {
        if (Array.isArray(result)) {
          for (const rps of result) {
            if (rps.numero_rps) {
              const invoice = await InvoiceRepository.findByRps_number(
                rps.numero_rps,
              );
              if (invoice) {
                await InvoiceRepository.update(invoice.id, {
                  status: rps.status ? mapStatus(rps.status) : null,
                  protocolo_lote: rps.ref || null,
                  xml_nfse: xml,
                });
              } else {
                console.warn(`[DB] RPS não encontrada: ${rps.numero_rps}`);
              }
            }
          }
        } else if (result.numero_rps) {
          const invoice = await InvoiceRepository.findByRps_number(
            result.numero_rps,
          );
          if (invoice) {
            await InvoiceRepository.update(invoice.id, {
              status: result.status ? mapStatus(result.status) : null,
              protocolo_lote: result.ref || null,
              xml_nfse: xml,
            });
          } else {
            console.warn(`[DB] RPS não encontrada: ${result.numero_rps}`);
          }
        }
      }
      return res.status(200).json({
        message: "Lote enviado com sucesso",
        provider: activeProvider,
        protocolo: result.ref,
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
   * Consulta status do lote pelo protocolo
   * GET /api/nfse/consultar-lote/:protocolo
   * Query: { provider?: "prefeitura"|"focusnfe" }
   */
  async consultarLote(req: Request, res: Response) {
    try {
      const { protocolo } = req.params;
      const { provider, rps_number } = req.query;

      if (!protocolo) {
        throw new BadRequestError("Protocolo não informado");
      }

      const nfseService = getNfseService();
      if (provider) {
        nfseService.setProvider(provider as NfseProvider);
      }
      const activeProvider = nfseService.getProvider();

      let result;
      if (activeProvider === "focusnfe" && rps_number) {
        // Consulta de RPS individual via FocusNFE
        const rpsNum = Array.isArray(rps_number)
          ? rps_number[0]
          : typeof rps_number === "object"
            ? String(rps_number)
            : rps_number;
        result = await nfseService.consultarRps(String(rpsNum));
      } else {
        // Consulta de lote padrão
        result = await nfseService.consultarLote(protocolo);
        // Quando FocusNFE retorna resultado de lote, pode conter numero_rps/numero
        try {
          const handleSingle = async (obj: any) => {
            const rpsNum = obj.numero_rps || obj.numero || null;
            if (!rpsNum) return;
            const invoice = await InvoiceRepository.findByRps_number(
              String(rpsNum),
            );
            if (!invoice) return;
            const remoteStatus = obj.status || obj.Status || null;
            const mapped = mapStatus(remoteStatus);
            const updates: any = {};
            if (mapped && mapped !== invoice.status) updates.status = mapped;
            if (obj && obj.url_danfse && obj.url_danfse !== invoice.url_danfse)
              updates.url_danfse = obj.url_danfse;
            // Monta e salva xml_nfse quando disponível (FocusNFE)
            if (obj && obj.caminho_xml_nota_fiscal && obj.url_danfse) {
              try {
                const caminho = String(obj.caminho_xml_nota_fiscal || "");
                let xmlUrl: string | null = null;
                if (caminho.startsWith("/")) {
                  const u = new URL(String(obj.url_danfse));
                  xmlUrl = `${u.origin}${caminho}`;
                } else {
                  const m = String(obj.url_danfse).match(/\/(\d{6})\//);
                  if (m && m.index != null) {
                    const idx = m.index + m[0].length;
                    const base = String(obj.url_danfse).slice(0, idx);
                    xmlUrl = base + caminho.replace(/^\//, "");
                  } else {
                    try {
                      const u = new URL(String(obj.url_danfse));
                      xmlUrl = `${u.origin}/${caminho.replace(/^\//, "")}`;
                    } catch (e) {
                      xmlUrl = null;
                    }
                  }
                }
                if (xmlUrl) updates.xml_nfse = xmlUrl;
              } catch (e) {
                // ignore
              }
            }
            if (Object.keys(updates).length > 0) {
              await InvoiceRepository.update(invoice.id, updates);
            }
          };

          if (Array.isArray(result)) {
            for (const item of result) {
              // eslint-disable-next-line no-await-in-loop
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
      }

      return res.status(200).json({
        provider: activeProvider,
        resultado: result,
      });
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
   * POST /api/nfse/cancelar
   * Body: { nfseNumber: string, motivo: string, provider?: "prefeitura"|"focusnfe" }
   */
  async cancelarNfse(req: Request, res: Response) {
    try {
      const { nfseNumber, motivo, provider } = req.body;

      if (!nfseNumber || !motivo) {
        throw new BadRequestError("Número da NFS-e e motivo são obrigatórios");
      }

      const nfseService = getNfseService();

      if (provider) {
        nfseService.setProvider(provider);
      }

      const activeProvider = nfseService.getProvider();
      console.log(`❌ Cancelando ${nfseNumber} via ${activeProvider}...`);

      const result = await nfseService.cancelarNfse(nfseNumber, motivo);

      // Atualizar status no banco (se necessário)
      const invoice = await InvoiceRepository.findByNfs_number(nfseNumber);
      if (invoice) {
        // TODO: Adicionar campo de status cancelado
        // await InvoiceRepository.update(invoice.id, { status: 'CANCELADO' });
      }

      return res.status(200).json({
        message: "NFS-e cancelada com sucesso",
        provider: activeProvider,
        resultado: result,
      });
    } catch (error: any) {
      console.error("Erro ao cancelar NFS-e:", error);
      return res.status(500).json({
        message: "Erro ao cancelar NFS-e",
        error: error.message,
      });
    }
  },

  /**
   * Testa conexão com o webservice (útil para validar certificado)
   * GET /api/nfse/testar-conexao
   * Query: { provider?: "prefeitura"|"focusnfe" }
   */
  async testarConexao(req: Request, res: Response) {
    try {
      const { provider } = req.query;

      const nfseService = getNfseService();

      if (provider) {
        nfseService.setProvider(provider as NfseProvider);
      }

      const activeProvider = nfseService.getProvider();

      return res.status(200).json({
        message: "Serviço configurado com sucesso",
        provider: activeProvider,
        ambiente: process.env.SOAP_ENDPOINT?.includes("homologacao")
          ? "HOMOLOGAÇÃO"
          : "PRODUÇÃO",
        prestador: {
          cnpj: process.env.PRESTADOR_CNPJ,
          inscricaoMunicipal: process.env.PRESTADOR_IM,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao conectar",
        error: error.message,
      });
    }
  },
};
