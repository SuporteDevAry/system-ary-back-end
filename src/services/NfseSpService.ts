import fs from "fs";
import path from "path";
import https from "https";
import { SignedXml } from "xml-crypto";
import { parseString } from "xml2js";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import * as soap from "soap";

interface NfseSoapConfig {
  wsdlUrl: string;
  soapEndpoint: string;
  certPath: string;
  keyPath: string;
}

export class NfseSpService {
  private config: NfseSoapConfig;
  private cert: string;
  private key: string;

  constructor() {
    this.config = {
      wsdlUrl: process.env.WSDL_URL || "",
      soapEndpoint: process.env.SOAP_ENDPOINT || "",
      certPath: process.env.CERT_PEM_PATH || "./certificates/cert.pem",
      keyPath: process.env.KEY_PEM_PATH || "./certificates/key.pem",
    };

    // Carregar certificado e chave
    try {
      this.cert = fs.readFileSync(path.resolve(this.config.certPath), "utf8");
      this.key = fs.readFileSync(path.resolve(this.config.keyPath), "utf8");
    } catch (error) {
      console.error("❌ Erro ao carregar certificados:", error);
      throw new Error(
        "Certificados não encontrados. Execute o script convertPfxToPem.ts primeiro."
      );
    }
  }

  /**
   * Assina XML com certificado digital conforme padrão da Prefeitura de SP
   * A assinatura deve ser inserida após todos os RPS, antes de fechar </PedidoEnvioRPS>
   */
  private signXml(xml: string): string {
    try {
      // Parse o XML usando xmldom
      const doc = new DOMParser().parseFromString(xml, "text/xml");

      const sig = new SignedXml({
        privateKey: this.key,
        canonicalizationAlgorithm: "http://www.w3.org/2001/10/xml-exc-c14n#",
        signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
      });

      // Adiciona referência para todo o documento PedidoEnvioRPS
      sig.addReference({
        xpath: "//*[local-name(.)='PedidoEnvioRPS']",
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
        transforms: [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        ],
      });

      // Computa a assinatura passando o documento DOM
      sig.computeSignature(xml, {
        location: {
          reference: "//*[local-name(.)='PedidoEnvioRPS']",
          action: "append",
        },
      });

      const signedXml = sig.getSignedXml();

      // Remover quebras de linha e espaços extras para enviar compactado
      const minifiedXml = signedXml
        .replace(/>\s+</g, "><") // Remove espaços entre tags
        .replace(/\n/g, "") // Remove quebras de linha
        .replace(/\r/g, ""); // Remove carriage returns

      console.log("✅ XML assinado e minificado com sucesso");
      return minifiedXml;
    } catch (error) {
      console.error("❌ Erro ao assinar XML:", error);
      throw new Error(`Falha ao assinar XML: ${error}`);
    }
  }

  /**
   * Envia lote de RPS para a Prefeitura de SP
   * @param xml - XML já formatado do PedidoEnvioRPS
   */
  async enviarLoteRps(xml: string): Promise<any> {
    try {
      // Assinar o XML antes de enviar
      const xmlSigned = this.signXml(xml);

      // Usar WSDL local para evitar erro 403
      const wsdlPath = path.resolve(__dirname, "../../wsdl/lotenfe.wsdl");

      // Criar cliente SOAP usando arquivo WSDL local
      const client = await soap.createClientAsync(wsdlPath, {
        endpoint: this.config.soapEndpoint,
        disableCache: true,
      });

      // Adicionar certificado ao cliente SOAP (passar caminhos dos arquivos)
      client.setSecurity(
        new soap.ClientSSLSecurity(
          path.resolve(this.config.keyPath),
          path.resolve(this.config.certPath),
          {
            rejectUnauthorized: false,
          }
        )
      );

      // Enviar lote - XML como string simples
      const result = await client.EnvioLoteRPSAsync({
        VersaoSchema: 1,
        MensagemXML: xmlSigned,
      });

      return this.parseResponse(result);
    } catch (error: any) {
      console.error("❌ Erro ao enviar lote RPS:", error);
      throw new Error(`Falha no envio: ${error.message}`);
    }
  }

  /**
   * Consulta lote de RPS pelo número do protocolo
   */
  async consultarLote(numeroProtocolo: string): Promise<any> {
    try {
      const client = await soap.createClientAsync(this.config.wsdlUrl, {
        endpoint: this.config.soapEndpoint,
      });

      client.setSecurity(
        new soap.ClientSSLSecurity(this.key, this.cert, {
          rejectUnauthorized: false,
        })
      );

      const result = await client.ConsultaLoteRPSAsync({
        NumeroProtocolo: numeroProtocolo,
        InscricaoPrestador: process.env.PRESTADOR_IM,
      });

      return this.parseResponse(result);
    } catch (error: any) {
      console.error("❌ Erro ao consultar lote:", error);
      throw new Error(`Falha na consulta: ${error.message}`);
    }
  }

  /**
   * Cancela NFS-e
   */
  async cancelarNfse(numeroNfse: string, motivo: string): Promise<any> {
    try {
      const client = await soap.createClientAsync(this.config.wsdlUrl, {
        endpoint: this.config.soapEndpoint,
      });

      client.setSecurity(
        new soap.ClientSSLSecurity(this.key, this.cert, {
          rejectUnauthorized: false,
        })
      );

      const result = await client.CancelamentoNFSeAsync({
        InscricaoPrestador: process.env.PRESTADOR_IM,
        NumeroNFe: numeroNfse,
        MotivoCancelamento: motivo,
      });

      return this.parseResponse(result);
    } catch (error: any) {
      console.error("❌ Erro ao cancelar NFS-e:", error);
      throw new Error(`Falha no cancelamento: ${error.message}`);
    }
  }

  /**
   * Parse da resposta SOAP
   */
  private parseResponse(response: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const xmlResponse = response[0]?.RetornoXML || response[0];

      parseString(xmlResponse, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
