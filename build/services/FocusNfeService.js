"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusNfeService = void 0;
/**
 * Busca o código IBGE do município a partir do CEP usando a API ViaCEP
 */
function buscarIbgePorCep(cep) {
    return __awaiter(this, void 0, void 0, function () {
        var fetch, cepLimpo, resp, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("node-fetch")); })];
                case 1:
                    fetch = (_b.sent()).default;
                    cepLimpo = cep.replace(/\D/g, "");
                    return [4 /*yield*/, fetch("https://viacep.com.br/ws/".concat(cepLimpo, "/json/"))];
                case 2:
                    resp = _b.sent();
                    if (!resp.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, resp.json()];
                case 3:
                    data = _b.sent();
                    if (data && data.ibge)
                        return [2 /*return*/, data.ibge];
                    return [2 /*return*/, null];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Integração com API Focus NFe para envio de NFS-e
 * Documentação: https://doc.focusnfe.com.br/reference/enviarnfse
 *
 * Permite enviar NFS-e para prefeitura via serviço terceirizado
 * Mantém os mesmos métodos que NfseSpService para compatibilidade
 */
var https_1 = __importDefault(require("https"));
var xml2js_1 = require("xml2js");
var FocusNfeService = /** @class */ (function () {
    function FocusNfeService() {
        // Sempre usa endpoint oficial FocusNFE até /v2
        var apiUrl = process.env.FOCUS_NFE_API_URL || "https://api.focusnfe.com.br/v2";
        // Remove qualquer /nfse no final
        apiUrl = apiUrl.replace(/\/nfse$/, "");
        this.config = {
            apiUrl: apiUrl,
            apiToken: process.env.FOCUS_NFE_API_TOKEN || "",
            timeout: 30000,
        };
        if (!this.config.apiToken) {
            throw new Error("FOCUS_NFE_API_TOKEN não configurado. Configure a variável de ambiente.");
        }
        console.log("✅ FocusNfeService inicializado");
        console.log("   API URL: ".concat(this.config.apiUrl));
        // Detectar se está em homologação
        var isHomolog = this.config.apiUrl.includes("homologacao");
        console.log("   Ambiente: ".concat(isHomolog ? "HOMOLOGAÇÃO" : "PRODUÇÃO"));
    }
    /**
     * Consulta status de uma RPS individual (por número de RPS)
     */
    FocusNfeService.prototype.consultarRps = function (rps_number) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\uD83D\uDD0D Consultando NFS-e (ref/protocolo_lote): ".concat(rps_number, " na Focus NFe..."));
                        return [4 /*yield*/, this.fazerRequisicaoApi("GET", "/nfse/".concat(rps_number))];
                    case 1: 
                    // Conforme doc FocusNFE: GET /nfse/{ref}
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        console.error("❌ Erro ao consultar NFS-e na Focus NFe:", error_1);
                        throw new Error("Falha na consulta: ".concat(error_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Envia lote de RPS via API Focus NFe
     * Aceita XML gerado pelo frontend e o processa
     */
    FocusNfeService.prototype.enviarLoteRps = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
            var focusRequest, referencia, _a, _ref, body, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log("📤 Processando XML para envio Focus NFe...");
                        return [4 /*yield*/, this.converterXmlParaFocusNfe(xml)];
                    case 1:
                        focusRequest = _b.sent();
                        console.log("✅ XML convertido para formato Focus NFe");
                        referencia = focusRequest.referencia;
                        _a = focusRequest, _ref = _a.referencia, body = __rest(_a, ["referencia"]);
                        return [4 /*yield*/, this.fazerRequisicaoApi("POST", "/nfse?ref=".concat(referencia), body)];
                    case 2: 
                    // Envia o parâmetro ref na query string
                    return [2 /*return*/, _b.sent()];
                    case 3:
                        error_2 = _b.sent();
                        console.error("❌ Erro ao enviar para Focus NFe:", error_2);
                        throw new Error("Falha no envio: ".concat(error_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Consulta status de NFS-e na Focus NFe
     */
    FocusNfeService.prototype.consultarLote = function (numeroProtocolo) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\uD83D\uDD0D Consultando NFS-e ".concat(numeroProtocolo, " na Focus NFe..."));
                        return [4 /*yield*/, this.fazerRequisicaoApi("GET", "/nfse/".concat(numeroProtocolo, "?completa=0"))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.error("❌ Erro ao consultar Focus NFe:", error_3);
                        throw new Error("Falha na consulta: ".concat(error_3.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancela NFS-e na Focus NFe
     */
    FocusNfeService.prototype.cancelarNfse = function (numeroNfse, motivo) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\u274C Cancelando NFS-e ".concat(numeroNfse, " na Focus NFe..."));
                        payload = {
                            pedido_numero_nfse: numeroNfse,
                            motivo_cancelamento: motivo,
                        };
                        return [4 /*yield*/, this.fazerRequisicaoApi("POST", "/nfse/".concat(numeroNfse, "/cancelamento"), payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.error("❌ Erro ao cancelar NFS-e na Focus NFe:", error_4);
                        throw new Error("Falha no cancelamento: ".concat(error_4.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Faz requisição genérica para a API Focus NFe
     */
    FocusNfeService.prototype.fazerRequisicaoApi = function (method, endpoint, payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = new URL(_this.config.apiUrl + endpoint);
            console.log("\n\uD83D\uDD17 Requisi\u00E7\u00E3o Focus NFe:");
            console.log("   M\u00E9todo: ".concat(method));
            console.log("   URL: ".concat(url.href));
            // Tenta HTTP Basic Auth: base64(token:)
            var auth = Buffer.from("".concat(_this.config.apiToken, ":")).toString("base64");
            console.log("   Auth: Basic ".concat(auth.substring(0, 10), "..."));
            var options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Basic ".concat(auth),
                },
                timeout: _this.config.timeout,
            };
            var req = https_1.default.request(options, function (res) {
                var data = "";
                res.on("data", function (chunk) {
                    data += chunk;
                });
                res.on("end", function () {
                    // DEBUG: Log do payload enviado para diagnóstico
                    if (payload) {
                        console.log("\n🔍 DEBUG - Payload EXATO enviado no corpo da requisição:");
                        console.log(JSON.stringify(payload, null, 2));
                    }
                    console.log("\n\u2705 Resposta Focus NFe (".concat(res.statusCode, "):"));
                    // Se status é 401, mensagem de erro de autenticação
                    if (res.statusCode === 401) {
                        console.error("❌ ERRO DE AUTENTICAÇÃO 401:");
                        console.error("   Token pode estar expirado ou inválido");
                        console.error("   Verifique em: https://app.focusnfe.com.br -> Conta -> Integrações -> API");
                        console.error("   Resposta recebida:", data);
                        reject(new Error("Autenticação falhou (401). Verifique o token FOCUS_NFE_API_TOKEN."));
                        return;
                    }
                    try {
                        var response = JSON.parse(data);
                        console.log(JSON.stringify(response, null, 2));
                        if (res.statusCode &&
                            res.statusCode >= 200 &&
                            res.statusCode < 300) {
                            resolve(response);
                        }
                        else {
                            reject(new Error("API Error ".concat(res.statusCode, ": ").concat(response.error || response.message || "Unknown error")));
                        }
                    }
                    catch (e) {
                        reject(new Error("Erro ao parsear resposta: ".concat(data)));
                    }
                });
            });
            req.on("error", function (error) {
                reject(error);
            });
            req.on("timeout", function () {
                req.destroy();
                reject(new Error("Timeout na requisição Focus NFe"));
            });
            if (payload) {
                req.write(JSON.stringify(payload));
            }
            req.end();
        });
    };
    /**
     * Converte XML do padrão Prefeitura SP para o formato esperado pela Focus NFe
     * XML de entrada: <PedidoEnvioLoteRPS> com um ou mais <RPS>
     * Saída: FocusNfeRequest com formato específico da API
     */
    FocusNfeService.prototype.converterXmlParaFocusNfe = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
            var fetch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("node-fetch")); })];
                    case 1:
                        fetch = (_a.sent()).default;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                (0, xml2js_1.parseString)(xml, { explicitArray: false }, function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                                    var pedido, cabecalho, rpsArray, primeiroRps, chaveRps, inscricaoPrestador, cpfCnpjRemetente, cnpjPrestador, cpfPrestador, rps, cpfCnpjTomador, enderecTomador, cnpjTomador, cpfTomador, razaoSocialTomador, emailTomador, isEstrangeiro, codigoMunicipioServico, codigoMunicipioTomadorOriginal, codigoMunicipioTomadorCorrigido, ibgeViaCep, focusToken, resp, data, err_1, servicoXml, valorServicos, valorServicosKeys, _i, valorServicosKeys_1, key, valorFinalCobrado, baseCalculo, codigoServico, discriminacao, aliquotaPercentual, aliquotaFracao, valorIss, valorIBS, valorCBS, aliquotaParaEnvio, prestadorObj, codigoTribMun, focusRequest, error_5;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (err) {
                                                    reject(new Error("Erro ao parsear XML: ".concat(err.message)));
                                                    return [2 /*return*/];
                                                }
                                                console.log("XML recebido:", xml);
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 10, , 11]);
                                                pedido = result.PedidoEnvioLoteRPS;
                                                cabecalho = pedido.Cabecalho || {};
                                                rpsArray = Array.isArray(pedido.RPS)
                                                    ? pedido.RPS
                                                    : [pedido.RPS];
                                                primeiroRps = rpsArray[0];
                                                // DEBUG: Log completo da estrutura do primeiro RPS
                                                console.log("🔍 DEBUG - Estrutura completa do RPS recebida:");
                                                console.log(JSON.stringify(primeiroRps, null, 2));
                                                chaveRps = primeiroRps.ChaveRPS || {};
                                                inscricaoPrestador = chaveRps.InscricaoPrestador ||
                                                    primeiroRps.InscricaoPrestador ||
                                                    "";
                                                cpfCnpjRemetente = cabecalho.CPFCNPJRemetente || {};
                                                cnpjPrestador = cpfCnpjRemetente.CNPJ ||
                                                    primeiroRps.CNPJRemetente ||
                                                    primeiroRps.CNPJ ||
                                                    process.env.CNPJ_PRESTADOR ||
                                                    "";
                                                cpfPrestador = cpfCnpjRemetente.CPF ||
                                                    primeiroRps.CPFRemetente ||
                                                    primeiroRps.CPF ||
                                                    process.env.CPF_PRESTADOR ||
                                                    "";
                                                // Log para debug
                                                console.log("   \uD83D\uDCCB Extra\u00E7\u00E3o Prestador:");
                                                console.log("      IM: ".concat(inscricaoPrestador || "✗ não encontrado"));
                                                console.log("      CNPJ: ".concat(cnpjPrestador ? "✓ fornecido" : "✗ não fornecido"));
                                                console.log("      CPF: ".concat(cpfPrestador ? "✓ fornecido" : "✗ não fornecido"));
                                                rps = primeiroRps;
                                                cpfCnpjTomador = rps.CPFCNPJTomador || {};
                                                enderecTomador = rps.EnderecoTomador || {};
                                                cnpjTomador = cpfCnpjTomador.CNPJ || "";
                                                cpfTomador = cpfCnpjTomador.CPF || "";
                                                razaoSocialTomador = rps.RazaoSocialTomador || rps.NomeFantasia || "Cliente";
                                                emailTomador = rps.EmailTomador || "";
                                                isEstrangeiro = !cnpjTomador &&
                                                    !cpfTomador &&
                                                    (enderecTomador.UF === "EX" ||
                                                        enderecTomador.Pais ||
                                                        enderecTomador.CodigoPais);
                                                codigoMunicipioServico = rps.MunicipioPrestacao || "3550308";
                                                codigoMunicipioTomadorOriginal = enderecTomador.Cidade || codigoMunicipioServico;
                                                codigoMunicipioTomadorCorrigido = this.validarECorrigirCodigoMunicipio(codigoMunicipioTomadorOriginal, enderecTomador.UF || "SP", enderecTomador.CEP || "");
                                                if (!isEstrangeiro) return [3 /*break*/, 2];
                                                // Para estrangeiro: remove CPF/CNPJ, define UF=EX, CEP=00000-000, codigo_municipio=9999999
                                                cnpjTomador = "";
                                                cpfTomador = "";
                                                codigoMunicipioTomadorCorrigido = "9999999";
                                                enderecTomador.UF = "EX";
                                                enderecTomador.CEP = "00000-000";
                                                if (!enderecTomador.Bairro)
                                                    enderecTomador.Bairro = "EXTERIOR";
                                                if (!enderecTomador.NumeroEndereco)
                                                    enderecTomador.NumeroEndereco = "S/N";
                                                // Permite informar país
                                                if (!enderecTomador.CodigoPais && enderecTomador.Pais) {
                                                    // Exemplo: Brasil=1058, EUA=249, Argentina=32 (BACEN)
                                                    enderecTomador.CodigoPais = enderecTomador.Pais;
                                                }
                                                return [3 /*break*/, 4];
                                            case 2:
                                                if (!enderecTomador.CEP) return [3 /*break*/, 4];
                                                return [4 /*yield*/, buscarIbgePorCep(enderecTomador.CEP)];
                                            case 3:
                                                ibgeViaCep = _a.sent();
                                                if (ibgeViaCep &&
                                                    ibgeViaCep !== String(codigoMunicipioTomadorCorrigido)) {
                                                    console.warn("[AUTOM\u00C1TICO] Corrigindo codigo_municipio do tomador de ".concat(codigoMunicipioTomadorCorrigido, " para ").concat(ibgeViaCep, " com base no CEP ").concat(enderecTomador.CEP));
                                                    codigoMunicipioTomadorCorrigido = ibgeViaCep;
                                                }
                                                _a.label = 4;
                                            case 4:
                                                if (!(cnpjTomador && cnpjTomador.length === 14)) return [3 /*break*/, 9];
                                                _a.label = 5;
                                            case 5:
                                                _a.trys.push([5, 8, , 9]);
                                                focusToken = process.env.FOCUS_NFE_TOKEN;
                                                if (!focusToken) {
                                                    reject(new Error("Token da Focus NFe não configurado no backend (.env FOCUS_NFE_TOKEN)"));
                                                    return [2 /*return*/];
                                                }
                                                return [4 /*yield*/, fetch("https://api.focusnfe.com.br/v2/cnpjs/".concat(cnpjTomador), {
                                                        method: "GET",
                                                        headers: {
                                                            accept: "application/json",
                                                            Authorization: "Basic " +
                                                                Buffer.from(focusToken + ":").toString("base64"),
                                                        },
                                                    })];
                                            case 6:
                                                resp = _a.sent();
                                                if (!resp.ok) {
                                                    reject(new Error("Erro ao consultar CNPJ do tomador na Focus NFe: status ".concat(resp.status)));
                                                    return [2 /*return*/];
                                                }
                                                return [4 /*yield*/, resp.json()];
                                            case 7:
                                                data = _a.sent();
                                                if (!data.endereco || !data.endereco.codigo_ibge) {
                                                    console.warn("[AVISO] Resposta da Focus NFe não contém o campo endereco.codigo_ibge para o tomador. Prosseguindo mesmo assim.");
                                                }
                                                else if (String(data.endereco.codigo_ibge) !==
                                                    String(codigoMunicipioTomadorCorrigido)) {
                                                    console.warn("[AVISO] O CNPJ do tomador (".concat(cnpjTomador, ") est\u00E1 cadastrado na Focus NFe para o munic\u00EDpio IBGE ").concat(data.endereco.codigo_ibge, ", mas o munic\u00EDpio informado foi ").concat(codigoMunicipioTomadorCorrigido, ". Corrija os dados do tomador para prosseguir."));
                                                }
                                                return [3 /*break*/, 9];
                                            case 8:
                                                err_1 = _a.sent();
                                                reject(new Error("Erro ao consultar Focus NFe para o CNPJ do tomador: ".concat(err_1)));
                                                return [2 /*return*/];
                                            case 9:
                                                servicoXml = rps.Servico || {};
                                                // Log detalhado do objeto rps
                                                console.log("🔍 DEBUG - Objeto RPS para extração:", JSON.stringify(rps, null, 2));
                                                valorServicos = 0;
                                                valorServicosKeys = [
                                                    "ValorServicos",
                                                    "valorservicos",
                                                    "valor_servicos",
                                                    "valorServicos",
                                                ];
                                                for (_i = 0, valorServicosKeys_1 = valorServicosKeys; _i < valorServicosKeys_1.length; _i++) {
                                                    key = valorServicosKeys_1[_i];
                                                    if (rps[key] !== undefined) {
                                                        valorServicos = parseFloat(rps[key]);
                                                        break;
                                                    }
                                                }
                                                if (!valorServicos && servicoXml.ValorServicos) {
                                                    valorServicos = parseFloat(servicoXml.ValorServicos);
                                                }
                                                if (!valorServicos && cabecalho.ValorTotalServicos) {
                                                    valorServicos = parseFloat(cabecalho.ValorTotalServicos);
                                                }
                                                valorFinalCobrado = valorServicos;
                                                if (rps.ValorFinalCobrado) {
                                                    valorFinalCobrado = parseFloat(rps.ValorFinalCobrado);
                                                }
                                                else if (rps.valorfinalcobrado) {
                                                    valorFinalCobrado = parseFloat(rps.valorfinalcobrado);
                                                }
                                                baseCalculo = valorServicos;
                                                if (rps.BaseCalculo) {
                                                    baseCalculo = parseFloat(rps.BaseCalculo);
                                                }
                                                else if (rps.basecalculo) {
                                                    baseCalculo = parseFloat(rps.basecalculo);
                                                }
                                                codigoServico = rps.CodigoServico || servicoXml.CodigoServico || "06298";
                                                discriminacao = rps.Discriminacao ||
                                                    servicoXml.Discriminacao ||
                                                    "Serviço não especificado";
                                                aliquotaPercentual = parseFloat(rps.aliquota || rps.AliquotaServicos || "5");
                                                aliquotaFracao = Math.round(aliquotaPercentual / 100);
                                                valorIss = valorServicos * aliquotaFracao;
                                                valorIBS = Math.round(valorServicos * 0.01);
                                                valorCBS = Math.round(valorServicos * 0.09);
                                                aliquotaParaEnvio = aliquotaPercentual > 0 ? aliquotaPercentual : 5;
                                                prestadorObj = {
                                                    inscricao_municipal: inscricaoPrestador,
                                                    codigo_municipio: String("3550308"),
                                                };
                                                // Apenas inclui cnpj/cpf se tiverem valores
                                                if (cnpjPrestador.trim()) {
                                                    prestadorObj.cnpj = cnpjPrestador;
                                                }
                                                if (cpfPrestador.trim()) {
                                                    prestadorObj.cpf = cpfPrestador;
                                                }
                                                // Validação: precisa de pelo menos um (cnpj ou cpf)
                                                if (!prestadorObj.cnpj && !prestadorObj.cpf) {
                                                    throw new Error("Prestador sem CNPJ nem CPF. Configure CNPJ_PRESTADOR ou CPF_PRESTADOR em .env");
                                                }
                                                codigoTribMun = this.deriveCodigoTributarioMunicipio();
                                                focusRequest = {
                                                    referencia: "LOTE-".concat(Date.now()),
                                                    data_emissao: this.formatarData(rps.DataEmissao),
                                                    natureza_operacao: 1,
                                                    optante_simples_nacional: false,
                                                    tipo_operacao_governamental: 1,
                                                    prestador: __assign(__assign(__assign({}, (cnpjPrestador && { cnpj: cnpjPrestador })), (cpfPrestador && { cpf: cpfPrestador })), { inscricao_municipal: inscricaoPrestador, codigo_municipio: String("3550308") }),
                                                    tomador: __assign(__assign(__assign(__assign(__assign({}, (cnpjTomador && { cnpj: cnpjTomador })), (cpfTomador && { cpf: cpfTomador })), { razao_social: razaoSocialTomador }), (emailTomador && { email: emailTomador })), { endereco: __assign(__assign(__assign({ logradouro: (enderecTomador.Logradouro || "")
                                                                .trim()
                                                                .substring(0, 50), numero: enderecTomador.NumeroEndereco || "S/N" }, (enderecTomador.ComplementoEndereco && {
                                                            complemento: enderecTomador.ComplementoEndereco,
                                                        })), { bairro: enderecTomador.Bairro || "", codigo_municipio: String(codigoMunicipioTomadorCorrigido), uf: enderecTomador.UF || "SP", cep: this.formatarCEP(enderecTomador.CEP) }), (isEstrangeiro &&
                                                            enderecTomador.CodigoPais && {
                                                            codigo_pais: enderecTomador.CodigoPais,
                                                        })) }),
                                                    servico: {
                                                        discriminacao: discriminacao,
                                                        item_lista_servico: codigoServico,
                                                        codigo_tributacao_municipio: codigoServico,
                                                        tipo_operacao: 1,
                                                        valor_servicos: valorServicos,
                                                        valor_final_cobrado: valorFinalCobrado,
                                                        base_calculo: baseCalculo,
                                                        aliquota: aliquotaParaEnvio,
                                                        iss_retido: false,
                                                        valor_ipi: 0,
                                                        codigo_nbs: "102010000",
                                                        codigo_indicador_operacao: "100301",
                                                        ibs_cbs_classificacao_tributaria: "000001",
                                                    },
                                                    exigibilidade_suspensa: 0,
                                                    pagamento_parcelado_antecipado: 0,
                                                    finalidade_emissao: 0,
                                                    consumidor_final: 0,
                                                    indicador_destinatario: 0,
                                                };
                                                console.log("✅ Conversão XML → Focus NFe concluída");
                                                // DEBUG: Log COMPLETO da requisição que será enviada
                                                console.log("\n🔍 DEBUG - PAYLOAD COMPLETO que será enviado para API:");
                                                console.log(JSON.stringify(focusRequest, null, 2));
                                                resolve(focusRequest);
                                                return [3 /*break*/, 11];
                                            case 10:
                                                error_5 = _a.sent();
                                                reject(new Error("Erro ao converter RPS: ".concat(error_5.message)));
                                                return [3 /*break*/, 11];
                                            case 11: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            })];
                }
            });
        });
    };
    /**
     * Formata data de DD/MM/YYYY (padrão brasileiro) para YYYY-MM-DD (ISO)
     * Corrige automaticamente datas invertidas (dia/mês trocados)
     */
    FocusNfeService.prototype.formatarData = function (data) {
        if (!data)
            return new Date().toISOString().split("T")[0];
        // Se já está no formato YYYY-MM-DD, valida se não está com dia/mês invertidos
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            var _a = data.split("-"), ano = _a[0], mes = _a[1], dia = _a[2];
            var dataObj = new Date("".concat(ano, "-").concat(mes, "-").concat(dia, "T12:00:00"));
            var hoje = new Date();
            // Se a data é futura (mais de 30 dias à frente), pode estar invertida
            var diffDias = Math.floor((dataObj.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDias > 30 && parseInt(mes) > 12) {
                // Mês impossível, está claramente invertido
                console.warn("\u26A0\uFE0F  Data com m\u00EAs inv\u00E1lido detectada: ".concat(data, ", invertendo para ").concat(ano, "-").concat(dia, "-").concat(mes));
                return "".concat(ano, "-").concat(dia.padStart(2, "0"), "-").concat(mes.padStart(2, "0"));
            }
            if (diffDias > 30 &&
                parseInt(dia) <= 12 &&
                parseInt(mes) > parseInt(dia)) {
                // Data no futuro distante + dia <= 12 + mês > dia = provável inversão
                console.warn("\u26A0\uFE0F  Data futura detectada: ".concat(data, ", invertendo dia/m\u00EAs para ").concat(ano, "-").concat(dia, "-").concat(mes));
                return "".concat(ano, "-").concat(dia.padStart(2, "0"), "-").concat(mes.padStart(2, "0"));
            }
            return data;
        }
        // Se está em formato DD/MM/YYYY (padrão brasileiro), converte para YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            var _b = data.split("/"), dia = _b[0], mes = _b[1], ano = _b[2];
            return "".concat(ano, "-").concat(mes.padStart(2, "0"), "-").concat(dia.padStart(2, "0"));
        }
        return new Date().toISOString().split("T")[0];
    };
    /**
     * Mapeia TributacaoRPS para formato Focus NFe
     */
    FocusNfeService.prototype.mapearTributacao = function (tributacao) {
        var mapa = {
            T: "T",
            F: "F",
            C: "C",
            N: "N", // Nenhum
        };
        return mapa[tributacao] || "T";
    };
    /**
     * Extrai competência (ano-mês) da data
     */
    FocusNfeService.prototype.extrairCompetencia = function (data) {
        var dataFormatada = this.formatarData(data);
        return dataFormatada.substring(0, 7); // YYYY-MM
    };
    /**
     * Formata código de serviço com zeros à esquerda
     */
    FocusNfeService.prototype.formularCodigo = function (codigo) {
        if (!codigo)
            return "06298"; // Padrão: Serviços de processamento de dados
        return codigo.padStart(5, "0");
    };
    /**
     * Extrai CNPJ do RPS
     */
    FocusNfeService.prototype.extrairCNPJ = function (rps) {
        return rps.CNPJTomador || rps.CNPJ || "";
    };
    /**
     * Extrai CPF do RPS
     */
    FocusNfeService.prototype.extrairCPF = function (rps) {
        return rps.CPFTomador || rps.CPF || "";
    };
    /**
     * Retorna nome do município baseado no código
     */
    FocusNfeService.prototype.extrairMunicipioNome = function (cidade) {
        // Simplificado: retorna o valor recebido ou padrão
        return cidade || "São Paulo";
    };
    /**
     * Converte código IBGE de município para nome
     * Mapeamento dos códigos mais comuns
     */
    FocusNfeService.prototype.obterNomeMunicipio = function (codigoIbge) {
        var municipios = {
            "3550308": "São Paulo",
            "4314902": "Porto Alegre",
            "3550001": "Adamantina",
            "3550002": "Adolfo",
            "3550003": "Aguaí",
            "3550004": "Águas de Lindóia",
            "3550005": "Águas de Santa Bárbara",
            "3550006": "Águas de São Pedro",
            "3550007": "Agudos",
        };
        // Se o código está no mapa, retorna o nome
        if (municipios[codigoIbge]) {
            return municipios[codigoIbge];
        }
        // Fallback: retorna São Paulo como padrão
        return "São Paulo";
    };
    /**
     * Valida e corrige inconsistências entre IBGE, UF e CEP
     * Retorna o IBGE correto baseado no UF informado
     */
    FocusNfeService.prototype.validarECorrigirCodigoMunicipio = function (codigoIbgeOriginal, uf, cep) {
        // Mapa: UF → Prefixo IBGE esperado (primeiros 2 dígitos)
        var ufParaPrefixoIBGE = {
            SP: "35",
            RS: "43",
            RJ: "33",
            MG: "31",
            BA: "29",
            PR: "41",
            SC: "42",
            ES: "32",
            GO: "52",
            DF: "53",
            MT: "51",
            MS: "50",
            AC: "12",
            AM: "13",
            AP: "16",
            PA: "15",
            RO: "23",
            RR: "24",
            TO: "27",
            MA: "11",
            PI: "22",
            CE: "23",
            RN: "24",
            PB: "25",
            PE: "26",
            AL: "27",
            SE: "28",
        };
        // Mapeamento específico de CEP para IBGE (para casos comuns)
        var cepParaIBGE = {
            "90460": "4314902",
            "01310": "3550308",
            "02550": "3550308",
            "13560": "3548906",
            "20040020": "3304557", // Rio de Janeiro/RJ
        };
        // Extrai prefixo do CEP
        var prefixoCep = cep.substring(0, 5);
        if (cepParaIBGE[prefixoCep]) {
            console.log("\u2705 CEP ".concat(cep, " mapeado para IBGE ").concat(cepParaIBGE[prefixoCep]));
            return cepParaIBGE[prefixoCep];
        }
        // Valida se o IBGE original bate com o UF
        var prefixoIBGEEsperado = ufParaPrefixoIBGE[uf] || "35"; // Padrão SP
        var prefixoIBGEOriginal = codigoIbgeOriginal.substring(0, 2);
        if (prefixoIBGEOriginal !== prefixoIBGEEsperado) {
            console.warn("\u26A0\uFE0F  AVISO: C\u00F3digo IBGE ".concat(codigoIbgeOriginal, " n\u00E3o bate com UF ").concat(uf));
            console.warn("   IBGE esperado come\u00E7a com: ".concat(prefixoIBGEEsperado, ", mas recebido: ").concat(prefixoIBGEOriginal));
            console.warn("   Usando UF ".concat(uf, " com IBGE padr\u00E3o"));
            // Retorna um IBGE válido baseado no UF
            // Para simplicidade, usa o primeiro código válido do estado
            var codigoPadraoUF = {
                SP: "3550308",
                RS: "4314902",
                RJ: "3304557", // Rio de Janeiro
            };
            return codigoPadraoUF[uf] || "3550308";
        }
        return codigoIbgeOriginal;
    };
    /**
     * Formata CEP para XXXXX-XXX
     */
    FocusNfeService.prototype.formatarCEP = function (cep) {
        if (!cep)
            return "";
        // Remove caracteres especiais
        var cepLimpo = cep.replace(/\D/g, "");
        // Se tem 8 dígitos, formata como XXXXX-XXX
        if (cepLimpo.length === 8) {
            return "".concat(cepLimpo.substring(0, 5), "-").concat(cepLimpo.substring(5));
        }
        return cepLimpo;
    };
    /**
     * Deriva Item Lista Serviço (LC 116/2003) em 6 dígitos: II SS DD
     * Heurística:
     * - Se RPS.CodigoServico é "06298" (comum para intermediação), usa "010700"
     * - Se discriminacao contém "Intermediação", usa "010700"
     * - Fallback: "010700"
     */
    FocusNfeService.prototype.deriveItemListaServico = function (rps) {
        var codigoServico = (rps.CodigoServico || "").toString();
        var discr = (rps.Discriminacao || "").toLowerCase();
        if (codigoServico === "06298")
            return "06298";
        if (discr.includes("intermedia"))
            return "06298";
        // Ajuste futuro: permitir override via env FOCUS_ITEM_LISTA_SERVICO
        var envOverride = process.env.FOCUS_ITEM_LISTA_SERVICO;
        if (envOverride && /^[0-9]{6}$/.test(envOverride))
            return envOverride;
        return "06298";
    };
    /**
     * Deriva cTribMun (código tributário municipal) com 3 dígitos [0-9]{3}.
     * A Focus/NFSe Nacional exige padrão de 3 dígitos. Caso não seja conhecido,
     * omite o campo para evitar erros de schema.
     * Pode ser configurado via env FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO.
     */
    FocusNfeService.prototype.deriveCodigoTributarioMunicipio = function () {
        var env = process.env.FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO;
        if (env && /^[0-9]{3}$/.test(env)) {
            return env;
        }
        return null;
    };
    return FocusNfeService;
}());
exports.FocusNfeService = FocusNfeService;
//# sourceMappingURL=FocusNfeService.js.map