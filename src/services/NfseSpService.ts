import fs from "fs";
import path from "path";
import https from "https";
import { SignedXml } from "xml-crypto";
import { parseString } from "xml2js";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import * as soap from "soap";
import crypto from "crypto";

interface NfseSoapConfig {
  wsdlUrl: string;
  soapEndpoint: string;
  certPath: string;
  keyPath: string;
}

// Interface para os novos campos da Reforma Tributária v02 (IBS/CBS)
interface InfoComplementaresData {
  cClassTrib?: string; // Código de Classificação Tributária
  cNBS?: string; // Código NBS
  CST?: string; // Código de Situação Tributária
  vServPrest: string; // Valor do Serviço Prestado
  vBC: string; // Valor Base de Cálculo
  pAliq?: string; // Percentual de Alíquota
  vTributo?: string; // Valor do Tributo
  vBCIBS?: string; // Base de Cálculo IBS
  pAliqIBS?: string; // Alíquota IBS
  vIBS?: string; // Valor IBS
  vBCCBS?: string; // Base de Cálculo CBS
  pAliqCBS?: string; // Alíquota CBS
  vCBS?: string; // Valor CBS
  cMunIncid?: string; // Código Município de Incidência
  uf?: string; // UF
  verProc?: string; // Versão do Processo
}

