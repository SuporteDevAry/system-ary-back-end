import { Request, Response } from "express";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { FocusNfeService } from "../../services/FocusNfeService";
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

      const result = await focusNfeService.enviarLoteRps(xml);

      if (result) {
        if (Array.isArray(result)) {
          for (const rps of result) {
            if (rps.numero_rps) {
              const invoice = await InvoiceRepository.findByRps_number(rps.numero_rps);
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
          const invoice = await InvoiceRepository.findByRps_number(result.numero_rps);
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
          message: "RPS não encontrada ou sem protocolo_lote para consulta na FocusNFE",
        });
      }

      let result;
      try {
        result = await focusNfeService.consultarRps(invoice.protocolo_lote);

        const remoteStatus = (result && (result.status || result.Status)) || null;
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
            message: "Lote não encontrado ou ainda não processado na FocusNFE. Aguarde alguns minutos e tente novamente.",
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
          const invoice = await InvoiceRepository.findByRps_number(String(rpsNum));
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
        console.warn("Falha ao atualizar invoice após consulta de lote:", errUpdate);
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
   * POST /api/nfse/cancelar
   * Body: { nfseNumber: string, motivo: string }
   */
  async cancelarNfse(req: Request, res: Response) {
    try {
      const { nfseNumber, motivo } = req.body;

      if (!nfseNumber || !motivo) {
        throw new BadRequestError("Número da NFS-e e motivo são obrigatórios");
      }

      const result = await focusNfeService.cancelarNfse(nfseNumber, motivo);

      return res.status(200).json({
        message: "NFS-e cancelada com sucesso",
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
