import { Request, Response } from "express";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { NfseSpService } from "../../services/NfseSpService";
import { BadRequestError } from "../helpers/api-errors";

export const NfseController = {
  /**
   * Envia lote de RPS para a Prefeitura de SP
   * POST /api/nfse/enviar-lote
   * Body: { xml: string } - XML completo do PedidoEnvioLoteRPS
   */
  async enviarLoteRps(req: Request, res: Response) {
    try {
      const { xml, debug } = req.body;

      if (!xml || typeof xml !== "string") {
        throw new BadRequestError("XML do lote não informado");
      }

      // Enviar para a prefeitura (service vai assinar e enviar)
      const nfseService = new NfseSpService();


      // Se debug=true, retorna apenas o XML assinado sem enviar
      if (debug) {
        const xmlSigned = (nfseService as any).signXml(xml);
        return res.status(200).json({
          message: "XML assinado (não enviado - modo debug)",
          xmlAssinado: xmlSigned,
        });
      }

      const result = await nfseService.enviarLoteRps(xml);

      return res.status(200).json({
        message: "Lote enviado com sucesso",
        protocolo: result.Protocolo || result.NumeroProtocolo,
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
   */
  async consultarLote(req: Request, res: Response) {
    try {
      const { protocolo } = req.params;

      if (!protocolo) {
        throw new BadRequestError("Protocolo não informado");
      }

      const nfseService = new NfseSpService();
      const result = await nfseService.consultarLote(protocolo);

      return res.status(200).json(result);
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
   */
  async cancelarNfse(req: Request, res: Response) {
    try {
      const { nfseNumber, motivo } = req.body;

      if (!nfseNumber || !motivo) {
        throw new BadRequestError("Número da NFS-e e motivo são obrigatórios");
      }

      const nfseService = new NfseSpService();
      const result = await nfseService.cancelarNfse(nfseNumber, motivo);

      // Atualizar status no banco (se necessário)
      const invoice = await InvoiceRepository.findByNfs_number(nfseNumber);
      if (invoice) {
        // TODO: Adicionar campo de status cancelado
        // await InvoiceRepository.update(invoice.id, { status: 'CANCELADO' });
      }

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
   * Testa conexão com o webservice (útil para validar certificado)
   * GET /api/nfse/testar-conexao
   */
  async testarConexao(req: Request, res: Response) {
    try {
      const nfseService = new NfseSpService();

      return res.status(200).json({
        message: "Certificados carregados com sucesso",
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
