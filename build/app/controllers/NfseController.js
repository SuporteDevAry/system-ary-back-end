"use strict";
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
var InvoiceRepository_1 = require("../repositories/InvoiceRepository");
var NfseServiceAdapter_1 = require("../../services/NfseServiceAdapter");
var NfseSpService_1 = require("../../services/NfseSpService");
var api_errors_1 = require("../helpers/api-errors");
function mapStatus(status) {
    if (!status)
        return "";
    var s = String(status).toLowerCase();
    if (s.includes("autoriza") || s.includes("autoriz"))
        return "autorizada";
    if (s.includes("cancel"))
        return "cancelada";
    if (s.includes("erro"))
        return "erro_autorizacao";
    if (s.includes("process"))
        return "processando_autorizacao";
    return s;
}
exports.NfseController = {
    /**
     * Consulta status de uma RPS individual (FocusNFE)
     * GET /api/nfse/consultar-rps/:rps_number
     * Query: { provider?: "prefeitura"|"focusnfe" }
     */
    consultarRps: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var rps_number, provider, nfseService, activeProvider, result, invoice, remoteStatus, mapped, updates, errUpdate_1, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        rps_number = req.params.rps_number;
                        provider = req.query.provider;
                        if (!rps_number) {
                            throw new api_errors_1.BadRequestError("Número da RPS não informado");
                        }
                        nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                        if (provider) {
                            nfseService.setProvider(provider);
                        }
                        activeProvider = nfseService.getProvider();
                        console.log("\uD83D\uDD0D Consultando RPS ".concat(rps_number, " via ").concat(activeProvider, "..."));
                        result = void 0;
                        if (!(activeProvider === "focusnfe")) return [3 /*break*/, 11];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(rps_number)];
                    case 1:
                        invoice = _a.sent();
                        if (!invoice || !invoice.protocolo_lote) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "RPS não encontrada ou sem protocolo_lote/ref para consulta na FocusNFE",
                                })];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        return [4 /*yield*/, nfseService.consultarRps(invoice.protocolo_lote)];
                    case 3:
                        result = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        remoteStatus = (result && (result.status || result.Status)) || null;
                        mapped = mapStatus(remoteStatus);
                        updates = {};
                        if (mapped && mapped !== invoice.status)
                            updates.status = mapped;
                        if (result &&
                            result.url_danfse &&
                            result.url_danfse !== invoice.url_danfse)
                            updates.url_danfse = result.url_danfse;
                        if (!(Object.keys(updates).length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates)];
                    case 5:
                        _a.sent();
                        console.log("[DB] Atualizado RPS ".concat(rps_number, ":"), updates);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        errUpdate_1 = _a.sent();
                        console.warn("Falha ao atualizar invoice após consulta RPS:", errUpdate_1);
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        // Tratamento especial para erro 404 FocusNFE
                        if (error_1.message && error_1.message.includes("API Error 404")) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Lote não encontrado ou ainda não processado na FocusNFE. Aguarde alguns minutos e tente novamente.",
                                    error: error_1.message,
                                })];
                        }
                        // Outros erros
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar RPS",
                                error: error_1.message,
                            })];
                    case 10: return [3 /*break*/, 12];
                    case 11: 
                    // Para prefeitura, não implementado
                    return [2 /*return*/, res.status(400).json({
                            message: "Consulta de RPS individual não suportada para Prefeitura de SP",
                        })];
                    case 12: return [2 /*return*/, res.status(200).json({
                            provider: activeProvider,
                            resultado: result,
                        })];
                    case 13:
                        error_2 = _a.sent();
                        console.error("Erro ao consultar RPS:", error_2);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar RPS",
                                error: error_2.message,
                            })];
                    case 14: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Envia lote de RPS para a Prefeitura de SP ou Focus NFe (conforme NFSE_PROVIDER)
     * POST /api/nfse/enviar-lote
     * Body: { xml: string, provider?: "prefeitura"|"focusnfe", debug?: boolean }
     */
    enviarLoteRps: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, xml, debug, provider, nfseService, activeProvider, prefeituraService, xmlSigned, result, _i, result_1, rps, invoice, invoice, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        _a = req.body, xml = _a.xml, debug = _a.debug, provider = _a.provider;
                        if (!xml || typeof xml !== "string") {
                            throw new api_errors_1.BadRequestError("XML do lote não informado");
                        }
                        nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                        // Se especificou provider na request, usa esse
                        if (provider) {
                            nfseService.setProvider(provider);
                        }
                        activeProvider = nfseService.getProvider();
                        console.log("\uD83D\uDCE8 Enviando via ".concat(activeProvider, "..."));
                        // Se debug=true, retorna apenas o XML assinado sem enviar (apenas para Prefeitura)
                        if (debug && activeProvider === "prefeitura") {
                            prefeituraService = new NfseSpService_1.NfseSpService();
                            xmlSigned = prefeituraService.signXml(xml);
                            return [2 /*return*/, res.status(200).json({
                                    message: "XML assinado (não enviado - modo debug)",
                                    provider: activeProvider,
                                    xmlAssinado: xmlSigned,
                                })];
                        }
                        return [4 /*yield*/, nfseService.enviarLoteRps(xml)];
                    case 1:
                        result = _b.sent();
                        // LOG: Mostra retorno completo da FocusNFE
                        console.log("[FocusNFE] Retorno enviarLoteRps:", JSON.stringify(result, null, 2));
                        if (!result) return [3 /*break*/, 12];
                        if (!Array.isArray(result)) return [3 /*break*/, 8];
                        _i = 0, result_1 = result;
                        _b.label = 2;
                    case 2:
                        if (!(_i < result_1.length)) return [3 /*break*/, 7];
                        rps = result_1[_i];
                        console.log("[FocusNFE] RPS:", rps);
                        if (!rps.numero_rps) return [3 /*break*/, 6];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(rps.numero_rps)];
                    case 3:
                        invoice = _b.sent();
                        if (!invoice) return [3 /*break*/, 5];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, {
                                status: rps.status ? mapStatus(rps.status) : null,
                                protocolo_lote: rps.ref || null,
                            })];
                    case 4:
                        _b.sent();
                        console.log("[DB] Atualizado RPS ".concat(rps.numero_rps, ": status=").concat(rps.status, ", protocolo_lote=").concat(rps.ref));
                        return [3 /*break*/, 6];
                    case 5:
                        console.warn("[DB] RPS n\u00E3o encontrada: ".concat(rps.numero_rps));
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        if (!result.numero_rps) return [3 /*break*/, 12];
                        console.log("[FocusNFE] RPS única:", result);
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(result.numero_rps)];
                    case 9:
                        invoice = _b.sent();
                        if (!invoice) return [3 /*break*/, 11];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, {
                                status: result.status ? mapStatus(result.status) : null,
                                protocolo_lote: result.ref || null,
                            })];
                    case 10:
                        _b.sent();
                        console.log("[DB] Atualizado RPS ".concat(result.numero_rps, ": status=").concat(result.status, ", protocolo_lote=").concat(result.ref));
                        return [3 /*break*/, 12];
                    case 11:
                        console.warn("[DB] RPS n\u00E3o encontrada: ".concat(result.numero_rps));
                        _b.label = 12;
                    case 12: return [2 /*return*/, res.status(200).json({
                            message: "Lote enviado com sucesso",
                            provider: activeProvider,
                            protocolo: result.ref,
                            resultado: result,
                        })];
                    case 13:
                        error_3 = _b.sent();
                        console.error("Erro ao enviar lote RPS:", error_3);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao enviar lote RPS",
                                error: error_3.message,
                            })];
                    case 14: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Consulta status do lote pelo protocolo
     * GET /api/nfse/consultar-lote/:protocolo
     * Query: { provider?: "prefeitura"|"focusnfe" }
     */
    consultarLote: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var protocolo, _a, provider, rps_number, nfseService, activeProvider, result, rpsNum, handleSingle, _i, result_2, item, errUpdate_2, error_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 14, , 15]);
                        protocolo = req.params.protocolo;
                        _a = req.query, provider = _a.provider, rps_number = _a.rps_number;
                        if (!protocolo) {
                            throw new api_errors_1.BadRequestError("Protocolo não informado");
                        }
                        nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                        if (provider) {
                            nfseService.setProvider(provider);
                        }
                        activeProvider = nfseService.getProvider();
                        console.log("\uD83D\uDD0D Consultando lote ".concat(protocolo, " via ").concat(activeProvider, "..."));
                        result = void 0;
                        if (!(activeProvider === "focusnfe" && rps_number)) return [3 /*break*/, 2];
                        rpsNum = Array.isArray(rps_number)
                            ? rps_number[0]
                            : typeof rps_number === "object"
                                ? String(rps_number)
                                : rps_number;
                        return [4 /*yield*/, nfseService.consultarRps(String(rpsNum))];
                    case 1:
                        result = _b.sent();
                        return [3 /*break*/, 13];
                    case 2: return [4 /*yield*/, nfseService.consultarLote(protocolo)];
                    case 3:
                        // Consulta de lote padrão
                        result = _b.sent();
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 12, , 13]);
                        handleSingle = function (obj) { return __awaiter(_this, void 0, void 0, function () {
                            var rpsNum, invoice, remoteStatus, mapped, updates;
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
                                        remoteStatus = obj.status || obj.Status || null;
                                        mapped = mapStatus(remoteStatus);
                                        updates = {};
                                        if (mapped && mapped !== invoice.status)
                                            updates.status = mapped;
                                        if (obj && obj.url_danfse && obj.url_danfse !== invoice.url_danfse)
                                            updates.url_danfse = obj.url_danfse;
                                        if (!(Object.keys(updates).length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates)];
                                    case 2:
                                        _a.sent();
                                        console.log("[DB] Atualizado RPS ".concat(rpsNum, ":"), updates);
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!Array.isArray(result)) return [3 /*break*/, 9];
                        _i = 0, result_2 = result;
                        _b.label = 5;
                    case 5:
                        if (!(_i < result_2.length)) return [3 /*break*/, 8];
                        item = result_2[_i];
                        // eslint-disable-next-line no-await-in-loop
                        return [4 /*yield*/, handleSingle(item)];
                    case 6:
                        // eslint-disable-next-line no-await-in-loop
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, handleSingle(result)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        errUpdate_2 = _b.sent();
                        console.warn("Falha ao atualizar invoice após consulta de lote:", errUpdate_2);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, res.status(200).json({
                            provider: activeProvider,
                            resultado: result,
                        })];
                    case 14:
                        error_4 = _b.sent();
                        console.error("Erro ao consultar lote:", error_4);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar lote",
                                error: error_4.message,
                            })];
                    case 15: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Cancela uma NFS-e
     * POST /api/nfse/cancelar
     * Body: { nfseNumber: string, motivo: string, provider?: "prefeitura"|"focusnfe" }
     */
    cancelarNfse: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nfseNumber, motivo, provider, nfseService, activeProvider, result, invoice, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, nfseNumber = _a.nfseNumber, motivo = _a.motivo, provider = _a.provider;
                        if (!nfseNumber || !motivo) {
                            throw new api_errors_1.BadRequestError("Número da NFS-e e motivo são obrigatórios");
                        }
                        nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                        if (provider) {
                            nfseService.setProvider(provider);
                        }
                        activeProvider = nfseService.getProvider();
                        console.log("\u274C Cancelando ".concat(nfseNumber, " via ").concat(activeProvider, "..."));
                        return [4 /*yield*/, nfseService.cancelarNfse(nfseNumber, motivo)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByNfs_number(nfseNumber)];
                    case 2:
                        invoice = _b.sent();
                        if (invoice) {
                            // TODO: Adicionar campo de status cancelado
                            // await InvoiceRepository.update(invoice.id, { status: 'CANCELADO' });
                        }
                        return [2 /*return*/, res.status(200).json({
                                message: "NFS-e cancelada com sucesso",
                                provider: activeProvider,
                                resultado: result,
                            })];
                    case 3:
                        error_5 = _b.sent();
                        console.error("Erro ao cancelar NFS-e:", error_5);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao cancelar NFS-e",
                                error: error_5.message,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Testa conexão com o webservice (útil para validar certificado)
     * GET /api/nfse/testar-conexao
     * Query: { provider?: "prefeitura"|"focusnfe" }
     */
    testarConexao: function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var provider, nfseService, activeProvider;
            return __generator(this, function (_b) {
                try {
                    provider = req.query.provider;
                    nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                    if (provider) {
                        nfseService.setProvider(provider);
                    }
                    activeProvider = nfseService.getProvider();
                    return [2 /*return*/, res.status(200).json({
                            message: "Serviço configurado com sucesso",
                            provider: activeProvider,
                            ambiente: ((_a = process.env.SOAP_ENDPOINT) === null || _a === void 0 ? void 0 : _a.includes("homologacao"))
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
                            message: "Erro ao conectar",
                            error: error.message,
                        })];
                }
                return [2 /*return*/];
            });
        });
    },
};
//# sourceMappingURL=NfseController.js.map