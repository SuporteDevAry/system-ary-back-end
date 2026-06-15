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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NfseController = void 0;
var xml2js_1 = require("xml2js");
var InvoiceRepository_1 = require("../repositories/InvoiceRepository");
var FocusNfeService_1 = require("../../services/FocusNfeService");
var api_errors_1 = require("../helpers/api-errors");
function mapStatus(status) {
    if (!status)
        return "";
    var s = String(status).toLowerCase();
    if (s.includes("erro"))
        return "erro_autorizacao";
    if (s.includes("cancel"))
        return "cancelada";
    if (s.includes("process"))
        return "processando_autorizacao";
    if (s.includes("autoriza") || s.includes("autoriz"))
        return "autorizada";
    return s;
}
function extrairStatusRespostaFocusNfe(result) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var candidatos = [
        result === null || result === void 0 ? void 0 : result.status,
        result === null || result === void 0 ? void 0 : result.Status,
        result === null || result === void 0 ? void 0 : result.situacao,
        result === null || result === void 0 ? void 0 : result.Situacao,
        result === null || result === void 0 ? void 0 : result.message,
        result === null || result === void 0 ? void 0 : result.mensagem,
        (_a = result === null || result === void 0 ? void 0 : result.resultado) === null || _a === void 0 ? void 0 : _a.status,
        (_b = result === null || result === void 0 ? void 0 : result.resultado) === null || _b === void 0 ? void 0 : _b.Status,
        (_c = result === null || result === void 0 ? void 0 : result.resultado) === null || _c === void 0 ? void 0 : _c.situacao,
        (_d = result === null || result === void 0 ? void 0 : result.resultado) === null || _d === void 0 ? void 0 : _d.Situacao,
        (_e = result === null || result === void 0 ? void 0 : result.resultado) === null || _e === void 0 ? void 0 : _e.message,
        (_f = result === null || result === void 0 ? void 0 : result.resultado) === null || _f === void 0 ? void 0 : _f.mensagem,
        (_g = result === null || result === void 0 ? void 0 : result.data) === null || _g === void 0 ? void 0 : _g.status,
        (_h = result === null || result === void 0 ? void 0 : result.data) === null || _h === void 0 ? void 0 : _h.Status,
        (_j = result === null || result === void 0 ? void 0 : result.data) === null || _j === void 0 ? void 0 : _j.situacao,
        (_k = result === null || result === void 0 ? void 0 : result.data) === null || _k === void 0 ? void 0 : _k.Situacao,
        (_l = result === null || result === void 0 ? void 0 : result.data) === null || _l === void 0 ? void 0 : _l.message,
        (_m = result === null || result === void 0 ? void 0 : result.data) === null || _m === void 0 ? void 0 : _m.mensagem,
    ];
    for (var _i = 0, candidatos_1 = candidatos; _i < candidatos_1.length; _i++) {
        var candidato = candidatos_1[_i];
        var mapped = mapStatus(typeof candidato === "string" ? candidato : candidato ? String(candidato) : "");
        if (mapped)
            return mapped;
    }
    return "";
}
function extrairNumeroNfse(item) {
    var valor = (item === null || item === void 0 ? void 0 : item.numero_nfse) ||
        (item === null || item === void 0 ? void 0 : item.numeroNfse) ||
        (item === null || item === void 0 ? void 0 : item.numero) ||
        (item === null || item === void 0 ? void 0 : item.nfs_number) ||
        (item === null || item === void 0 ? void 0 : item.numero_nota) ||
        (item === null || item === void 0 ? void 0 : item.numeroNota) ||
        null;
    return valor ? String(valor).trim() : null;
}
function extrairCodigoVerificacao(item) {
    var _a, _b, _c, _d;
    var candidatos = [
        item === null || item === void 0 ? void 0 : item.codigo_verificacao,
        item === null || item === void 0 ? void 0 : item.codigoVerificacao,
        item === null || item === void 0 ? void 0 : item.codigo_verif,
        item === null || item === void 0 ? void 0 : item.code_verif,
        (_a = item === null || item === void 0 ? void 0 : item.resultado) === null || _a === void 0 ? void 0 : _a.codigo_verificacao,
        (_b = item === null || item === void 0 ? void 0 : item.resultado) === null || _b === void 0 ? void 0 : _b.codigoVerificacao,
        (_c = item === null || item === void 0 ? void 0 : item.data) === null || _c === void 0 ? void 0 : _c.codigo_verificacao,
        (_d = item === null || item === void 0 ? void 0 : item.data) === null || _d === void 0 ? void 0 : _d.codigoVerificacao,
    ];
    for (var _i = 0, candidatos_2 = candidatos; _i < candidatos_2.length; _i++) {
        var candidato = candidatos_2[_i];
        if (candidato === undefined || candidato === null)
            continue;
        var valor = String(candidato).trim();
        if (valor)
            return valor;
    }
    return null;
}
function extrairUrlDanfse(item) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var candidatos = [
        item === null || item === void 0 ? void 0 : item.url_danfse,
        item === null || item === void 0 ? void 0 : item.urlDanfse,
        item === null || item === void 0 ? void 0 : item.danfse_url,
        item === null || item === void 0 ? void 0 : item.danfe_url,
        (_a = item === null || item === void 0 ? void 0 : item.resultado) === null || _a === void 0 ? void 0 : _a.url_danfse,
        (_b = item === null || item === void 0 ? void 0 : item.resultado) === null || _b === void 0 ? void 0 : _b.urlDanfse,
        (_c = item === null || item === void 0 ? void 0 : item.resultado) === null || _c === void 0 ? void 0 : _c.danfse_url,
        (_d = item === null || item === void 0 ? void 0 : item.resultado) === null || _d === void 0 ? void 0 : _d.danfe_url,
        (_e = item === null || item === void 0 ? void 0 : item.data) === null || _e === void 0 ? void 0 : _e.url_danfse,
        (_f = item === null || item === void 0 ? void 0 : item.data) === null || _f === void 0 ? void 0 : _f.urlDanfse,
        (_g = item === null || item === void 0 ? void 0 : item.data) === null || _g === void 0 ? void 0 : _g.danfse_url,
        (_h = item === null || item === void 0 ? void 0 : item.data) === null || _h === void 0 ? void 0 : _h.danfe_url,
    ];
    for (var _i = 0, candidatos_3 = candidatos; _i < candidatos_3.length; _i++) {
        var candidato = candidatos_3[_i];
        if (candidato === undefined || candidato === null)
            continue;
        var valor = String(candidato).trim();
        if (valor)
            return valor;
    }
    return null;
}
function extrairReferenciaLote(item, fallback) {
    var valor = (item === null || item === void 0 ? void 0 : item.ref) ||
        (item === null || item === void 0 ? void 0 : item.referencia) ||
        (item === null || item === void 0 ? void 0 : item.protocolo_lote) ||
        (item === null || item === void 0 ? void 0 : item.numero_lote) ||
        (item === null || item === void 0 ? void 0 : item.protocolo) ||
        fallback ||
        null;
    return valor ? String(valor).trim() : null;
}
function extrairNumeroRpsDaReferencia(referencia) {
    if (!referencia)
        return null;
    var valor = String(referencia).trim();
    var partes = valor.split("-");
    if (partes.length < 4)
        return null;
    var candidato = partes[partes.length - 1].trim();
    return candidato ? candidato : null;
}
function extrairNumeroRpsRetorno(item) {
    var valor = (item === null || item === void 0 ? void 0 : item.numero_rps) ||
        (item === null || item === void 0 ? void 0 : item.numeroRps) ||
        (item === null || item === void 0 ? void 0 : item.rps_number) ||
        (item === null || item === void 0 ? void 0 : item.numero) ||
        extrairNumeroRpsDaReferencia(extrairReferenciaLote(item, null)) ||
        null;
    return valor ? String(valor).trim() : null;
}
function extrairNumerosRpsDoXml(xml) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    (0, xml2js_1.parseString)(xml, { explicitArray: false }, function (err, result) {
                        if (err) {
                            reject(new Error("Erro ao parsear XML do lote: ".concat(err.message)));
                            return;
                        }
                        var pedido = result === null || result === void 0 ? void 0 : result.PedidoEnvioLoteRPS;
                        var rpsArray = (pedido === null || pedido === void 0 ? void 0 : pedido.RPS)
                            ? Array.isArray(pedido.RPS)
                                ? pedido.RPS
                                : [pedido.RPS]
                            : [];
                        var numeros = rpsArray
                            .map(function (rps) {
                            var _a, _b;
                            return String((rps === null || rps === void 0 ? void 0 : rps.NumeroRPS) ||
                                (rps === null || rps === void 0 ? void 0 : rps.numeroRps) ||
                                (rps === null || rps === void 0 ? void 0 : rps.numero_rps) ||
                                ((_a = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _a === void 0 ? void 0 : _a.NumeroRPS) ||
                                ((_b = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _b === void 0 ? void 0 : _b.numeroRps) ||
                                "").trim();
                        })
                            .filter(Boolean);
                        resolve(numeros);
                    });
                })];
        });
    });
}
var focusNfeService = new FocusNfeService_1.FocusNfeService();
exports.NfseController = {
    /**
     * Envia lote de RPS para a Focus NFe
     * POST /api/nfse/enviar-lote
     * Body: { xml: string }
     */
    enviarLoteRps: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var xml, result, numerosRpsXml, resultados, index, item, referenciaLote, numeroRpsXml, numeroRpsRetorno, invoiceData, codigoVerificacao, numeroRps, invoice, _a, _b, numeroNfse, updates, camposTributarios, _i, camposTributarios_1, campo, valor, protocolo, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        xml = req.body.xml;
                        if (!xml || typeof xml !== "string") {
                            throw new api_errors_1.BadRequestError("XML do lote não informado");
                        }
                        return [4 /*yield*/, focusNfeService.enviarLoteRps(xml)];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, extrairNumerosRpsDoXml(xml)];
                    case 2:
                        numerosRpsXml = _c.sent();
                        resultados = Array.isArray(result)
                            ? result
                            : Array.isArray(result === null || result === void 0 ? void 0 : result.resultado)
                                ? result.resultado
                                : result
                                    ? [result]
                                    : [];
                        if (resultados.length > 1 && numerosRpsXml.length > 0) {
                            console.log("[NFSe] XML cont\u00E9m ".concat(numerosRpsXml.length, " RPS e a resposta retornou ").concat(resultados.length, " itens"));
                        }
                        index = 0;
                        _c.label = 3;
                    case 3:
                        if (!(index < resultados.length)) return [3 /*break*/, 11];
                        item = resultados[index] || {};
                        referenciaLote = extrairReferenciaLote(item, (result === null || result === void 0 ? void 0 : result.ref) || null);
                        numeroRpsXml = numerosRpsXml[index] || null;
                        numeroRpsRetorno = extrairNumeroRpsRetorno(item) || "";
                        invoiceData = item.invoice_data || {};
                        codigoVerificacao = extrairCodigoVerificacao(item);
                        numeroRps = extrairNumeroRpsDaReferencia(referenciaLote) ||
                            numeroRpsRetorno ||
                            numeroRpsXml ||
                            "";
                        if (!numeroRps) {
                            console.warn("[NFSe] Resultado sem n\u00FAmero de RPS identific\u00E1vel no \u00EDndice ".concat(index));
                            return [3 /*break*/, 10];
                        }
                        if (numeroRpsXml && numeroRpsXml !== numeroRps) {
                            console.warn("[NFSe] Diverg\u00EAncia de mapeamento no \u00EDndice ".concat(index, ": XML=").concat(numeroRpsXml, " retorno=").concat(numeroRps));
                        }
                        if (numeroRpsRetorno && numeroRpsRetorno !== numeroRps) {
                            console.warn("[NFSe] Retorno da API indicou RPS ".concat(numeroRpsRetorno, ", mas a refer\u00EAncia aponta para RPS ").concat(numeroRps));
                        }
                        if (numeroRpsXml && numeroRpsXml !== numeroRpsRetorno && numeroRpsRetorno) {
                            console.warn("[NFSe] Retorno da API trouxe RPS ".concat(numeroRpsRetorno, ", que n\u00E3o foi localizado no XML enviado"));
                        }
                        _b = referenciaLote;
                        if (!_b) return [3 /*break*/, 5];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByProtocoloLote(referenciaLote)];
                    case 4:
                        _b = (_c.sent());
                        _c.label = 5;
                    case 5:
                        _a = (_b);
                        if (_a) return [3 /*break*/, 7];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(numeroRps)];
                    case 6:
                        _a = (_c.sent());
                        _c.label = 7;
                    case 7:
                        invoice = _a;
                        if (!invoice) return [3 /*break*/, 9];
                        numeroNfse = extrairNumeroNfse(item);
                        updates = __assign(__assign(__assign({ status: item.status ? mapStatus(item.status) : null }, (numeroNfse && { nfs_number: numeroNfse })), (referenciaLote && { protocolo_lote: referenciaLote })), { xml_nfse: xml });
                        camposTributarios = [
                            "pis_value",
                            "cofins_value",
                            "csll_value",
                            "irrf_value",
                            "iss_value",
                            "ibs_value",
                            "cbs_value",
                            "ins_est",
                            "owner_record",
                            "owner_send",
                            "liquidada",
                            "receipt_date",
                            "recibo_date",
                        ];
                        for (_i = 0, camposTributarios_1 = camposTributarios; _i < camposTributarios_1.length; _i++) {
                            campo = camposTributarios_1[_i];
                            valor = invoiceData === null || invoiceData === void 0 ? void 0 : invoiceData[campo];
                            if (valor !== undefined && valor !== null && valor !== "") {
                                updates[campo] = valor;
                            }
                        }
                        if (codigoVerificacao) {
                            updates.code_verif = codigoVerificacao;
                        }
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates)];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        console.warn("[DB] RPS n\u00E3o encontrada: ".concat(numeroRps));
                        _c.label = 10;
                    case 10:
                        index++;
                        return [3 /*break*/, 3];
                    case 11:
                        protocolo = extrairReferenciaLote(Array.isArray(result) ? result[0] : result) ||
                            extrairReferenciaLote(resultados[0]) ||
                            null;
                        return [2 /*return*/, res.status(200).json({
                                message: "Lote enviado com sucesso",
                                protocolo: protocolo,
                                resultado: result,
                            })];
                    case 12:
                        error_1 = _c.sent();
                        console.error("Erro ao enviar lote RPS:", error_1);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao enviar lote RPS",
                                error: error_1.message,
                            })];
                    case 13: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Consulta status de uma RPS individual
     * GET /api/nfse/consultar-rps/:rps_number
     */
    consultarRps: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var rps_number, invoice, result, remoteStatus, mapped, codigoVerificacao, urlDanfse, updates, error_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        rps_number = req.params.rps_number;
                        if (!rps_number) {
                            throw new api_errors_1.BadRequestError("Número da RPS não informado");
                        }
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(rps_number)];
                    case 1:
                        invoice = _a.sent();
                        if (!invoice || !invoice.protocolo_lote) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "RPS não encontrada ou sem protocolo_lote para consulta.",
                                })];
                        }
                        result = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, focusNfeService.consultarRps(invoice.protocolo_lote)];
                    case 3:
                        result = _a.sent();
                        remoteStatus = (result && (result.status || result.Status)) || null;
                        mapped = mapStatus(remoteStatus);
                        codigoVerificacao = extrairCodigoVerificacao(result);
                        urlDanfse = extrairUrlDanfse(result);
                        updates = {};
                        if (mapped && mapped !== invoice.status)
                            updates.status = mapped;
                        if (urlDanfse && urlDanfse !== invoice.url_danfse)
                            updates.url_danfse = urlDanfse;
                        if (codigoVerificacao)
                            updates.code_verif = codigoVerificacao;
                        if (!(Object.keys(updates).length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        if (error_2.message && error_2.message.includes("API Error 404")) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Lote não encontrado ou ainda não processado. Aguarde alguns minutos e tente novamente.",
                                    error: error_2.message,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar RPS",
                                error: error_2.message,
                            })];
                    case 7: return [2 /*return*/, res.status(200).json({ resultado: result })];
                    case 8:
                        error_3 = _a.sent();
                        console.error("Erro ao consultar RPS:", error_3);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar RPS",
                                error: error_3.message,
                            })];
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Consulta status do lote pelo protocolo
     * GET /api/nfse/consultar-lote/:protocolo
     */
    consultarLote: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var protocolo, result, handleSingle, _i, result_1, item, errUpdate_1, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        protocolo = req.params.protocolo;
                        if (!protocolo) {
                            throw new api_errors_1.BadRequestError("Protocolo não informado");
                        }
                        return [4 /*yield*/, focusNfeService.consultarLote(protocolo)];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        handleSingle = function (obj) { return __awaiter(_this, void 0, void 0, function () {
                            var rpsNum, invoice, mapped, urlDanfse, updates, codigoVerificacao;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        rpsNum = obj.numero_rps || obj.numero || null;
                                        if (!rpsNum)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(String(rpsNum))];
                                    case 1:
                                        invoice = _a.sent();
                                        if (!invoice)
                                            return [2 /*return*/];
                                        mapped = mapStatus(obj.status || obj.Status || null);
                                        urlDanfse = extrairUrlDanfse(obj);
                                        updates = {};
                                        if (mapped && mapped !== invoice.status)
                                            updates.status = mapped;
                                        if (urlDanfse && urlDanfse !== invoice.url_danfse)
                                            updates.url_danfse = urlDanfse;
                                        codigoVerificacao = extrairCodigoVerificacao(obj);
                                        if (codigoVerificacao)
                                            updates.code_verif = codigoVerificacao;
                                        if (!(Object.keys(updates).length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!Array.isArray(result)) return [3 /*break*/, 7];
                        _i = 0, result_1 = result;
                        _a.label = 3;
                    case 3:
                        if (!(_i < result_1.length)) return [3 /*break*/, 6];
                        item = result_1[_i];
                        return [4 /*yield*/, handleSingle(item)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, handleSingle(result)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        errUpdate_1 = _a.sent();
                        console.warn("Falha ao atualizar invoice após consulta de lote:", errUpdate_1);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, res.status(200).json({ resultado: result })];
                    case 12:
                        error_4 = _a.sent();
                        console.error("Erro ao consultar lote:", error_4);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar lote",
                                error: error_4.message,
                            })];
                    case 13: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Cancela uma NFS-e
     * DELETE /api/nfse/:referencia
     * Body: { referencia: string, justificativa: string }
     */
    cancelarNfse: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var referencia, justificativa, justificativaFormatada, invoice, _a, _b, referenciaCancelamento, statusNormalizado, result, retornoStatus, codigoVerificacao, error_5, apiErrorMatch, apiStatus;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        referencia = req.params.referencia ||
                            req.body.referencia ||
                            req.body.nfseNumber ||
                            req.body.numeroNfse ||
                            req.body.protocolo;
                        justificativa = req.body.justificativa ||
                            req.body.motivo ||
                            req.body.motivo_cancelamento;
                        if (!referencia) {
                            throw new api_errors_1.BadRequestError("Referência da NFSe não informada");
                        }
                        if (!justificativa) {
                            throw new api_errors_1.BadRequestError("Justificativa do cancelamento não informada");
                        }
                        justificativaFormatada = String(justificativa).trim();
                        if (justificativaFormatada.length < 15 ||
                            justificativaFormatada.length > 255) {
                            throw new api_errors_1.BadRequestError("Justificativa deve ter entre 15 e 255 caracteres");
                        }
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByNfs_number(String(referencia).trim())];
                    case 1:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(String(referencia).trim())];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a = _b;
                        if (_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByProtocoloLote(String(referencia).trim())];
                    case 4:
                        _a = (_c.sent());
                        _c.label = 5;
                    case 5:
                        invoice = _a;
                        referenciaCancelamento = (invoice === null || invoice === void 0 ? void 0 : invoice.protocolo_lote) || String(referencia).trim();
                        if (invoice) {
                            statusNormalizado = String(invoice.status || "").toLowerCase();
                            if (statusNormalizado && statusNormalizado !== "autorizada") {
                                return [2 /*return*/, res.status(400).json({
                                        message: "Somente NFS-e autorizadas podem ser canceladas na FocusNFe.",
                                        statusAtual: invoice.status,
                                    })];
                            }
                            if (!invoice.protocolo_lote && invoice.protocolo_lote !== referenciaCancelamento) {
                                return [2 /*return*/, res.status(400).json({
                                        message: "Não foi encontrada a referência da NFSe necessária para cancelar esta nota.",
                                    })];
                            }
                        }
                        return [4 /*yield*/, focusNfeService.cancelarNfse(referenciaCancelamento, justificativaFormatada)];
                    case 6:
                        result = _c.sent();
                        retornoStatus = extrairStatusRespostaFocusNfe(result);
                        codigoVerificacao = extrairCodigoVerificacao(result);
                        if (!(invoice && (retornoStatus || codigoVerificacao))) return [3 /*break*/, 8];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, __assign(__assign({}, (retornoStatus && { status: retornoStatus })), (codigoVerificacao && { code_verif: codigoVerificacao })))];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [2 /*return*/, res.status(200).json({
                            message: "NFSe cancelada com sucesso",
                            resultado: result,
                        })];
                    case 9:
                        error_5 = _c.sent();
                        apiErrorMatch = String((error_5 === null || error_5 === void 0 ? void 0 : error_5.message) || "").match(/API Error (\d+):/i);
                        if (apiErrorMatch) {
                            apiStatus = Number(apiErrorMatch[1]);
                            if (apiStatus === 400 || apiStatus === 404) {
                                return [2 /*return*/, res.status(apiStatus).json({
                                        message: error_5.message,
                                    })];
                            }
                        }
                        console.error("Erro ao cancelar NFSe:", error_5);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao cancelar NFSe",
                                error: error_5.message,
                            })];
                    case 10: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Testa configuração do serviço
     * GET /api/nfse/testar-conexao
     */
    testarConexao: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, res.status(200).json({
                            message: "Serviço FocusNFE configurado com sucesso",
                            ambiente: (process.env.FOCUS_NFE_API_URL || "").includes("homologacao")
                                ? "HOMOLOGAÇÃO"
                                : "PRODUÇÃO",
                            prestador: {
                                cnpj: process.env.PRESTADOR_CNPJ,
                                inscricaoMunicipal: process.env.PRESTADOR_IM,
                            },
                        })];
                }
                catch (error) {
                    return [2 /*return*/, res.status(500).json({
                            message: "Erro ao verificar configuração",
                            error: error.message,
                        })];
                }
                return [2 /*return*/];
            });
        });
    },
};
//# sourceMappingURL=NfseController.js.map