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
        var apiUrl = process.env.FOCUS_NFE_API_URL;
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
            var itens, resultados, _i, itens_1, item, referencia, request, numero_rps, _a, _ref, body, response, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        console.log("📤 Processando XML para envio Focus NFe...");
                        return [4 /*yield*/, this.converterXmlParaFocusNfe(xml)];
                    case 1:
                        itens = _b.sent();
                        console.log("\u2705 XML convertido para formato Focus NFe (".concat(itens.length, " RPS)"));
                        resultados = [];
                        _i = 0, itens_1 = itens;
                        _b.label = 2;
                    case 2:
                        if (!(_i < itens_1.length)) return [3 /*break*/, 5];
                        item = itens_1[_i];
                        referencia = item.referencia, request = item.request, numero_rps = item.numero_rps;
                        _a = request, _ref = _a.referencia, body = __rest(_a, ["referencia"]);
                        return [4 /*yield*/, this.fazerRequisicaoApi("POST", "/nfse?ref=".concat(referencia), body)];
                    case 3:
                        response = _b.sent();
                        resultados.push(__assign(__assign({}, response), { ref: (response === null || response === void 0 ? void 0 : response.ref) || referencia, numero_rps: numero_rps }));
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, resultados];
                    case 6:
                        error_2 = _b.sent();
                        console.error("❌ Erro ao enviar para Focus NFe:", error_2);
                        throw new Error("Falha no envio: ".concat(error_2.message));
                    case 7: return [2 /*return*/];
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
    FocusNfeService.prototype.cancelarNfse = function (referencia, justificativa) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\u274C Cancelando NFS-e ".concat(referencia, " na Focus NFe..."));
                        return [4 /*yield*/, this.fazerRequisicaoApi("DELETE", "/nfse/".concat(encodeURIComponent(referencia)), {
                                justificativa: justificativa,
                            })];
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
                                    var pedido, cabecalho, rpsArray, requests, cpfCnpjRemetente, index, rps, numeroRps, chaveRps, inscricaoPrestador, cnpjPrestador, cpfPrestador, cpfCnpjTomador, enderecTomador, cnpjTomador, cpfTomador, razaoSocialTomador, emailTomador, isEstrangeiro, codigoMunicipioServico, codigoMunicipioTomadorOriginal, codigoMunicipioTomadorCorrigido, ibgeViaCep, servicoXml, valorServicos, valorServicosKeys, _i, valorServicosKeys_1, key, valorFinalCobrado, baseCalculo, codigoServico, discriminacao, tributacaoRps, tipoTributacao, codigoCidadeIncidencia, isExportacao, aliquotaPercentual, valorIss, valorIBS, valorCBS, valorIssXml, tributacaoIssXml, ibsCbsSituacaoTributariaXml, ibsCbsBaseCalculoXml, ibsUfAliquotaXml, ibsUfValorXml, ibsMunAliquotaXml, ibsMunValorXml, cbsAliquotaXml, cbsValorXml, ibsValorXml, ibsValueFallback, pisValue, cofinsValue, csllValue, irrfValue, insEst, ownerRecord, ownerSend, liquidada, receiptDate, reciboDate, ibsCbsClassificacaoTributaria, aliquotaParaEnvio, prestadorObj, codigoTribMun, naturezaOperacao, tipoOperacao, issRetido, referencia, focusRequest, error_5;
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
                                                _a.trys.push([1, 8, , 9]);
                                                pedido = result.PedidoEnvioLoteRPS;
                                                cabecalho = pedido.Cabecalho || {};
                                                rpsArray = Array.isArray(pedido.RPS)
                                                    ? pedido.RPS
                                                    : [pedido.RPS];
                                                requests = [];
                                                cpfCnpjRemetente = cabecalho.CPFCNPJRemetente || {};
                                                index = 0;
                                                _a.label = 2;
                                            case 2:
                                                if (!(index < rpsArray.length)) return [3 /*break*/, 7];
                                                rps = rpsArray[index];
                                                if (!rps)
                                                    return [3 /*break*/, 6];
                                                console.log("🔍 DEBUG - Estrutura completa do RPS recebida:");
                                                console.log(JSON.stringify(rps, null, 2));
                                                numeroRps = this.extrairNumeroRps(rps, index + 1);
                                                chaveRps = rps.ChaveRPS || {};
                                                inscricaoPrestador = chaveRps.InscricaoPrestador || rps.InscricaoPrestador || "";
                                                cnpjPrestador = cpfCnpjRemetente.CNPJ ||
                                                    rps.CNPJRemetente ||
                                                    rps.CNPJ ||
                                                    process.env.CNPJ_PRESTADOR ||
                                                    "";
                                                cpfPrestador = cpfCnpjRemetente.CPF ||
                                                    rps.CPFRemetente ||
                                                    rps.CPF ||
                                                    process.env.CPF_PRESTADOR ||
                                                    "";
                                                console.log("   \uD83D\uDCCB Extra\u00E7\u00E3o Prestador:");
                                                console.log("      IM: ".concat(inscricaoPrestador || "✗ não encontrado"));
                                                console.log("      CNPJ: ".concat(cnpjPrestador ? "✓ fornecido" : "✗ não fornecido"));
                                                console.log("      CPF: ".concat(cpfPrestador ? "✓ fornecido" : "✗ não fornecido"));
                                                cpfCnpjTomador = rps.CPFCNPJTomador || {};
                                                enderecTomador = __assign({}, (rps.EnderecoTomador || {}));
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
                                                codigoMunicipioTomadorCorrigido = this.validarECorrigirCodigoMunicipio(codigoMunicipioTomadorOriginal, enderecTomador.UF, enderecTomador.CEP);
                                                if (!isEstrangeiro) return [3 /*break*/, 3];
                                                cnpjTomador = "";
                                                cpfTomador = "";
                                                codigoMunicipioTomadorCorrigido = "9999999";
                                                enderecTomador.UF = "EX";
                                                enderecTomador.CEP = "00000-000";
                                                if (!enderecTomador.Bairro)
                                                    enderecTomador.Bairro = "EXTERIOR";
                                                if (!enderecTomador.NumeroEndereco)
                                                    enderecTomador.NumeroEndereco = "S/N";
                                                if (!enderecTomador.CodigoPais && enderecTomador.Pais) {
                                                    enderecTomador.CodigoPais = enderecTomador.Pais;
                                                }
                                                return [3 /*break*/, 5];
                                            case 3:
                                                if (!enderecTomador.CEP) return [3 /*break*/, 5];
                                                return [4 /*yield*/, buscarIbgePorCep(enderecTomador.CEP)];
                                            case 4:
                                                ibgeViaCep = _a.sent();
                                                if (ibgeViaCep &&
                                                    ibgeViaCep !== String(codigoMunicipioTomadorCorrigido)) {
                                                    console.warn("[AUTOM\u00C1TICO] Corrigindo codigo_municipio do tomador de ".concat(codigoMunicipioTomadorCorrigido, " para ").concat(ibgeViaCep, " com base no CEP ").concat(enderecTomador.CEP));
                                                    codigoMunicipioTomadorCorrigido = ibgeViaCep;
                                                }
                                                _a.label = 5;
                                            case 5:
                                                servicoXml = rps.Servico || {};
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
                                                tributacaoRps = rps.TributacaoRPS ||
                                                    rps.tributacaoRps ||
                                                    "";
                                                tipoTributacao = tributacaoRps
                                                    ? this.mapearTributacao(String(tributacaoRps).trim().toUpperCase())
                                                    : undefined;
                                                codigoCidadeIncidencia = tipoTributacao === "P" ? "9999999" : undefined;
                                                isExportacao = this.identificarExportacao(rps, servicoXml, isEstrangeiro, tipoTributacao);
                                                aliquotaPercentual = parseFloat(rps.aliquota || rps.AliquotaServicos || "5");
                                                valorIss = Math.round(valorServicos * (aliquotaPercentual / 100) * 100) / 100;
                                                valorIBS = Math.round(valorServicos * 0.01 * 100) / 100;
                                                valorCBS = Math.round(valorServicos * 0.09 * 100) / 100;
                                                valorIssXml = this.extrairNumeroOpcional(rps.ValorIss, rps.ValorISS, rps.valor_iss, servicoXml.ValorIss, servicoXml.ValorISS, servicoXml.valor_iss);
                                                tributacaoIssXml = this.extrairTextoOpcional(rps.TributacaoIss, rps.TributacaoISS, rps.tributacao_iss, servicoXml.TributacaoIss, servicoXml.TributacaoISS, servicoXml.tributacao_iss);
                                                ibsCbsSituacaoTributariaXml = this.extrairTextoOpcional(rps.IBSCBSSituacaoTributaria, rps.ibs_cbs_situacao_tributaria, servicoXml.IBSCBSSituacaoTributaria, servicoXml.ibs_cbs_situacao_tributaria);
                                                ibsCbsBaseCalculoXml = this.extrairNumeroOpcional(rps.IBSCBSBaseCalculo, rps.ibs_cbs_base_calculo, servicoXml.IBSCBSBaseCalculo, servicoXml.ibs_cbs_base_calculo);
                                                ibsUfAliquotaXml = this.extrairNumeroOpcional(rps.IBSUFAliquota, rps.ibs_uf_aliquota, servicoXml.IBSUFAliquota, servicoXml.ibs_uf_aliquota);
                                                ibsUfValorXml = this.extrairNumeroOpcional(rps.IBSUFValor, rps.ibs_uf_valor, servicoXml.IBSUFValor, servicoXml.ibs_uf_valor);
                                                ibsMunAliquotaXml = this.extrairNumeroOpcional(rps.IBSMunAliquota, rps.ibs_mun_aliquota, servicoXml.IBSMunAliquota, servicoXml.ibs_mun_aliquota);
                                                ibsMunValorXml = this.extrairNumeroOpcional(rps.IBSMunValor, rps.ibs_mun_valor, servicoXml.IBSMunValor, servicoXml.ibs_mun_valor);
                                                cbsAliquotaXml = this.extrairNumeroOpcional(rps.CBSAliquota, rps.cbs_aliquota, servicoXml.CBSAliquota, servicoXml.cbs_aliquota);
                                                cbsValorXml = this.extrairNumeroOpcional(rps.CBSValor, rps.cbs_valor, servicoXml.CBSValor, servicoXml.cbs_valor);
                                                ibsValorXml = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                                                    "IBS",
                                                    "ValorIBS",
                                                    "ValorIbs",
                                                    "ibs_value",
                                                ]), this.buscarCampoRecursivo(servicoXml, [
                                                    "IBS",
                                                    "ValorIBS",
                                                    "ValorIbs",
                                                    "ibs_value",
                                                ]));
                                                ibsValueFallback = (ibsUfValorXml !== null && ibsUfValorXml !== void 0 ? ibsUfValorXml : 0) + (ibsMunValorXml !== null && ibsMunValorXml !== void 0 ? ibsMunValorXml : 0) || valorIBS;
                                                pisValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                                                    "PIS",
                                                    "ValorPIS",
                                                    "ValorPis",
                                                    "valor_pis",
                                                ]), this.buscarCampoRecursivo(servicoXml, [
                                                    "PIS",
                                                    "ValorPIS",
                                                    "ValorPis",
                                                    "valor_pis",
                                                ]));
                                                cofinsValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                                                    "COFINS",
                                                    "ValorCOFINS",
                                                    "ValorCofins",
                                                    "valor_cofins",
                                                ]), this.buscarCampoRecursivo(servicoXml, [
                                                    "COFINS",
                                                    "ValorCOFINS",
                                                    "ValorCofins",
                                                    "valor_cofins",
                                                ]));
                                                csllValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                                                    "CSLL",
                                                    "ValorCSLL",
                                                    "ValorCsll",
                                                    "valor_csll",
                                                ]), this.buscarCampoRecursivo(servicoXml, [
                                                    "CSLL",
                                                    "ValorCSLL",
                                                    "ValorCsll",
                                                    "valor_csll",
                                                ]));
                                                irrfValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                                                    "valorIR",
                                                    "ValorIR",
                                                    "IRRF",
                                                    "ValorIRRF",
                                                    "ValorIrrf",
                                                    "valor_irrf",
                                                ]), this.buscarCampoRecursivo(servicoXml, [
                                                    "valorIR",
                                                    "ValorIR",
                                                    "IRRF",
                                                    "ValorIRRF",
                                                    "ValorIrrf",
                                                    "valor_irrf",
                                                ]));
                                                insEst = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, [
                                                    "InscricaoEstadual",
                                                    "InsEst",
                                                    "ins_est",
                                                ]), this.buscarCampoRecursivo(servicoXml, [
                                                    "InscricaoEstadual",
                                                    "InsEst",
                                                    "ins_est",
                                                ]));
                                                ownerRecord = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["OwnerRecord", "owner_record"]), this.buscarCampoRecursivo(servicoXml, [
                                                    "OwnerRecord",
                                                    "owner_record",
                                                ]));
                                                ownerSend = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["OwnerSend", "owner_send"]), this.buscarCampoRecursivo(servicoXml, [
                                                    "OwnerSend",
                                                    "owner_send",
                                                ]));
                                                liquidada = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["Liquidada", "liquidada"]), this.buscarCampoRecursivo(servicoXml, [
                                                    "Liquidada",
                                                    "liquidada",
                                                ]));
                                                receiptDate = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["ReceiptDate", "receipt_date"]), this.buscarCampoRecursivo(servicoXml, [
                                                    "ReceiptDate",
                                                    "receipt_date",
                                                ]));
                                                reciboDate = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["ReciboDate", "recibo_date"]), this.buscarCampoRecursivo(servicoXml, [
                                                    "ReciboDate",
                                                    "recibo_date",
                                                ]));
                                                ibsCbsClassificacaoTributaria = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["cClassTrib", "cclasstrib"]), this.buscarCampoRecursivo(servicoXml, [
                                                    "cClassTrib",
                                                    "cclasstrib",
                                                ]));
                                                aliquotaParaEnvio = aliquotaPercentual > 0 ? aliquotaPercentual : 5;
                                                prestadorObj = {
                                                    inscricao_municipal: inscricaoPrestador,
                                                    codigo_municipio: String("3550308"),
                                                };
                                                if (cnpjPrestador.trim()) {
                                                    prestadorObj.cnpj = cnpjPrestador;
                                                }
                                                if (cpfPrestador.trim()) {
                                                    prestadorObj.cpf = cpfPrestador;
                                                }
                                                if (!prestadorObj.cnpj && !prestadorObj.cpf) {
                                                    throw new Error("Prestador sem CNPJ nem CPF. Configure CNPJ_PRESTADOR ou CPF_PRESTADOR em .env");
                                                }
                                                codigoTribMun = this.deriveCodigoTributarioMunicipio();
                                                naturezaOperacao = tipoTributacao === "P"
                                                    ? 2
                                                    : this.extrairNumero(rps.NaturezaOperacao || servicoXml.NaturezaOperacao, 1);
                                                tipoOperacao = this.extrairNumero(rps.TipoOperacao || servicoXml.TipoOperacao, isExportacao ? 2 : 1);
                                                issRetido = this.extrairBooleano(rps.ISSRetido || servicoXml.ISSRetido, false);
                                                referencia = "LOTE-".concat(Date.now(), "-").concat(index + 1, "-").concat(numeroRps || "RPS");
                                                focusRequest = __assign(__assign({ referencia: referencia, data_emissao: this.formatarData(rps.DataEmissao), natureza_operacao: naturezaOperacao, optante_simples_nacional: false, tipo_operacao_governamental: 1 }, (tipoTributacao && { tributacao_rps: tipoTributacao })), { prestador: __assign(__assign(__assign({}, (cnpjPrestador && { cnpj: cnpjPrestador })), (cpfPrestador && { cpf: cpfPrestador })), { inscricao_municipal: inscricaoPrestador, codigo_municipio: String("3550308") }), tomador: __assign(__assign(__assign(__assign(__assign({}, (cnpjTomador && { cnpj: cnpjTomador })), (cpfTomador && { cpf: cpfTomador })), { razao_social: razaoSocialTomador }), (emailTomador && { email: emailTomador })), { endereco: __assign(__assign(__assign({ logradouro: (enderecTomador.Logradouro || "")
                                                                .trim()
                                                                .substring(0, 50), numero: enderecTomador.NumeroEndereco || "S/N" }, (enderecTomador.ComplementoEndereco && {
                                                            complemento: enderecTomador.ComplementoEndereco,
                                                        })), { bairro: enderecTomador.Bairro || "", codigo_municipio: tipoTributacao === "P"
                                                                ? ""
                                                                : String(codigoMunicipioTomadorCorrigido), uf: enderecTomador.UF, cep: this.formatarCEP(enderecTomador.CEP) }), (isEstrangeiro &&
                                                            enderecTomador.CodigoPais && {
                                                            codigo_pais: enderecTomador.CodigoPais,
                                                        })) }), servico: __assign(__assign(__assign(__assign(__assign({ discriminacao: discriminacao, item_lista_servico: codigoServico, codigo_tributacao_municipio: codigoTribMun || codigoServico }, (codigoCidadeIncidencia && {
                                                        codigo_cidade_incidencia: codigoCidadeIncidencia,
                                                    })), { valor_servicos: valorServicos, valor_final_cobrado: valorFinalCobrado, base_calculo: baseCalculo, aliquota: aliquotaParaEnvio, iss_retido: issRetido, valor_ipi: 0, codigo_nbs: "102010000", codigo_indicador_operacao: "100301", ibs_cbs_classificacao_tributaria: ibsCbsClassificacaoTributaria || "", valor_ir: irrfValue, valor_iss: valorIssXml !== null && valorIssXml !== void 0 ? valorIssXml : valorIss }), (tributacaoIssXml && { tributacao_iss: tributacaoIssXml })), (ibsCbsSituacaoTributariaXml && {
                                                        ibs_cbs_situacao_tributaria: ibsCbsSituacaoTributariaXml,
                                                    })), { ibs_cbs_base_calculo: ibsCbsBaseCalculoXml !== null && ibsCbsBaseCalculoXml !== void 0 ? ibsCbsBaseCalculoXml : baseCalculo, ibs_uf_aliquota: ibsUfAliquotaXml !== null && ibsUfAliquotaXml !== void 0 ? ibsUfAliquotaXml : 1, ibs_uf_valor: ibsUfValorXml !== null && ibsUfValorXml !== void 0 ? ibsUfValorXml : valorIBS, ibs_mun_aliquota: ibsMunAliquotaXml !== null && ibsMunAliquotaXml !== void 0 ? ibsMunAliquotaXml : 0, ibs_mun_valor: ibsMunValorXml !== null && ibsMunValorXml !== void 0 ? ibsMunValorXml : 0, cbs_aliquota: cbsAliquotaXml !== null && cbsAliquotaXml !== void 0 ? cbsAliquotaXml : 9, cbs_valor: cbsValorXml !== null && cbsValorXml !== void 0 ? cbsValorXml : valorCBS }), exigibilidade_suspensa: 0, pagamento_parcelado_antecipado: 0, finalidade_emissao: 0, consumidor_final: 0, indicador_destinatario: 0 });
                                                console.log("✅ Conversão XML → Focus NFe concluída");
                                                console.log("\n🔍 DEBUG - PAYLOAD COMPLETO que será enviado para API:");
                                                console.log(JSON.stringify(focusRequest, null, 2));
                                                requests.push({
                                                    numero_rps: numeroRps,
                                                    referencia: referencia,
                                                    request: focusRequest,
                                                    invoice_data: {
                                                        pis_value: pisValue !== null && pisValue !== void 0 ? pisValue : null,
                                                        cofins_value: cofinsValue !== null && cofinsValue !== void 0 ? cofinsValue : null,
                                                        csll_value: csllValue !== null && csllValue !== void 0 ? csllValue : null,
                                                        irrf_value: irrfValue !== null && irrfValue !== void 0 ? irrfValue : null,
                                                        iss_value: valorIssXml !== null && valorIssXml !== void 0 ? valorIssXml : valorIss,
                                                        ibs_value: ibsValorXml !== null && ibsValorXml !== void 0 ? ibsValorXml : ibsValueFallback,
                                                        cbs_value: cbsValorXml !== null && cbsValorXml !== void 0 ? cbsValorXml : valorCBS,
                                                        ins_est: insEst !== null && insEst !== void 0 ? insEst : null,
                                                        owner_record: ownerRecord !== null && ownerRecord !== void 0 ? ownerRecord : null,
                                                        owner_send: ownerSend !== null && ownerSend !== void 0 ? ownerSend : null,
                                                        liquidada: liquidada !== null && liquidada !== void 0 ? liquidada : null,
                                                        receipt_date: receiptDate !== null && receiptDate !== void 0 ? receiptDate : null,
                                                        recibo_date: reciboDate !== null && reciboDate !== void 0 ? reciboDate : null,
                                                    },
                                                });
                                                _a.label = 6;
                                            case 6:
                                                index++;
                                                return [3 /*break*/, 2];
                                            case 7:
                                                if (!requests.length) {
                                                    throw new Error("Nenhum RPS encontrado no XML informado");
                                                }
                                                resolve(requests);
                                                return [3 /*break*/, 9];
                                            case 8:
                                                error_5 = _a.sent();
                                                reject(new Error("Erro ao converter RPS: ".concat(error_5.message)));
                                                return [3 /*break*/, 9];
                                            case 9: return [2 /*return*/];
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
            N: "N",
            P: "P", // ExportaÃ§Ã£o / regime especÃ­fico informado pelo XML
        };
        return mapa[tributacao] || "T";
    };
    /**
     * Extrai competência (ano-mês) da data
     */
    FocusNfeService.prototype.identificarExportacao = function (rps, servicoXml, isEstrangeiro, tributacaoIss) {
        var _this = this;
        if (isEstrangeiro)
            return true;
        var indicadores = [
            rps.exportacao,
            rps.Exportacao,
            rps.ExportacaoServico,
            servicoXml.exportacao,
            servicoXml.Exportacao,
            servicoXml.ExportacaoServico,
        ];
        if (indicadores.some(function (valor) { return _this.extrairBooleano(valor, false); })) {
            return true;
        }
        return tributacaoIss === "F" || tributacaoIss === "P";
    };
    FocusNfeService.prototype.extrairNumero = function (valor, padrao) {
        if (valor === undefined || valor === null || valor === "") {
            return padrao;
        }
        var numero = Number(valor);
        return Number.isFinite(numero) ? numero : padrao;
    };
    FocusNfeService.prototype.extrairBooleano = function (valor, padrao) {
        if (valor === undefined || valor === null || valor === "") {
            return padrao;
        }
        if (typeof valor === "boolean")
            return valor;
        if (typeof valor === "number")
            return valor !== 0;
        var normalizado = String(valor).trim().toLowerCase();
        if (["1", "true", "t", "sim", "s", "yes", "y"].includes(normalizado)) {
            return true;
        }
        if (["0", "false", "f", "nao", "não", "n", "no"].includes(normalizado)) {
            return false;
        }
        return padrao;
    };
    FocusNfeService.prototype.extrairTextoOpcional = function () {
        var valores = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valores[_i] = arguments[_i];
        }
        for (var _a = 0, valores_1 = valores; _a < valores_1.length; _a++) {
            var valor = valores_1[_a];
            if (valor === undefined || valor === null)
                continue;
            var texto = String(valor).trim();
            if (texto)
                return texto;
        }
        return undefined;
    };
    FocusNfeService.prototype.extrairNumeroOpcional = function () {
        var valores = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valores[_i] = arguments[_i];
        }
        for (var _a = 0, valores_2 = valores; _a < valores_2.length; _a++) {
            var valor = valores_2[_a];
            if (valor === undefined || valor === null || valor === "")
                continue;
            var texto = String(valor).trim();
            var normalizado = texto.includes(",")
                ? texto.replace(/\./g, "").replace(",", ".")
                : texto;
            var numero = Number(normalizado);
            if (Number.isFinite(numero))
                return numero;
        }
        return undefined;
    };
    FocusNfeService.prototype.normalizarChaveCampo = function (valor) {
        return String(valor || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
    };
    FocusNfeService.prototype.buscarCampoRecursivo = function (alvo, nomes) {
        var _this = this;
        if (alvo === undefined || alvo === null)
            return undefined;
        var nomesNormalizados = nomes.map(function (nome) { return _this.normalizarChaveCampo(nome); });
        var procurar = function (valor) {
            if (valor === undefined || valor === null)
                return undefined;
            if (Array.isArray(valor)) {
                for (var _i = 0, valor_1 = valor; _i < valor_1.length; _i++) {
                    var item = valor_1[_i];
                    var encontrado = procurar(item);
                    if (encontrado !== undefined)
                        return encontrado;
                }
                return undefined;
            }
            if (typeof valor !== "object")
                return undefined;
            for (var _a = 0, _b = Object.entries(valor); _a < _b.length; _a++) {
                var _c = _b[_a], chave = _c[0], conteudo = _c[1];
                if (nomesNormalizados.includes(_this.normalizarChaveCampo(chave))) {
                    return conteudo;
                }
            }
            for (var _d = 0, _e = Object.values(valor); _d < _e.length; _d++) {
                var conteudo = _e[_d];
                var encontrado = procurar(conteudo);
                if (encontrado !== undefined)
                    return encontrado;
            }
            return undefined;
        };
        return procurar(alvo);
    };
    FocusNfeService.prototype.extrairNumeroRps = function (rps, padrao) {
        var _a, _b;
        var numero = (rps === null || rps === void 0 ? void 0 : rps.NumeroRPS) ||
            (rps === null || rps === void 0 ? void 0 : rps.numeroRps) ||
            (rps === null || rps === void 0 ? void 0 : rps.numero_rps) ||
            ((_a = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _a === void 0 ? void 0 : _a.NumeroRPS) ||
            ((_b = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _b === void 0 ? void 0 : _b.numeroRps) ||
            padrao;
        return String(numero).trim();
    };
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