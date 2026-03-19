"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NfseSpService = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
<<<<<<< HEAD
var https_1 = __importDefault(require("https"));
var xml_crypto_1 = require("xml-crypto");
var xml2js_1 = require("xml2js");
var soap = __importStar(require("soap"));
var crypto_1 = __importDefault(require("crypto"));
=======
var xml_crypto_1 = require("xml-crypto");
var xml2js_1 = require("xml2js");
var soap = __importStar(require("soap"));
>>>>>>> 0c7451c346de0a6cd9048772d1ca35b9d93f8f32
var NfseSpService = /** @class */ (function () {
    function NfseSpService() {
        this.config = {
            wsdlUrl: process.env.WSDL_URL || "",
            soapEndpoint: process.env.SOAP_ENDPOINT || "",
            certPath: process.env.CERT_PEM_PATH || "./certificates/cert.pem",
            keyPath: process.env.KEY_PEM_PATH || "./certificates/key.pem",
        };
        // Carregar certificado e chave
        try {
            this.cert = fs_1.default.readFileSync(path_1.default.resolve(this.config.certPath), "utf8");
            this.key = fs_1.default.readFileSync(path_1.default.resolve(this.config.keyPath), "utf8");
        }
        catch (error) {
            console.error("❌ Erro ao carregar certificados:", error);
            throw new Error("Certificados não encontrados. Execute o script convertPfxToPem.ts primeiro.");
        }
    }
    // Adicione esta função auxiliar para garantir que o certificado seja APENAS base64
    NfseSpService.prototype.obterCertificadoLimpo = function () {
        var matches = this.cert.match(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/);
        var base64 = matches ? matches[1] : this.cert;
        return base64.replace(/\s+/g, ""); // Remove espaços, tabs e quebras de linha
    };
    NfseSpService.prototype.cleanCertificate = function (cert) {
        // Remove tudo que não está entre os marcadores BEGIN e END
        var matches = cert.match(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/);
        if (matches && matches[1]) {
            return matches[1].replace(/\s+/g, ""); // Remove quebras de linha e espaços
        }
        // Fallback caso o arquivo já venha limpo, mas removendo lixo de "BagAttributes"
        return cert.replace(/BagAttributes[\s\S]*?MII/g, "MII").replace(/\s+/g, "");
    };
    /**
<<<<<<< HEAD
     * Monta a estrutura InfoComplementares com campos obrigatórios da Reforma Tributária v02
     * Adiciona campos de IBS/CBS conforme exigido desde 01/01/2026
     */
    NfseSpService.prototype.montarInfoComplementares = function (data) {
        var dhEmissao = new Date().toISOString().split(".")[0]; // Formato: YYYY-MM-DDTHH:MM:SS
        var valorServico = parseFloat(data.vServPrest);
        // Valores padrão para São Paulo
        var cClassTrib = data.cClassTrib || "01";
        var CST = data.CST || "00"; // 00 = Tributação normal
        var cNBS = data.cNBS || "1.0101.00.00"; // Código NBS genérico - ajustar conforme serviço
        var cMunIncid = data.cMunIncid || "3550308"; // São Paulo/SP
        var uf = data.uf || "SP";
        var verProc = data.verProc || "1.0.0";
        // Cálculos de IBS e CBS (valores padrão: 2,5% cada)
        var pAliqIBS = data.pAliqIBS || "2.50";
        var pAliqCBS = data.pAliqCBS || "2.50";
        var vBCIBS = data.vBCIBS || data.vServPrest;
        var vBCCBS = data.vBCCBS || data.vServPrest;
        var vIBS = data.vIBS || (valorServico * 0.025).toFixed(2);
        var vCBS = data.vCBS || (valorServico * 0.025).toFixed(2);
        // Cálculo do tributo total (ISS)
        var pAliq = data.pAliq || "5.00";
        var vTributo = data.vTributo || (valorServico * 0.05).toFixed(2);
        var xml = "<InfoComplementares>";
        xml += "<cClassTrib>".concat(cClassTrib, "</cClassTrib>");
        xml += "<cEnqTribCoop></cEnqTribCoop>";
        xml += "<dhEmissao>".concat(dhEmissao, "</dhEmissao>");
        xml += "<tpEmissao>1</tpEmissao>";
        xml += "<verProc>".concat(verProc, "</verProc>");
        xml += "<infServ>";
        xml += "<CST>".concat(CST, "</CST>");
        xml += "<cNBS>".concat(cNBS, "</cNBS>");
        xml += "<vServPrest>".concat(data.vServPrest, "</vServPrest>");
        xml += "<vBC>".concat(data.vBC, "</vBC>");
        xml += "<pAliq>".concat(pAliq, "</pAliq>");
        xml += "<vTributo>".concat(vTributo, "</vTributo>");
        xml += "<vBCIBS>".concat(vBCIBS, "</vBCIBS>");
        xml += "<pAliqIBS>".concat(pAliqIBS, "</pAliqIBS>");
        xml += "<vIBS>".concat(vIBS, "</vIBS>");
        xml += "<vBCCBS>".concat(vBCCBS, "</vBCCBS>");
        xml += "<pAliqCBS>".concat(pAliqCBS, "</pAliqCBS>");
        xml += "<vCBS>".concat(vCBS, "</vCBS>");
        xml += "</infServ>";
        xml += "<infLocalPrest>";
        xml += "<cMunIncid>".concat(cMunIncid, "</cMunIncid>");
        xml += "<UF>".concat(uf, "</UF>");
        xml += "</infLocalPrest>";
        xml += "</InfoComplementares>";
        return xml;
    };
    /**
     * Calcula a assinatura SHA-1 de um RPS específico
     * Formato: IM + SerieRPS + NumRPS(12) + DataEmissao + TribRPS + StatusRPS + ISSRetido +
     *          ValorServicos(15) + ValorDeducoes(15) + CodigoServico(5) + AliqServ(5) + ValorPIS...CSLL + CNPJ/CPF
     */
    NfseSpService.prototype.calcularAssinaturaRPS = function (rpsData) {
        // Constrói a string conforme especificação da Prefeitura
        var im = rpsData.inscricaoPrestador.padStart(8, "0");
        var serie = rpsData.serieRPS.padEnd(5, " ");
        var numero = rpsData.numeroRPS.padStart(12, "0");
        var data = rpsData.dataEmissao.replace(/-/g, ""); // YYYYMMDD
        var trib = rpsData.tributacaoRPS;
        var status = rpsData.statusRPS;
        var iss = rpsData.issRetido === "true" ? "S" : "N";
        // Valores monetários sem ponto decimal, 15 dígitos
        var formatarValor = function (valor, tamanho) {
            if (tamanho === void 0) { tamanho = 15; }
            var num = Math.round(parseFloat(valor) * 100); // Converte para centavos
            return num.toString().padStart(tamanho, "0");
        };
        var valServ = formatarValor(rpsData.valorServicos);
        var valDed = formatarValor(rpsData.valorDeducoes);
        // CodServ: Código real do serviço, 5 dígitos (ex: 06298)
        var codServ = rpsData.codigoServico.padStart(5, "0");
        // Alíquota: 1 dígito apenas, SEM padding! (ex: 2%, 5%, 10%)
        var aliqFloat = parseFloat(rpsData.aliquotaServicos) * 100; // 0.02 → 2.0
        var aliq = Math.round(aliqFloat).toString(); // "2" (SEM padStart!)
        // IMPORTANTE: A Prefeitura NÃO inclui PIS, COFINS, INSS, IR, CSLL na assinatura!
        // Formato: IM(8) + Serie(5) + Num(12) + Data(8) + Trib(1) + Status(1) + ISS(1) +
        //          ValServ(15) + ValDed(15) + CodServ(5 zeros!) + Aliq(1) + CNPJ(14) = 86 chars
        var cpfCnpj = rpsData.cpfCnpjTomador.padStart(14, "0");
        var stringAssinatura = im +
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
        console.log("  IM: [".concat(im, "] (").concat(im.length, ")"));
        console.log("  Serie: [".concat(serie, "] (").concat(serie.length, ")"));
        console.log("  Numero: [".concat(numero, "] (").concat(numero.length, ")"));
        console.log("  Data: [".concat(data, "] (").concat(data.length, ")"));
        console.log("  Trib: [".concat(trib, "] (").concat(trib.length, ")"));
        console.log("  Status: [".concat(status, "] (").concat(status.length, ")"));
        console.log("  ISS: [".concat(iss, "] (").concat(iss.length, ")"));
        console.log("  ValServ: [".concat(valServ, "] (").concat(valServ.length, ")"));
        console.log("  ValDed: [".concat(valDed, "] (").concat(valDed.length, ")"));
        console.log("  CodServ: [".concat(codServ, "] (").concat(codServ.length, ")"));
        console.log("  Aliq: [".concat(aliq, "] (").concat(aliq.length, ")"));
        console.log("  CNPJ: [".concat(cpfCnpj, "] (").concat(cpfCnpj.length, ")"));
        console.log("\uD83D\uDCDD String completa (".concat(stringAssinatura.length, " chars):"), stringAssinatura);
        // Calcula SHA-1
        // Testa com uppercase (padrão) e lowercase
        var hashUppercase = crypto_1.default
            .createHash("sha1")
            .update(stringAssinatura, "ascii")
            .digest("hex")
            .toUpperCase();
        var hashLowercase = crypto_1.default
            .createHash("sha1")
            .update(stringAssinatura, "ascii")
            .digest("hex")
            .toLowerCase();
        console.log("\uD83D\uDD10 Hash SHA-1 UPPERCASE: ".concat(hashUppercase));
        console.log("\uD83D\uDD10 Hash SHA-1 lowercase: ".concat(hashLowercase));
        // Testa também outros encodings
        var hashUTF8 = crypto_1.default
            .createHash("sha1")
            .update(stringAssinatura, "utf8")
            .digest("hex")
            .toUpperCase();
        console.log("\uD83D\uDD10 Hash SHA-1 UTF-8: ".concat(hashUTF8));
        return hashUppercase;
    };
    /**
     * Adiciona InfoComplementares (campos da Reforma Tributária v02) a cada RPS que não tenha
     * Obrigatório desde 01/01/2026 para NFS-e de São Paulo
     */
    NfseSpService.prototype.adicionarInfoComplementaresSeNecessario = function (xml) {
        console.log("🔍 Verificando se precisa adicionar InfoComplementares...");
        // Regex para encontrar cada RPS
        var rpsRegex = /<RPS[^>]*>([\s\S]*?)<\/RPS>/g;
        var match;
        var xmlModificado = xml;
        while ((match = rpsRegex.exec(xml)) !== null) {
            var rpsCompleto = match[0];
            var rpsConteudo = match[1];
            // Verifica se já tem InfoComplementares
            if (rpsConteudo.includes("<InfoComplementares>")) {
                console.log("✅ RPS já possui InfoComplementares, mantendo...");
                continue;
            }
            console.log("⚠️  RPS sem InfoComplementares, adicionando...");
            // Extrai ValorServicos para cálculos
            var valorServicosMatch = rpsConteudo.match(/<ValorServicos>([^<]+)<\/ValorServicos>/);
            var valorServicos = valorServicosMatch ? valorServicosMatch[1] : "0.00";
            // Extrai código do município (se existir)
            var munPrestMatch = rpsConteudo.match(/<MunicipioPrestacao>([^<]+)<\/MunicipioPrestacao>/);
            var cMunIncid = munPrestMatch ? munPrestMatch[1] : "3550308";
            // Monta InfoComplementares
            var infoComplementares = this.montarInfoComplementares({
                vServPrest: valorServicos,
                vBC: valorServicos,
                cMunIncid: cMunIncid,
                uf: "SP",
            });
            // Adiciona InfoComplementares antes de fechar </RPS>
            // Posição ideal: após <Discriminacao> ou último campo antes de </RPS>
            var rpsModificado = rpsCompleto.replace("</RPS>", "".concat(infoComplementares, "</RPS>"));
            xmlModificado = xmlModificado.replace(rpsCompleto, rpsModificado);
        }
        return xmlModificado;
    };
    /**
     * Preenche o campo <Assinatura> de cada RPS no XML usando regex (sem DOMParser)
     */
    NfseSpService.prototype.preencherAssinaturasRPS = function (xml) {
        // Procura por cada bloco <RPS>...</RPS> no XML
        var rpsRegex = /<RPS[^>]*>([\s\S]*?)<\/RPS>/g;
        var match;
        var resultado = xml;
        while ((match = rpsRegex.exec(xml)) !== null) {
            var rpsCompleto = match[0]; // Todo o bloco <RPS>...</RPS>
            var rpsConteudo = match[1]; // Conteúdo interno
            // Extrai valores usando regex
            var extrairValor = function (tag, conteudo) {
                var regex = new RegExp("<".concat(tag, ">([^<]*)</").concat(tag, ">"));
                var m = conteudo.match(regex);
                return m ? m[1].trim() : "";
            };
            var rpsData = {
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
            var cnpjMatch = rpsConteudo.match(/<CNPJ>([^<]*)<\/CNPJ>/);
            var cpfMatch = rpsConteudo.match(/<CPF>([^<]*)<\/CPF>/);
            rpsData.cpfCnpjTomador = cnpjMatch
                ? cnpjMatch[1].trim()
                : cpfMatch
                    ? cpfMatch[1].trim()
                    : "";
            // Calcula assinatura
            var assinatura = this.calcularAssinaturaRPS(rpsData);
            // Substitui <Assinatura></Assinatura> ou <Assinatura/> pela assinatura calculada
            var rpsAtualizado = rpsCompleto
                .replace(/<Assinatura\s*\/>/, "<Assinatura>".concat(assinatura, "</Assinatura>"))
                .replace(/<Assinatura><\/Assinatura>/, "<Assinatura>".concat(assinatura, "</Assinatura>"))
                .replace(/<Assinatura>.*?<\/Assinatura>/, "<Assinatura>".concat(assinatura, "</Assinatura>"));
            // Substitui o RPS antigo pelo atualizado no XML completo
            resultado = resultado.replace(rpsCompleto, rpsAtualizado);
            console.log("\u2705 RPS ".concat(rpsData.numeroRPS, " assinado: ").concat(assinatura.substring(0, 20), "..."));
        }
        return resultado;
    };
    /**
     * Assina XML com certificado digital conforme padrão da Prefeitura de SP
     * A assinatura deve ser inserida após todos os RPS, antes de fechar </PedidoEnvioLoteRPS>
     */
    NfseSpService.prototype.signXml = function (xml) {
        try {
            var certLimpo = this.obterCertificadoLimpo();
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
            var xmlLimpo = xml.replace(/<\?xml.*?\?>/i, "").trim();
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
            var sig = new xml_crypto_1.SignedXml({
                privateKey: this.key,
                canonicalizationAlgorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
                signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
                // CRÍTICO: Define idAttribute como null para não adicionar Id automaticamente
                idAttribute: null,
            });
            // 4. Usa URI VAZIO sem adicionar Id ao elemento
            sig.addReference({
                xpath: "//*[local-name(.)='PedidoEnvioLoteRPS']",
                uri: "",
                digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
                transforms: [
                    "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
                    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
                ],
                // Força não adicionar Id
                isEmptyUri: true,
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
            var signedXml = sig.getSignedXml();
            console.log("📋 XML antes da limpeza (primeiros 800 chars):");
            console.log(signedXml.substring(0, 800));
            // 7. CORREÇÕES: Remove ds: e adiciona KeyInfo
            // NÃO remove Id porque não deveria existir nenhum
            // Remove prefixos ds: (namespace)
            signedXml = signedXml.replace(/<ds:([a-zA-Z])/g, "<$1");
            signedXml = signedXml.replace(/<\/ds:([a-zA-Z])/g, "</$1");
            // Adiciona KeyInfo com certificado se não existir
            if (!signedXml.includes("<KeyInfo>")) {
                var keyInfoTag = "<KeyInfo><X509Data><X509Certificate>".concat(certLimpo, "</X509Certificate></X509Data></KeyInfo>");
                signedXml = signedXml.replace("</SignatureValue>", "</SignatureValue>".concat(keyInfoTag));
            }
            console.log("✅ XML após limpeza (primeiros 800 chars):");
            console.log(signedXml.substring(0, 800));
            console.log("📋 Contém KeyInfo:", signedXml.includes("<KeyInfo>"));
            console.log("📋 PedidoEnvioLoteRPS tem Id:", /<PedidoEnvioLoteRPS[^>]*\s+Id=/.test(signedXml));
            console.log("📋 RPS tem Id:", /<RPS[^>]*\s+Id=/.test(signedXml));
            console.log("📋 Contém ds::", signedXml.includes("ds:"));
            // DEBUG: Verificar valores após assinatura
            console.log("\n🔍 VERIFICAÇÃO DOS VALORES NO XML FINAL:");
            var valorTotalMatch = signedXml.match(/<ValorTotalServicos>([^<]+)<\/ValorTotalServicos>/);
            var valorServicoMatch = signedXml.match(/<ValorServicos>([^<]+)<\/ValorServicos>/);
            console.log("  ValorTotalServicos (Cabecalho):", valorTotalMatch ? valorTotalMatch[1] : "NÃO ENCONTRADO");
            console.log("  ValorServicos (RPS):", valorServicoMatch ? valorServicoMatch[1] : "NÃO ENCONTRADO");
            console.log("\n📄 XML COMPLETO ASSINADO:");
            console.log(signedXml);
            console.log("\n");
            return signedXml;
        }
        catch (error) {
            console.error("❌ Erro ao assinar XML:", error);
            throw new Error("Falha na assinatura: ".concat(error.message));
=======
     * Assina XML com certificado digital conforme padrão da Prefeitura de SP
     * A assinatura deve ser inserida após todos os RPS, antes de fechar </PedidoEnvioLoteRPS>
     */
    // Se estiver usando TypeScript, defina o tipo para o certificado se necessário
    NfseSpService.prototype.signXml = function (xml) {
        try {
            var certLimpo = this.obterCertificadoLimpo();
            // 1. Minificação Radical - Sem isso, SP não aceita.
            var xmlMinificado = xml
                .replace(/>\s+</g, "><")
                .replace(/\r?\n|\r/g, "")
                .trim();
            var sig = new xml_crypto_1.SignedXml({
                privateKey: this.key,
                // SP exige C14N inclusivo (20010315)
                canonicalizationAlgorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
                signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
            });
            // 2. A Referência deve ser exatamente assim:
            sig.addReference({
                xpath: "//*[local-name(.)='PedidoEnvioLoteRPS']",
                uri: "",
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
            var signedXml = sig.getSignedXml();
            // 4. LIMPEZA MANUAL CIRÚRGICA (Não use bibliotecas aqui, use Replace)
            // Removemos qualquer Id que a lib tenha tentado criar (ex: Id="_0")
            signedXml = signedXml.replace(/\sId="[^"]*"/g, "");
            // SP exige que as tags DS não tenham prefixo
            signedXml = signedXml.replace(/<ds:/g, "<").replace(/<\/ds:/g, "</");
            // Garante que a Signature tenha o namespace correto e esteja colada no conteúdo
            signedXml = signedXml.replace(/<Signature[^>]*>/, '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">');
            // 5. Injeta o KeyInfo (Certificado) que você já limpou do erro 1001
            var keyInfoTag = "<KeyInfo><X509Data><X509Certificate>".concat(certLimpo, "</X509Certificate></X509Data></KeyInfo>");
            signedXml = signedXml.replace("</SignatureValue>", "</SignatureValue>".concat(keyInfoTag));
            // Remove declaração XML e garante que não existam novos espaços
            return signedXml.replace(/<\?xml.*?\?>/i, "").replace(/>\s+</g, "><");
        }
        catch (error) {
            throw error;
>>>>>>> 0c7451c346de0a6cd9048772d1ca35b9d93f8f32
        }
    };
    NfseSpService.prototype.enviarLoteRps = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
<<<<<<< HEAD
            var xmlSigned, preEnvioValorTotal, preEnvioValorServico, soapEnvelope_1, response, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        xmlSigned = this.signXml(xml);
                        console.log("📤 Enviando XML assinado para a Prefeitura...");
                        // DEBUG: Verificar tamanho e encoding
                        console.log("\n🔍 DADOS DO ENVIO:");
                        console.log("  Tamanho XML:", xmlSigned.length, "chars");
                        console.log("  Tamanho em bytes:", Buffer.byteLength(xmlSigned, "utf8"));
                        preEnvioValorTotal = xmlSigned.match(/<ValorTotalServicos>([^<]+)<\/ValorTotalServicos>/);
                        preEnvioValorServico = xmlSigned.match(/<ValorServicos>([^<]+)<\/ValorServicos>/);
                        console.log("  ValorTotalServicos antes envio:", preEnvioValorTotal ? preEnvioValorTotal[1] : "❌ NÃO ENCONTRADO");
                        console.log("  ValorServicos antes envio:", preEnvioValorServico ? preEnvioValorServico[1] : "❌ NÃO ENCONTRADO");
                        soapEnvelope_1 = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <soap:Body>\n    <EnvioLoteRPSRequest xmlns=\"http://www.prefeitura.sp.gov.br/nfe\">\n      <VersaoSchema>1</VersaoSchema>\n      <MensagemXML><![CDATA[".concat(xmlSigned, "]]></MensagemXML>\n    </EnvioLoteRPSRequest>\n  </soap:Body>\n</soap:Envelope>");
                        console.log("\n📨 ENVELOPE SOAP (primeiros 500 chars):");
                        console.log(soapEnvelope_1.substring(0, 500));
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var postData = Buffer.from(soapEnvelope_1, "utf-8");
                                var options = {
                                    hostname: "nfews.prefeitura.sp.gov.br",
                                    port: 443,
                                    path: "/lotenfe.asmx",
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "text/xml; charset=utf-8",
                                        "Content-Length": postData.length,
                                        SOAPAction: '"http://www.prefeitura.sp.gov.br/nfe/ws/envioLoteRPS"',
                                    },
                                    key: _this.key,
                                    cert: _this.cert,
                                    rejectUnauthorized: false,
                                };
                                var req = https_1.default.request(options, function (res) {
                                    var data = "";
                                    res.on("data", function (chunk) {
                                        data += chunk;
                                    });
                                    res.on("end", function () {
                                        console.log("✅ Resposta recebida da Prefeitura");
                                        console.log("Status Code:", res.statusCode);
                                        console.log("\n📥 RESPOSTA COMPLETA DA PREFEITURA:");
                                        console.log(data);
                                        // Parse do XML de resposta para extrair erros
                                        var retornoMatch = data.match(/<RetornoXML>([\s\S]*?)<\/RetornoXML>/);
                                        if (retornoMatch) {
                                            var retornoXml = retornoMatch[1]
                                                .replace(/&lt;/g, "<")
                                                .replace(/&gt;/g, ">")
                                                .replace(/&quot;/g, '"')
                                                .replace(/&amp;/g, "&");
                                            console.log("\n🔍 XML DE RETORNO DECODIFICADO:");
                                            console.log(retornoXml);
                                            // Verificar se há erros
                                            var sucessoMatch = retornoXml.match(/<Sucesso>(.*?)<\/Sucesso>/);
                                            var sucesso = sucessoMatch ? sucessoMatch[1] : null;
                                            console.log("\n📊 STATUS DO PROCESSAMENTO:");
                                            console.log("  Sucesso:", sucesso);
                                            if (sucesso === "false") {
                                                // Extrair erros
                                                var errosRegex = /<Erro>([\s\S]*?)<\/Erro>/g;
                                                var erros = [];
                                                var match = void 0;
                                                while ((match = errosRegex.exec(retornoXml)) !== null) {
                                                    var erro = match[1];
                                                    var codigoMatch = erro.match(/<Codigo>(.*?)<\/Codigo>/);
                                                    var mensagemMatch = erro.match(/<Mensagem>(.*?)<\/Mensagem>/);
                                                    erros.push({
                                                        codigo: codigoMatch ? codigoMatch[1] : "N/A",
                                                        mensagem: mensagemMatch ? mensagemMatch[1] : "N/A",
                                                    });
                                                }
                                                if (erros.length > 0) {
                                                    console.log("\n❌ ERROS RETORNADOS PELA PREFEITURA:");
                                                    erros.forEach(function (erro, index) {
                                                        console.log("  ".concat(index + 1, ". [").concat(erro.codigo, "] ").concat(erro.mensagem));
                                                    });
                                                }
                                            }
                                        }
                                        if (res.statusCode === 200) {
                                            resolve(data);
                                        }
                                        else {
                                            reject(new Error("HTTP ".concat(res.statusCode, ": ").concat(res.statusMessage)));
                                        }
                                    });
                                });
                                req.on("error", function (error) {
                                    reject(error);
                                });
                                req.write(postData);
                                req.end();
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.parseResponse([response])];
                    case 2:
                        error_1 = _a.sent();
                        console.error("❌ Erro ao enviar lote RPS:", error_1);
                        throw new Error("Falha no envio: ".concat(error_1.message));
                    case 3: return [2 /*return*/];
=======
            var xmlSigned, wsdlPath, client, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        xmlSigned = this.signXml(xml);
                        wsdlPath = path_1.default.resolve(__dirname, "../../wsdl/lotenfe.wsdl");
                        return [4 /*yield*/, soap.createClientAsync(wsdlPath, {
                                endpoint: this.config.soapEndpoint,
                                disableCache: true,
                                // FORÇA O SOAP A NÃO FORMATAR O XML (CRUCIAL)
                                preserveWhitespace: true,
                            })];
                    case 1:
                        client = _a.sent();
                        client.setSecurity(new soap.ClientSSLSecurity(path_1.default.resolve(this.config.keyPath), path_1.default.resolve(this.config.certPath), { rejectUnauthorized: false }));
                        return [4 /*yield*/, client.EnvioLoteRPSAsync({
                                VersaoSchema: 1,
                                MensagemXML: { _xml: "<![CDATA[".concat(xmlSigned, "]]>") },
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.parseResponse(result)];
                    case 3:
                        error_1 = _a.sent();
                        console.error("❌ Erro ao enviar lote RPS:", error_1);
                        throw new Error("Falha no envio: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
>>>>>>> 0c7451c346de0a6cd9048772d1ca35b9d93f8f32
                }
            });
        });
    };
    /**
     * Consulta lote de RPS pelo número do protocolo
     */
    NfseSpService.prototype.consultarLote = function (numeroProtocolo) {
        return __awaiter(this, void 0, void 0, function () {
            var client, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, soap.createClientAsync(this.config.wsdlUrl, {
                                endpoint: this.config.soapEndpoint,
                            })];
                    case 1:
                        client = _a.sent();
                        client.setSecurity(new soap.ClientSSLSecurity(this.key, this.cert, {
                            rejectUnauthorized: false,
                        }));
                        return [4 /*yield*/, client.ConsultaLoteRPSAsync({
                                NumeroProtocolo: numeroProtocolo,
                                InscricaoPrestador: process.env.PRESTADOR_IM,
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.parseResponse(result)];
                    case 3:
                        error_2 = _a.sent();
                        console.error("❌ Erro ao consultar lote:", error_2);
                        throw new Error("Falha na consulta: ".concat(error_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancela NFS-e
     */
    NfseSpService.prototype.cancelarNfse = function (numeroNfse, motivo) {
        return __awaiter(this, void 0, void 0, function () {
            var client, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, soap.createClientAsync(this.config.wsdlUrl, {
                                endpoint: this.config.soapEndpoint,
                            })];
                    case 1:
                        client = _a.sent();
                        client.setSecurity(new soap.ClientSSLSecurity(this.key, this.cert, {
                            rejectUnauthorized: false,
                        }));
                        return [4 /*yield*/, client.CancelamentoNFSeAsync({
                                InscricaoPrestador: process.env.PRESTADOR_IM,
                                NumeroNFe: numeroNfse,
                                MotivoCancelamento: motivo,
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.parseResponse(result)];
                    case 3:
                        error_3 = _a.sent();
                        console.error("❌ Erro ao cancelar NFS-e:", error_3);
                        throw new Error("Falha no cancelamento: ".concat(error_3.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Parse da resposta SOAP
     */
    NfseSpService.prototype.parseResponse = function (response) {
        return new Promise(function (resolve, reject) {
            var _a;
            var xmlResponse = ((_a = response[0]) === null || _a === void 0 ? void 0 : _a.RetornoXML) || response[0];
            (0, xml2js_1.parseString)(xmlResponse, { explicitArray: false }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    return NfseSpService;
}());
exports.NfseSpService = NfseSpService;
//# sourceMappingURL=NfseSpService.js.map