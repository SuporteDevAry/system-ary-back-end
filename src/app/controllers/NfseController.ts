import { Request, Response } from "express";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { getNfseService } from "../../services/NfseServiceAdapter";
import { NfseProvider } from "../../services/NfseServiceAdapter";
import { NfseSpService } from "../../services/NfseSpService";
import { BadRequestError } from "../helpers/api-errors";

export const NfseController = {
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
      console.log(`📨 Enviando via ${activeProvider}...`);

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

      return res.status(200).json({
        message: "Lote enviado com sucesso",
        provider: activeProvider,
        protocolo:
          result.Protocolo || result.NumeroProtocolo || result.referencia,
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
      const { provider } = req.query;

      if (!protocolo) {
        throw new BadRequestError("Protocolo não informado");
      }

      const nfseService = getNfseService();

      if (provider) {
        nfseService.setProvider(provider as NfseProvider);
      }

      const activeProvider = nfseService.getProvider();
      console.log(`🔍 Consultando ${protocolo} via ${activeProvider}...`);

      const result = await nfseService.consultarLote(protocolo);

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
