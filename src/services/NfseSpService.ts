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

  // Adicione esta função auxiliar para garantir que o certificado seja APENAS base64
  private obterCertificadoLimpo(): string {
    const matches = this.cert.match(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/);
    const base64 = matches ? matches[1] : this.cert;
    return base64.replace(/\s+/g, ""); // Remove espaços, tabs e quebras de linha
  }

  private cleanCertificate(cert: string): string {
    // Remove tudo que não está entre os marcadores BEGIN e END
    const matches = cert.match(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/);
    if (matches && matches[1]) {
      return matches[1].replace(/\s+/g, ""); // Remove quebras de linha e espaços
    }
    // Fallback caso o arquivo já venha limpo, mas removendo lixo de "BagAttributes"
    return cert.replace(/BagAttributes[\s\S]*?MII/g, "MII").replace(/\s+/g, "");
  }

  /**
   * Assina XML com certificado digital conforme padrão da Prefeitura de SP
   * A assinatura deve ser inserida após todos os RPS, antes de fechar </PedidoEnvioLoteRPS>
   */
  // Se estiver usando TypeScript, defina o tipo para o certificado se necessário
  private signXml(xml: string): string {
    try {
      const certLimpo = this.obterCertificadoLimpo();

      // 1. Minificação Radical - Sem isso, SP não aceita.
      const xmlMinificado = xml
        .replace(/>\s+</g, "><")
        .replace(/\r?\n|\r/g, "")
        .trim();

      const sig = new SignedXml({
        privateKey: this.key,
        // SP exige C14N inclusivo (20010315)
        canonicalizationAlgorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
      });

      // 2. A Referência deve ser exatamente assim:
      sig.addReference({
        xpath: "//*[local-name(.)='PedidoEnvioLoteRPS']",
        uri: "", // Assina o documento todo
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
        transforms: [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/TR/2001/REC-xml-c14n-20010315", // Canonicalização no transform
        ],
      });

      // 3. Calcula a Assinatura
      sig.computeSignature(xmlMinificado, {
        location: { reference: "//*[local-name(.)='PedidoEnvioLoteRPS']", action: "append" },
        prefix: ""
      });

      let signedXml = sig.getSignedXml();

      // 4. LIMPEZA MANUAL CIRÚRGICA (Não use bibliotecas aqui, use Replace)
      // Removemos qualquer Id que a lib tenha tentado criar (ex: Id="_0")
      signedXml = signedXml.replace(/\sId="[^"]*"/g, "");

      // SP exige que as tags DS não tenham prefixo
      signedXml = signedXml.replace(/<ds:/g, "<").replace(/<\/ds:/g, "</");

      // Garante que a Signature tenha o namespace correto e esteja colada no conteúdo
      signedXml = signedXml.replace(/<Signature[^>]*>/, '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">');

      // 5. Injeta o KeyInfo (Certificado) que você já limpou do erro 1001
      const keyInfoTag = `<KeyInfo><X509Data><X509Certificate>${certLimpo}</X509Certificate></X509Data></KeyInfo>`;
      signedXml = signedXml.replace("</SignatureValue>", `</SignatureValue>${keyInfoTag}`);

      // Remove declaração XML e garante que não existam novos espaços
      return signedXml.replace(/<\?xml.*?\?>/i, "").replace(/>\s+</g, "><");
    } catch (error) {
      throw error;
    }
  }

  async enviarLoteRps(xml: string): Promise<any> {
    try {
      const xmlSigned = this.signXml(xml);

      const wsdlPath = path.resolve(__dirname, "../../wsdl/lotenfe.wsdl");
      const client = await soap.createClientAsync(wsdlPath, {
        endpoint: this.config.soapEndpoint,
        disableCache: true,
        // FORÇA O SOAP A NÃO FORMATAR O XML (CRUCIAL)
        preserveWhitespace: true,
      });

      client.setSecurity(
        new soap.ClientSSLSecurity(
          path.resolve(this.config.keyPath),
          path.resolve(this.config.certPath),
          { rejectUnauthorized: false }
        )
      );

      // 3. ENVIO BLINDADO
      // Usamos o objeto com _xml para dizer ao node-soap: "não processe esta string, apenas envie"
      const result = await client.EnvioLoteRPSAsync({
        VersaoSchema: 1,
        MensagemXML: { _xml: `<![CDATA[${xmlSigned}]]>` },
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
