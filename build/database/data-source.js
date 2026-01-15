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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDataSource = exports.AppDataSource = void 0;
require("reflect-metadata");
var dotenv_1 = __importDefault(require("dotenv"));
var typeorm_1 = require("typeorm");
var migrations_1 = require("./migrations");
var entities_1 = require("../app/entities");
dotenv_1.default.config({ path: ".env" });
var SSL_VALUE = process.env.TYPEORM_SSL === "false" ? false : { rejectUnauthorized: false };
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: true,
    logging: false,
    entities: entities_1.entitiesDir,
    migrations: migrations_1.migrationDir,
    subscribers: [],
    ssl: SSL_VALUE,
    // Configurações para melhor resiliência
    connectTimeoutMS: 30000,
    maxQueryExecutionTime: 30000,
    extra: {
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        max: 20,
        min: 2, // Mínimo de conexões no pool
    },
});
// Função auxiliar para tentar inicializar com retry
function initializeDataSource(maxRetries, delayMs) {
    if (maxRetries === void 0) { maxRetries = 5; }
    if (delayMs === void 0) { delayMs = 5000; }
    return __awaiter(this, void 0, void 0, function () {
        var lastError, _loop_1, attempt, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastError = null;
                    _loop_1 = function (attempt) {
                        var error_1, waitTime_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 5]);
                                    console.log("Tentando conectar ao banco de dados (tentativa ".concat(attempt, "/").concat(maxRetries, ")..."));
                                    return [4 /*yield*/, exports.AppDataSource.initialize()];
                                case 1:
                                    _b.sent();
                                    console.log("✅ Conexão com banco de dados estabelecida com sucesso!");
                                    return [2 /*return*/, { value: true }];
                                case 2:
                                    error_1 = _b.sent();
                                    lastError = error_1;
                                    console.error("\u274C Falha na tentativa ".concat(attempt, "/").concat(maxRetries, ":"), error_1);
                                    if (!(attempt < maxRetries)) return [3 /*break*/, 4];
                                    waitTime_1 = delayMs * attempt;
                                    console.log("\u23F3 Aguardando ".concat(waitTime_1, "ms antes da pr\u00F3xima tentativa..."));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, waitTime_1); })];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4: return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 1;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(attempt)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    attempt++;
                    return [3 /*break*/, 1];
                case 4:
                    console.error("❌ Não foi possível conectar ao banco de dados após todas as tentativas.");
                    throw lastError;
            }
        });
    });
}
exports.initializeDataSource = initializeDataSource;
//# sourceMappingURL=data-source.js.map