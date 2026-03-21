"use strict";
/**
 * Adapter que permite alternar entre:
 * 1. NfseSpService - Integração direta com webservice da Prefeitura (interno)
 * 2. FocusNfeService - Integração com API Focus NFe (terceirizado)
 *
 * Uso: Permite manter ambos os códigos enquanto o webservice da Prefeitura se estabiliza
 */
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
exports.getNfseService = exports.NfseServiceAdapter = void 0;
var NfseSpService_1 = require("./NfseSpService");
var FocusNfeService_1 = require("./FocusNfeService");
var NfseServiceAdapter = /** @class */ (function () {
    function NfseServiceAdapter(provider) {
        if (provider === void 0) { provider = "prefeitura"; }
        this.prefeituraService = new NfseSpService_1.NfseSpService();
        this.focusNfeService = new FocusNfeService_1.FocusNfeService();
        this.provider = provider;
        console.log("\uD83D\uDD04 NfseServiceAdapter inicializado com provider: ".concat(provider));
    }
    /**
     * Alterna o provider de serviço
     */
    NfseServiceAdapter.prototype.setProvider = function (provider) {
        this.provider = provider;
        console.log("\u2705 Provider alterado para: ".concat(provider));
    };
    /**
     * Retorna o provider atual
     */
    NfseServiceAdapter.prototype.getProvider = function () {
        return this.provider;
    };
    /**
     * Envia lote de RPS usando o provider configurado
     */
    NfseServiceAdapter.prototype.enviarLoteRps = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === "prefeitura") {
                    console.log("📤 Enviando via Prefeitura (webservice interno)...");
                    return [2 /*return*/, this.prefeituraService.enviarLoteRps(xml)];
                }
                else {
                    console.log("📤 Enviando via Focus NFe (terceirizado)...");
                    return [2 /*return*/, this.focusNfeService.enviarLoteRps(xml)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Consulta status de uma RPS individual (apenas FocusNFE)
     */
    NfseServiceAdapter.prototype.consultarRps = function (rps_number) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === "focusnfe") {
                    return [2 /*return*/, this.focusNfeService.consultarRps(rps_number)];
                }
                else {
                    throw new Error("Consulta de RPS individual não suportada para Prefeitura de SP");
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Consulta lote usando o provider configurado
     */
    NfseServiceAdapter.prototype.consultarLote = function (numeroProtocolo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === "prefeitura") {
                    console.log("🔍 Consultando via Prefeitura (webservice interno)...");
                    return [2 /*return*/, this.prefeituraService.consultarLote(numeroProtocolo)];
                }
                else {
                    console.log("🔍 Consultando via Focus NFe (terceirizado)...");
                    return [2 /*return*/, this.focusNfeService.consultarLote(numeroProtocolo)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Cancela NFS-e usando o provider configurado
     */
    NfseServiceAdapter.prototype.cancelarNfse = function (numeroNfse, motivo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === "prefeitura") {
                    console.log("❌ Cancelando via Prefeitura (webservice interno)...");
                    return [2 /*return*/, this.prefeituraService.cancelarNfse(numeroNfse, motivo)];
                }
                else {
                    console.log("❌ Cancelando via Focus NFe (terceirizado)...");
                    return [2 /*return*/, this.focusNfeService.cancelarNfse(numeroNfse, motivo)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Retorna qual serviço está ativo
     */
    NfseServiceAdapter.prototype.getActiveService = function () {
        var _this = this;
        if (this.provider === "prefeitura") {
            // Retorna objeto que implementa todos métodos da interface
            return {
                enviarLoteRps: this.prefeituraService.enviarLoteRps.bind(this.prefeituraService),
                consultarLote: this.prefeituraService.consultarLote.bind(this.prefeituraService),
                cancelarNfse: this.prefeituraService.cancelarNfse.bind(this.prefeituraService),
                consultarRps: function (rps_number) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error("Consulta de RPS individual não suportada para Prefeitura de SP");
                    });
                }); },
            };
        }
        else {
            return this.focusNfeService;
        }
    };
    return NfseServiceAdapter;
}());
exports.NfseServiceAdapter = NfseServiceAdapter;
// Exportar singleton com config via .env
var getNfseService = function () {
    var provider = (process.env.NFSE_PROVIDER || "focusnfe");
    return new NfseServiceAdapter(provider);
};
exports.getNfseService = getNfseService;
//# sourceMappingURL=NfseServiceAdapter.js.map