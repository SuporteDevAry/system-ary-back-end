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
exports.NfseController = {
    /**
     * Envia lote de RPS para a Prefeitura de SP ou Focus NFe (conforme NFSE_PROVIDER)
     * POST /api/nfse/enviar-lote
     * Body: { xml: string, provider?: "prefeitura"|"focusnfe", debug?: boolean }
     */
    enviarLoteRps: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, xml, debug, provider, nfseService, activeProvider, prefeituraService, xmlSigned, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
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
                        return [2 /*return*/, res.status(200).json({
                                message: "Lote enviado com sucesso",
                                provider: activeProvider,
                                protocolo: result.Protocolo || result.NumeroProtocolo || result.referencia,
                                resultado: result,
                            })];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Erro ao enviar lote RPS:", error_1);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao enviar lote RPS",
                                error: error_1.message,
                            })];
                    case 3: return [2 /*return*/];
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
            var protocolo, provider, nfseService, activeProvider, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        protocolo = req.params.protocolo;
                        provider = req.query.provider;
                        if (!protocolo) {
                            throw new api_errors_1.BadRequestError("Protocolo não informado");
                        }
                        nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                        if (provider) {
                            nfseService.setProvider(provider);
                        }
                        activeProvider = nfseService.getProvider();
                        console.log("\uD83D\uDD0D Consultando ".concat(protocolo, " via ").concat(activeProvider, "..."));
                        return [4 /*yield*/, nfseService.consultarLote(protocolo)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                provider: activeProvider,
                                resultado: result,
                            })];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Erro ao consultar lote:", error_2);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao consultar lote",
                                error: error_2.message,
                            })];
                    case 3: return [2 /*return*/];
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
            var _a, nfseNumber, motivo, provider, nfseService, activeProvider, result, invoice, error_3;
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
                        error_3 = _b.sent();
                        console.error("Erro ao cancelar NFS-e:", error_3);
                        return [2 /*return*/, res.status(500).json({
                                message: "Erro ao cancelar NFS-e",
                                error: error_3.message,
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