export class NfseSpService {
  /**
   * Consulta status de uma RPS individual (não implementado para Prefeitura)
   */
  async consultarRps(rps_number: string): Promise<any> {
    throw new Error(
      "Consulta de RPS individual não suportada para Prefeitura de SP",
    );
  }
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
        "Certificados não encontrados. Execute o script convertPfxToPem.ts primeiro.",
      );
    }
  }

  // Adicione esta função auxiliar para garantir que o certificado seja APENAS base64
  private obterCertificadoLimpo(): string {
    const matches = this.cert.match(
      /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/,
    );
    const base64 = matches ? matches[1] : this.cert;
    return base64.replace(/\s+/g, ""); // Remove espaços, tabs e quebras de linha
  }

  private cleanCertificate(cert: string): string {
    // Remove tudo que não está entre os marcadores BEGIN e END
    const matches = cert.match(
      /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/,
    );
    if (matches && matches[1]) {
      return matches[1].replace(/\s+/g, ""); // Remove quebras de linha e espaços
    }
    // Fallback caso o arquivo já venha limpo, mas removendo lixo de "BagAttributes"
    return cert.replace(/BagAttributes[\s\S]*?MII/g, "MII").replace(/\s+/g, "");
  }

  /**
   * Monta a estrutura InfoComplementares com campos obrigatórios da Reforma Tributária v02
   * Adiciona campos de IBS/CBS conforme exigido desde 01/01/2026
   */
  private montarInfoComplementares(data: InfoComplementaresData): string {
    const dhEmissao = new Date().toISOString().split(".")[0]; // Formato: YYYY-MM-DDTHH:MM:SS
    const valorServico = parseFloat(data.vServPrest);

    // Valores padrão para São Paulo
    const cClassTrib = data.cClassTrib || "01";
    const CST = data.CST || "00"; // 00 = Tributação normal
    const cNBS = data.cNBS || "1.0101.00.00"; // Código NBS genérico - ajustar conforme serviço
    const cMunIncid = data.cMunIncid || "3550308"; // São Paulo/SP
    const uf = data.uf || "SP";
    const verProc = data.verProc || "1.0.0";

    // Cálculos de IBS e CBS (valores padrão: 2,5% cada)
    const pAliqIBS = data.pAliqIBS || "2.50";
    const pAliqCBS = data.pAliqCBS || "2.50";
    const vBCIBS = data.vBCIBS || data.vServPrest;
    const vBCCBS = data.vBCCBS || data.vServPrest;
    const vIBS = data.vIBS || (valorServico * 0.025).toFixed(2);
    const vCBS = data.vCBS || (valorServico * 0.025).toFixed(2);

    // Cálculo do tributo total (ISS)
    const pAliq = data.pAliq || "5.00";
    const vTributo = data.vTributo || (valorServico * 0.05).toFixed(2);

    let xml = `<InfoComplementares>`;
    xml += `<cClassTrib>${cClassTrib}</cClassTrib>`;
    xml += `<cEnqTribCoop></cEnqTribCoop>`;
    xml += `<dhEmissao>${dhEmissao}</dhEmissao>`;
    xml += `<tpEmissao>1</tpEmissao>`;
    xml += `<verProc>${verProc}</verProc>`;

    xml += `<infServ>`;
    xml += `<CST>${CST}</CST>`;
    xml += `<cNBS>${cNBS}</cNBS>`;
    xml += `<vServPrest>${data.vServPrest}</vServPrest>`;
    xml += `<vBC>${data.vBC}</vBC>`;
    xml += `<pAliq>${pAliq}</pAliq>`;
    xml += `<vTributo>${vTributo}</vTributo>`;

    xml += `<vBCIBS>${vBCIBS}</vBCIBS>`;
    xml += `<pAliqIBS>${pAliqIBS}</pAliqIBS>`;
    xml += `<vIBS>${vIBS}</vIBS>`;

    xml += `<vBCCBS>${vBCCBS}</vBCCBS>`;
    xml += `<pAliqCBS>${pAliqCBS}</pAliqCBS>`;
    xml += `<vCBS>${vCBS}</vCBS>`;
    xml += `</infServ>`;

    xml += `<infLocalPrest>`;
    xml += `<cMunIncid>${cMunIncid}</cMunIncid>`;
    xml += `<UF>${uf}</UF>`;
    xml += `</infLocalPrest>`;
    xml += `</InfoComplementares>`;

    return xml;
  }

  /**
   * Calcula a assinatura SHA-1 de um RPS específico
   * Formato: IM + SerieRPS + NumRPS(12) + DataEmissao + TribRPS + StatusRPS + ISSRetido +
   *          ValorServicos(15) + ValorDeducoes(15) + CodigoServico(5) + AliqServ(5) + ValorPIS...CSLL + CNPJ/CPF
   */
  private calcularAssinaturaRPS(rpsData: {
    inscricaoPrestador: string;
    serieRPS: string;
    numeroRPS: string;
    dataEmissao: string; // YYYY-MM-DD
    tributacaoRPS: string;
    statusRPS: string;
    issRetido: string; // "true" ou "false"
    valorServicos: string;
    valorDeducoes: string;
    codigoServico: string;
    aliquotaServicos: string;
    valorPIS: string;
    valorCOFINS: string;
    valorINSS: string;
    valorIR: string;
    valorCSLL: string;
    cpfCnpjTomador: string;
  }): string {
    // Constrói a string conforme especificação da Prefeitura
    const im = rpsData.inscricaoPrestador.padStart(8, "0");
    const serie = rpsData.serieRPS.padEnd(5, " ");
    const numero = rpsData.numeroRPS.padStart(12, "0");
    const data = rpsData.dataEmissao.replace(/-/g, ""); // YYYYMMDD
    const trib = rpsData.tributacaoRPS;
    const status = rpsData.statusRPS;
    const iss = rpsData.issRetido === "true" ? "S" : "N";

    // Valores monetários sem ponto decimal, 15 dígitos
    const formatarValor = (valor: string, tamanho: number = 15) => {
      const num = Math.round(parseFloat(valor) * 100); // Converte para centavos
      return num.toString().padStart(tamanho, "0");
    };

    const valServ = formatarValor(rpsData.valorServicos);
    const valDed = formatarValor(rpsData.valorDeducoes);
    // CodServ: Código real do serviço, 5 dígitos (ex: 06298)
    const codServ = rpsData.codigoServico.padStart(5, "0");

    // Alíquota: 1 dígito apenas, SEM padding! (ex: 2%, 5%, 10%)
    const aliqFloat = parseFloat(rpsData.aliquotaServicos) * 100; // 0.02 → 2.0
    const aliq = Math.round(aliqFloat).toString(); // "2" (SEM padStart!)

    // IMPORTANTE: A Prefeitura NÃO inclui PIS, COFINS, INSS, IR, CSLL na assinatura!
    // Formato: IM(8) + Serie(5) + Num(12) + Data(8) + Trib(1) + Status(1) + ISS(1) +
    //          ValServ(15) + ValDed(15) + CodServ(5 zeros!) + Aliq(1) + CNPJ(14) = 86 chars

    const cpfCnpj = rpsData.cpfCnpjTomador.padStart(14, "0");

    const stringAssinatura =
      im +
      serie +
      numero +
      data +
      trib +
      status +
      iss +
      valServ +
      valDed +
      codServ +
      aliq +
      cpfCnpj;

    console.log("📝 Componentes da assinatura:");
    console.log(`  IM: [${im}] (${im.length})`);
    console.log(`  Serie: [${serie}] (${serie.length})`);
    console.log(`  Numero: [${numero}] (${numero.length})`);
    console.log(`  Data: [${data}] (${data.length})`);
    console.log(`  Trib: [${trib}] (${trib.length})`);
    console.log(`  Status: [${status}] (${status.length})`);
    console.log(`  ISS: [${iss}] (${iss.length})`);
    console.log(`  ValServ: [${valServ}] (${valServ.length})`);
    console.log(`  ValDed: [${valDed}] (${valDed.length})`);
    console.log(`  CodServ: [${codServ}] (${codServ.length})`);
    console.log(`  Aliq: [${aliq}] (${aliq.length})`);
    console.log(`  CNPJ: [${cpfCnpj}] (${cpfCnpj.length})`);
    console.log(
      `📝 String completa (${stringAssinatura.length} chars):`,
      stringAssinatura,
    );

    // Calcula SHA-1
    // Testa com uppercase (padrão) e lowercase
    const hashUppercase = crypto
      .createHash("sha1")
      .update(stringAssinatura, "ascii")
      .digest("hex")
      .toUpperCase();

    const hashLowercase = crypto
      .createHash("sha1")
      .update(stringAssinatura, "ascii")
      .digest("hex")
      .toLowerCase();

    console.log(`🔐 Hash SHA-1 UPPERCASE: ${hashUppercase}`);
    console.log(`🔐 Hash SHA-1 lowercase: ${hashLowercase}`);

    // Testa também outros encodings
    const hashUTF8 = crypto
      .createHash("sha1")
      .update(stringAssinatura, "utf8")
      .digest("hex")
      .toUpperCase();
    console.log(`🔐 Hash SHA-1 UTF-8: ${hashUTF8}`);

    return hashUppercase;
  }

  /**
   * Adiciona InfoComplementares (campos da Reforma Tributária v02) a cada RPS que não tenha
   * Obrigatório desde 01/01/2026 para NFS-e de São Paulo
   */
  private adicionarInfoComplementaresSeNecessario(xml: string): string {
    console.log("🔍 Verificando se precisa adicionar InfoComplementares...");

    // Regex para encontrar cada RPS
    const rpsRegex = /<RPS[^>]*>([\s\S]*?)<\/RPS>/g;
    let match;
    let xmlModificado = xml;

    while ((match = rpsRegex.exec(xml)) !== null) {
      const rpsCompleto = match[0];
      const rpsConteudo = match[1];

      // Verifica se já tem InfoComplementares
      if (rpsConteudo.includes("<InfoComplementares>")) {
        console.log("✅ RPS já possui InfoComplementares, mantendo...");
        continue;
      }

      console.log("⚠️  RPS sem InfoComplementares, adicionando...");

      // Extrai ValorServicos para cálculos
      const valorServicosMatch = rpsConteudo.match(
        /<ValorServicos>([^<]+)<\/ValorServicos>/,
      );
      const valorServicos = valorServicosMatch ? valorServicosMatch[1] : "0.00";

      // Extrai código do município (se existir)
      const munPrestMatch = rpsConteudo.match(
        /<MunicipioPrestacao>([^<]+)<\/MunicipioPrestacao>/,
      );
      const cMunIncid = munPrestMatch ? munPrestMatch[1] : "3550308";

      // Monta InfoComplementares
      const infoComplementares = this.montarInfoComplementares({
        vServPrest: valorServicos,
        vBC: valorServicos,
        cMunIncid: cMunIncid,
        uf: "SP",
      });

      // Adiciona InfoComplementares antes de fechar </RPS>
      // Posição ideal: após <Discriminacao> ou último campo antes de </RPS>
      const rpsModificado = rpsCompleto.replace(
        "</RPS>",
        `${infoComplementares}</RPS>`,
      );

      xmlModificado = xmlModificado.replace(rpsCompleto, rpsModificado);
    }

    return xmlModificado;
  }

  /**
   * Preenche o campo <Assinatura> de cada RPS no XML usando regex (sem DOMParser)
   */
  private preencherAssinaturasRPS(xml: string): string {
    // Procura por cada bloco <RPS>...</RPS> no XML
    const rpsRegex = /<RPS[^>]*>([\s\S]*?)<\/RPS>/g;

    let match;
    let resultado = xml;

    while ((match = rpsRegex.exec(xml)) !== null) {
      const rpsCompleto = match[0]; // Todo o bloco <RPS>...</RPS>
      const rpsConteudo = match[1]; // Conteúdo interno

      // Extrai valores usando regex
      const extrairValor = (tag: string, conteudo: string): string => {
        const regex = new RegExp(`<${tag}>([^<]*)<\/${tag}>`);
        const m = conteudo.match(regex);
        return m ? m[1].trim() : "";
      };

      const rpsData = {
        inscricaoPrestador: extrairValor("InscricaoPrestador", rpsConteudo),
        serieRPS: extrairValor("SerieRPS", rpsConteudo),
        numeroRPS: extrairValor("NumeroRPS", rpsConteudo),
        dataEmissao: extrairValor("DataEmissao", rpsConteudo),
        tributacaoRPS: extrairValor("TributacaoRPS", rpsConteudo),
        statusRPS: extrairValor("StatusRPS", rpsConteudo),
        issRetido: extrairValor("ISSRetido", rpsConteudo),
        valorServicos: extrairValor("ValorServicos", rpsConteudo),
        valorDeducoes: extrairValor("ValorDeducoes", rpsConteudo),
        codigoServico: extrairValor("CodigoServico", rpsConteudo),
        aliquotaServicos: extrairValor("AliquotaServicos", rpsConteudo),
        valorPIS: extrairValor("ValorPIS", rpsConteudo),
        valorCOFINS: extrairValor("ValorCOFINS", rpsConteudo),
        valorINSS: extrairValor("ValorINSS", rpsConteudo),
        valorIR: extrairValor("ValorIR", rpsConteudo),
        valorCSLL: extrairValor("ValorCSLL", rpsConteudo),
        cpfCnpjTomador: "",
      };

      // Busca CPF ou CNPJ
      const cnpjMatch = rpsConteudo.match(/<CNPJ>([^<]*)<\/CNPJ>/);
      const cpfMatch = rpsConteudo.match(/<CPF>([^<]*)<\/CPF>/);
      rpsData.cpfCnpjTomador = cnpjMatch
        ? cnpjMatch[1].trim()
        : cpfMatch
          ? cpfMatch[1].trim()
          : "";

      // Calcula assinatura
      const assinatura = this.calcularAssinaturaRPS(rpsData);

      // Substitui <Assinatura></Assinatura> ou <Assinatura/> pela assinatura calculada
      const rpsAtualizado = rpsCompleto
        .replace(/<Assinatura\s*\/>/, `<Assinatura>${assinatura}</Assinatura>`)
        .replace(
          /<Assinatura><\/Assinatura>/,
          `<Assinatura>${assinatura}</Assinatura>`,
        )
        .replace(
          /<Assinatura>.*?<\/Assinatura>/,
          `<Assinatura>${assinatura}</Assinatura>`,
        );

      // Substitui o RPS antigo pelo atualizado no XML completo
      resultado = resultado.replace(rpsCompleto, rpsAtualizado);

      console.log(
        `✅ RPS ${rpsData.numeroRPS} assinado: ${assinatura.substring(
          0,
          20,
        )}...`,
      );
    }

    return resultado;
  }

  /**
   * Assina XML com certificado digital conforme padrão da Prefeitura de SP
   * A assinatura deve ser inserida após todos os RPS, antes de fechar </PedidoEnvioLoteRPS>
   */
  private signXml(xml: string): string {
    try {
      const certLimpo = this.obterCertificadoLimpo();

      console.log("🔐 Iniciando processo de assinatura XML...");

      // ⚠️ REFORMA TRIBUTÁRIA DESABILITADA - Webservice ainda não atualizado (06/01/2026)
      // A Prefeitura anunciou a Reforma mas o ambiente de produção ainda usa schema v01
      // Erro retornado: "XML não compatível com Schema.The value of the 'Versao' attribute does not equal its fixed value"
      // Erro retornado: "The element 'RPS' has invalid child element 'InfoComplementares'"
      // Descomentar quando o webservice aceitar Versao="2" e <InfoComplementares>

      // 0️⃣ Garantir que o Cabecalho tenha Versao="2" (Reforma Tributária)
      // console.log("📋 Verificando versão do Cabecalho...");
      // if (xml.includes('Versao="1"')) {
      //   console.log(
      //     "⚠️  Atualizando Cabecalho de Versao=1 para Versao=2 (Reforma Tributária)"
      //   );
      //   xml = xml.replace(/(<Cabecalho[^>]*Versao=)"1"/g, '$1"2"');
      // }

      // 1️⃣ Adicionar InfoComplementares (campos da Reforma Tributária) se necessário
      // console.log("🆕 Adicionando campos da Reforma Tributária (IBS/CBS)...");
      // xml = this.adicionarInfoComplementaresSeNecessario(xml);

      // 2️⃣ Preencher assinaturas de cada RPS ANTES de assinar o XML
      console.log("📝 Preenchendo assinaturas SHA-1 de cada RPS...");
      xml = this.preencherAssinaturasRPS(xml);

      // 1. Remove a declaração XML se existir
      let xmlLimpo = xml.replace(/<\?xml.*?\?>/i, "").trim();

      // 2. Minifica completamente - remove TODOS os espaços entre tags
      xmlLimpo = xmlLimpo
        .replace(/>\s+</g, "><") // Remove espaços/quebras entre tags
        .replace(/\r?\n|\r/g, "") // Remove quebras de linha
        .replace(/\s{2,}/g, " ") // Múltiplos espaços viram um
        .trim();

      // 2.5. Remove TODOS os atributos Id do XML (vindos do front-end)
      // O schema da Prefeitura NÃO aceita Id em nenhum elemento
      xmlLimpo = xmlLimpo.replace(/\s+Id="[^"]+"/g, "");
      xmlLimpo = xmlLimpo.replace(/\s+Id='[^']+'/g, "");

      console.log("📋 XML antes da assinatura (primeiros 300 chars):");
      console.log(xmlLimpo.substring(0, 300));

      // 3. Cria a assinatura com configurações para Prefeitura de SP
      // IMPORTANTE: Prefeitura SP usa SHA-1, não SHA-256!
      const sig = new SignedXml({
        privateKey: this.key,
        canonicalizationAlgorithm:
          "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1", // SHA-1!
        // CRÍTICO: Define idAttribute como null para não adicionar Id automaticamente
        idAttribute: null as any,
      });

      // 4. Usa URI VAZIO sem adicionar Id ao elemento
      sig.addReference({
        xpath: "//*[local-name(.)='PedidoEnvioLoteRPS']",
        uri: "", // URI vazio
        digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1", // SHA-1!
        transforms: [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        ],
        // Força não adicionar Id
        isEmptyUri: true as any,
      });

      // 5. Calcula a assinatura - SEM prefix para evitar ds:
      sig.computeSignature(xmlLimpo, {
        location: {
          reference: "//*[local-name(.)='PedidoEnvioLoteRPS']",
          action: "append",
        },
        prefix: "", // Importante: sem prefixo
      });

      // 6. Obtém o XML assinado
      let signedXml = sig.getSignedXml();

      console.log("📋 XML antes da limpeza (primeiros 800 chars):");
      console.log(signedXml.substring(0, 800));

      // 7. CORREÇÕES: Remove ds: e adiciona KeyInfo
      // NÃO remove Id porque não deveria existir nenhum

      // Remove prefixos ds: (namespace)
      signedXml = signedXml.replace(/<ds:([a-zA-Z])/g, "<$1");
      signedXml = signedXml.replace(/<\/ds:([a-zA-Z])/g, "</$1");

      // Adiciona KeyInfo com certificado se não existir
      if (!signedXml.includes("<KeyInfo>")) {
        const keyInfoTag = `<KeyInfo><X509Data><X509Certificate>${certLimpo}</X509Certificate></X509Data></KeyInfo>`;
        signedXml = signedXml.replace(
          "</SignatureValue>",
          `</SignatureValue>${keyInfoTag}`,
        );
      }

      console.log("✅ XML após limpeza (primeiros 800 chars):");
      console.log(signedXml.substring(0, 800));
      console.log("📋 Contém KeyInfo:", signedXml.includes("<KeyInfo>"));
      console.log(
        "📋 PedidoEnvioLoteRPS tem Id:",
        /<PedidoEnvioLoteRPS[^>]*\s+Id=/.test(signedXml),
      );
      console.log("📋 RPS tem Id:", /<RPS[^>]*\s+Id=/.test(signedXml));
      console.log("📋 Contém ds::", signedXml.includes("ds:"));

      // DEBUG: Verificar valores após assinatura
      console.log("\n🔍 VERIFICAÇÃO DOS VALORES NO XML FINAL:");
      const valorTotalMatch = signedXml.match(
        /<ValorTotalServicos>([^<]+)<\/ValorTotalServicos>/,
      );
      const valorServicoMatch = signedXml.match(
        /<ValorServicos>([^<]+)<\/ValorServicos>/,
      );
      console.log(
        "  ValorTotalServicos (Cabecalho):",
        valorTotalMatch ? valorTotalMatch[1] : "NÃO ENCONTRADO",
      );
      console.log(
        "  ValorServicos (RPS):",
        valorServicoMatch ? valorServicoMatch[1] : "NÃO ENCONTRADO",
      );
      console.log("\n📄 XML COMPLETO ASSINADO:");
      console.log(signedXml);
      console.log("\n");

      return signedXml;
    } catch (error: any) {
      console.error("❌ Erro ao assinar XML:", error);
      throw new Error(`Falha na assinatura: ${error.message}`);
    }
  }

  async enviarLoteRps(xml: string): Promise<any> {
    try {
      // 1. Assina o XML (adiciona tag <Signature> no final)
      const xmlSigned = this.signXml(xml);

      console.log("📤 Enviando XML assinado para a Prefeitura...");

      // DEBUG: Verificar tamanho e encoding
      console.log("\n🔍 DADOS DO ENVIO:");
      console.log("  Tamanho XML:", xmlSigned.length, "chars");
      console.log("  Tamanho em bytes:", Buffer.byteLength(xmlSigned, "utf8"));

      // Verificar se valores estão presentes antes do envio
      const preEnvioValorTotal = xmlSigned.match(
        /<ValorTotalServicos>([^<]+)<\/ValorTotalServicos>/,
      );
      const preEnvioValorServico = xmlSigned.match(
        /<ValorServicos>([^<]+)<\/ValorServicos>/,
      );
      console.log(
        "  ValorTotalServicos antes envio:",
        preEnvioValorTotal ? preEnvioValorTotal[1] : "❌ NÃO ENCONTRADO",
      );
      console.log(
        "  ValorServicos antes envio:",
        preEnvioValorServico ? preEnvioValorServico[1] : "❌ NÃO ENCONTRADO",
      );

      // 2. Constrói envelope SOAP manualmente
      const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <EnvioLoteRPSRequest xmlns="http://www.prefeitura.sp.gov.br/nfe">
      <VersaoSchema>1</VersaoSchema>
      <MensagemXML><![CDATA[${xmlSigned}]]></MensagemXML>
    </EnvioLoteRPSRequest>
  </soap:Body>
</soap:Envelope>`;

      console.log("\n📨 ENVELOPE SOAP (primeiros 500 chars):");
      console.log(soapEnvelope.substring(0, 500));

      // 3. Envia via HTTPS direto
      const response = await new Promise<any>((resolve, reject) => {
        const postData = Buffer.from(soapEnvelope, "utf-8");

        const options = {
          hostname: "nfews.prefeitura.sp.gov.br",
          port: 443,
          path: "/lotenfe.asmx",
          method: "POST",
          headers: {
            "Content-Type": "text/xml; charset=utf-8",
            "Content-Length": postData.length,
            SOAPAction: '"http://www.prefeitura.sp.gov.br/nfe/ws/envioLoteRPS"',
          },
          key: this.key,
          cert: this.cert,
          rejectUnauthorized: false,
        };

        const req = https.request(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            console.log("✅ Resposta recebida da Prefeitura");
            console.log("Status Code:", res.statusCode);
            console.log("\n📥 RESPOSTA COMPLETA DA PREFEITURA:");
            console.log(data);

            // Parse do XML de resposta para extrair erros
            const retornoMatch = data.match(
              /<RetornoXML>([\s\S]*?)<\/RetornoXML>/,
            );
            if (retornoMatch) {
              const retornoXml = retornoMatch[1]
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, "&");

              console.log("\n🔍 XML DE RETORNO DECODIFICADO:");
              console.log(retornoXml);

              // Verificar se há erros
              const sucessoMatch = retornoXml.match(
                /<Sucesso>(.*?)<\/Sucesso>/,
              );
              const sucesso = sucessoMatch ? sucessoMatch[1] : null;

              console.log("\n📊 STATUS DO PROCESSAMENTO:");
              console.log("  Sucesso:", sucesso);

              if (sucesso === "false") {
                // Extrair erros
                const errosRegex = /<Erro>([\s\S]*?)<\/Erro>/g;
                const erros = [];
                let match;

                while ((match = errosRegex.exec(retornoXml)) !== null) {
                  const erro = match[1];
                  const codigoMatch = erro.match(/<Codigo>(.*?)<\/Codigo>/);
                  const mensagemMatch = erro.match(
                    /<Mensagem>(.*?)<\/Mensagem>/,
                  );

                  erros.push({
                    codigo: codigoMatch ? codigoMatch[1] : "N/A",
                    mensagem: mensagemMatch ? mensagemMatch[1] : "N/A",
                  });
                }

                if (erros.length > 0) {
                  console.log("\n❌ ERROS RETORNADOS PELA PREFEITURA:");
                  erros.forEach((erro, index) => {
                    console.log(
                      `  ${index + 1}. [${erro.codigo}] ${erro.mensagem}`,
                    );
                  });
                }
              }
            }

            if (res.statusCode === 200) {
              resolve(data);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
            }
          });
        });

        req.on("error", (error) => {
          reject(error);
        });

        req.write(postData);
        req.end();
      });

      return this.parseResponse([response]);
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
        }),
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
        }),
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
