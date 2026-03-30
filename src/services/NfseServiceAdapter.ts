/**
 * Adapter que permite alternar entre:
 * 1. NfseSpService - Integração direta com webservice da Prefeitura (interno)
 * 2. FocusNfeService - Integração com API Focus NFe (terceirizado)
 *
 * Uso: Permite manter ambos os códigos enquanto o webservice da Prefeitura se estabiliza
 */

import { NfseSpService } from "./NfseSpService";
import { FocusNfeService } from "./FocusNfeService";

export type NfseProvider = "prefeitura" | "focusnfe";

export interface INfseService {
  enviarLoteRps(xml: string): Promise<any>;
  consultarLote(numeroProtocolo: string): Promise<any>;
  cancelarNfse(numeroNfse: string, motivo: string): Promise<any>;
  consultarRps(rps_number: string): Promise<any>;
}

export class NfseServiceAdapter implements INfseService {
  private prefeituraService: NfseSpService;
  private focusNfeService: FocusNfeService;
  private provider: NfseProvider;

  constructor(provider: NfseProvider = "prefeitura") {
    this.prefeituraService = new NfseSpService();
    this.focusNfeService = new FocusNfeService();
    this.provider = provider;

    console.log(`🔄 NfseServiceAdapter inicializado com provider: ${provider}`);
  }

  /**
   * Alterna o provider de serviço
   */
  setProvider(provider: NfseProvider): void {
    this.provider = provider;
    console.log(`✅ Provider alterado para: ${provider}`);
  }

  /**
   * Retorna o provider atual
   */
  getProvider(): NfseProvider {
    return this.provider;
  }

  /**
   * Envia lote de RPS usando o provider configurado
   */
  async enviarLoteRps(xml: string): Promise<any> {
    if (this.provider === "prefeitura") {
      console.log("📤 Enviando via Prefeitura (webservice interno)...");
      return this.prefeituraService.enviarLoteRps(xml);
    } else {
      console.log("📤 Enviando via Focus NFe (terceirizado)...");
      return this.focusNfeService.enviarLoteRps(xml);
    }
  }

  /**
   * Consulta status de uma RPS individual (apenas FocusNFE)
   */
  async consultarRps(rps_number: string): Promise<any> {
    if (this.provider === "focusnfe") {
      return this.focusNfeService.consultarRps(rps_number);
    } else {
      throw new Error(
        "Consulta de RPS individual não suportada para Prefeitura de SP",
      );
    }
  }

  /**
   * Consulta lote usando o provider configurado
   */
  async consultarLote(numeroProtocolo: string): Promise<any> {
    if (this.provider === "prefeitura") {
      console.log("🔍 Consultando via Prefeitura (webservice interno)...");
      return this.prefeituraService.consultarLote(numeroProtocolo);
    } else {
      console.log("🔍 Consultando via Focus NFe (terceirizado)...");
      return this.focusNfeService.consultarLote(numeroProtocolo);
    }
  }

  /**
   * Cancela NFS-e usando o provider configurado
   */
  async cancelarNfse(numeroNfse: string, motivo: string): Promise<any> {
    if (this.provider === "prefeitura") {
      console.log("❌ Cancelando via Prefeitura (webservice interno)...");
      return this.prefeituraService.cancelarNfse(numeroNfse, motivo);
    } else {
      console.log("❌ Cancelando via Focus NFe (terceirizado)...");
      return this.focusNfeService.cancelarNfse(numeroNfse, motivo);
    }
  }

  /**
   * Retorna qual serviço está ativo
   */
  getActiveService(): INfseService {
    if (this.provider === "prefeitura") {
      // Retorna objeto que implementa todos métodos da interface
      return {
        enviarLoteRps: this.prefeituraService.enviarLoteRps.bind(
          this.prefeituraService,
        ),
        consultarLote: this.prefeituraService.consultarLote.bind(
          this.prefeituraService,
        ),
        cancelarNfse: this.prefeituraService.cancelarNfse.bind(
          this.prefeituraService,
        ),
        consultarRps: async (rps_number: string) => {
          throw new Error(
            "Consulta de RPS individual não suportada para Prefeitura de SP",
          );
        },
      };
    } else {
      return this.focusNfeService;
    }
  }
}

// Exportar singleton com config via .env
export const getNfseService = (): NfseServiceAdapter => {
  const provider = (process.env.NFSE_PROVIDER || "focusnfe") as NfseProvider;
  return new NfseServiceAdapter(provider);
};
