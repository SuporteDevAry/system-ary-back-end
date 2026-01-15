"use strict";
/**
 * Exemplo de como usar o NfseServiceAdapter nos controllers
 * Permite alternar entre Prefeitura e Focus NFe facilmente
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
exports.emitirNfseHandler = exports.enviarNfseDiretaPrefeitura = exports.enviarNfseComFocusNfe = exports.enviarNfseComConfigPadrao = void 0;
var NfseServiceAdapter_1 = require("../services/NfseServiceAdapter");
// ============= EXEMPLO DE USO =============
/**
 * OPÇÃO 1: Usar a configuração padrão (definida por NFSE_PROVIDER no .env)
 */
function enviarNfseComConfigPadrao(xml) {
    return __awaiter(this, void 0, void 0, function () {
        var nfseService, resultado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                    console.log("\uD83D\uDCE8 Provider ativo: ".concat(nfseService.getProvider()));
                    return [4 /*yield*/, nfseService.enviarLoteRps(xml)];
                case 1:
                    resultado = _a.sent();
                    return [2 /*return*/, resultado];
            }
        });
    });
}
exports.enviarNfseComConfigPadrao = enviarNfseComConfigPadrao;
/**
 * OPÇÃO 2: Alterar provider em tempo de execução
 */
function enviarNfseComFocusNfe(xml) {
    return __awaiter(this, void 0, void 0, function () {
        var nfseService, resultado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                    // Alterna para Focus NFe
                    nfseService.setProvider("focusnfe");
                    console.log("\uD83D\uDCE8 Usando: ".concat(nfseService.getProvider()));
                    return [4 /*yield*/, nfseService.enviarLoteRps(xml)];
                case 1:
                    resultado = _a.sent();
                    return [2 /*return*/, resultado];
            }
        });
    });
}
exports.enviarNfseComFocusNfe = enviarNfseComFocusNfe;
/**
 * OPÇÃO 3: Usar diretamente a Prefeitura
 */
function enviarNfseDiretaPrefeitura(xml) {
    return __awaiter(this, void 0, void 0, function () {
        var nfseService, resultado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                    // Garante que está usando Prefeitura
                    nfseService.setProvider("prefeitura");
                    console.log("\uD83D\uDCE8 Usando: ".concat(nfseService.getProvider()));
                    return [4 /*yield*/, nfseService.enviarLoteRps(xml)];
                case 1:
                    resultado = _a.sent();
                    return [2 /*return*/, resultado];
            }
        });
    });
}
exports.enviarNfseDiretaPrefeitura = enviarNfseDiretaPrefeitura;
/**
 * OPÇÃO 4: Exemplo em um Controller/Route
 */
function emitirNfseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, xml, provider, nfseService, resultado, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, xml = _a.xml, provider = _a.provider;
                    // Validar XML
                    if (!xml) {
                        return [2 /*return*/, res.status(400).json({ erro: "XML não fornecido" })];
                    }
                    nfseService = (0, NfseServiceAdapter_1.getNfseService)();
                    // Se foi especificado um provider, usar esse
                    if (provider) {
                        nfseService.setProvider(provider);
                    }
                    console.log("\n\uD83D\uDD04 Emitindo NFS-e com provider: ".concat(nfseService.getProvider(), "\n"));
                    return [4 /*yield*/, nfseService.enviarLoteRps(xml)];
                case 1:
                    resultado = _b.sent();
                    res.json({
                        sucesso: true,
                        provider: nfseService.getProvider(),
                        resultado: resultado,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    res.status(500).json({
                        sucesso: false,
                        erro: error_1.message,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.emitirNfseHandler = emitirNfseHandler;
// ============= CONFIGURAÇÃO .env =============
/*
# Definir qual provider usar por padrão
# Opções: "prefeitura" ou "focusnfe"
NFSE_PROVIDER=focusnfe

# Configuração Focus NFe
FOCUS_NFE_API_URL=https://api.focusnfe.com.br/v2
FOCUS_NFE_API_TOKEN=seu_token_aqui

# Configuração Prefeitura SP (já existente)
PRESTADOR_IM=67527655
PRESTADOR_CNPJ=05668724000121
CERT_PEM_PATH=./certificates/cert.pem
KEY_PEM_PATH=./certificates/key.pem
WSDL_URL=https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx?wsdl
SOAP_ENDPOINT=https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx
*/
//# sourceMappingURL=NFSE_ADAPTER_EXAMPLES.js.map