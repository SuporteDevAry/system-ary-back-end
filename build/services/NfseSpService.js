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
var xml_crypto_1 = require("xml-crypto");
var xml2js_1 = require("xml2js");
var soap = __importStar(require("soap"));
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
        }
    };
    NfseSpService.prototype.enviarLoteRps = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
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