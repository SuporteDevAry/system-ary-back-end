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
var FocusNfeService_1 = require("../../services/FocusNfeService");
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
var focusNfeService = new FocusNfeService_1.FocusNfeService();
exports.NfseController = {
    /**
     * Envia lote de RPS para a Focus NFe
     * POST /api/nfse/enviar-lote
     * Body: { xml: string }
     */
    enviarLoteRps: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var xml, result, _i, result_1, rps, invoice, invoice, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        xml = req.body.xml;
                        if (!xml || typeof xml !== "string") {
                            throw new api_errors_1.BadRequestError("XML do lote não informado");
                        }
                        return [4 /*yield*/, focusNfeService.enviarLoteRps(xml)];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 12];
                        if (!Array.isArray(result)) return [3 /*break*/, 8];
                        _i = 0, result_1 = result;
                        _a.label = 2;
                    case 2:
                        if (!(_i < result_1.length)) return [3 /*break*/, 7];
                        rps = result_1[_i];
                        if (!rps.numero_rps) return [3 /*break*/, 6];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(rps.numero_rps)];
                    case 3:
                        invoice = _a.sent();
                        if (!invoice) return [3 /*break*/, 5];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, {
                                status: rps.status ? mapStatus(rps.status) : null,
                                protocolo_lote: rps.ref || null,
                                xml_nfse: xml,
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.warn("[DB] RPS n\u00E3o encontrada: ".concat(rps.numero_rps));
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        if (!result.numero_rps) return [3 /*break*/, 12];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.findByRps_number(result.numero_rps)];
                    case 9:
                        invoice = _a.sent();
                        if (!invoice) return [3 /*break*/, 11];
                        return [4 /*yield*/, InvoiceRepository_1.InvoiceRepository.update(invoice.id, {
                                status: result.status ? mapStatus(result.status) : null,
                                protocolo_lote: result.ref || null,
                                xml_nfse: xml,
                            })];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        console.warn("[DB] RPS n\u00E3o encontrada: ".concat(result.numero_rps));
                        _a.label = 12;
                    case 12: return [2 /*return*/, res.status(200).json({
                            message: "Lote enviado com sucesso",
                            protocolo: result.ref,
                            resultado: result,
                        })];
                    case 13:
                        error_1 = _a.sent();
                        console.error("Erro ao enviar lote RPS:", error_1);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao enviar lote RPS",
                                error: error_1.message,
                            })];
                    case 14: return [2 /*return*/];
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
            var rps_number, invoice, result, remoteStatus, mapped, updates, error_2, error_3;
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
                                    message: "RPS não encontrada ou sem protocolo_lote para consulta na FocusNFE",
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
                        updates = {};
                        if (mapped && mapped !== invoice.status)
                            updates.status = mapped;
                        if ((result === null || result === void 0 ? void 0 : result.url_danfse) && result.url_danfse !== invoice.url_danfse)
                            updates.url_danfse = result.url_danfse;
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
                                    message: "Lote não encontrado ou ainda não processado na FocusNFE. Aguarde alguns minutos e tente novamente.",
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
            var protocolo, result, handleSingle, _i, result_2, item, errUpdate_1, error_4;
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
                            var rpsNum, invoice, mapped, updates;
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
                                        updates = {};
                                        if (mapped && mapped !== invoice.status)
                                            updates.status = mapped;
                                        if ((obj === null || obj === void 0 ? void 0 : obj.url_danfse) && obj.url_danfse !== invoice.url_danfse)
                                            updates.url_danfse = obj.url_danfse;
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
                        _i = 0, result_2 = result;
                        _a.label = 3;
                    case 3:
                        if (!(_i < result_2.length)) return [3 /*break*/, 6];
                        item = result_2[_i];
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
     * POST /api/nfse/cancelar
     * Body: { nfseNumber: string, motivo: string }
     */
    cancelarNfse: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nfseNumber, motivo, result, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, nfseNumber = _a.nfseNumber, motivo = _a.motivo;
                        if (!nfseNumber || !motivo) {
                            throw new api_errors_1.BadRequestError("Número da NFS-e e motivo são obrigatórios");
                        }
                        return [4 /*yield*/, focusNfeService.cancelarNfse(nfseNumber, motivo)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "NFS-e cancelada com sucesso",
                                resultado: result,
                            })];
                    case 2:
                        error_5 = _b.sent();
                        console.error("Erro ao cancelar NFS-e:", error_5);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao cancelar NFS-e",
                                error: error_5.message,
                            })];
                    case 3: return [2 /*return*/];
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