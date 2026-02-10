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
require("express-async-errors");
require("reflect-metadata");
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var data_source_1 = require("./database/data-source");
var routes_1 = __importDefault(require("./app/routes"));
//Error middleware fazer aqui para eliminar try catch no app
var error_1 = require("./app/middlewares/error");
// Seeds
var SeedProducts_1 = require("./database/seeds/SeedProducts");
var SeedProductsTables_1 = require("./database/seeds/SeedProductsTables");
var UpdateContractEmissionDatetime_1 = require("./database/seeds/UpdateContractEmissionDatetime");
var port = process.env.SERVER_PORT;
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "100mb" }));
app.use(routes_1.default);
app.use(error_1.errorMiddleware);
app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
// AppDataSource.initialize().then(async () => {
//   app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
//   });
// });
(0, data_source_1.initializeDataSource)()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(process.env.NODE_ENV === "dev")) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, SeedProducts_1.seedProducts)(data_source_1.AppDataSource)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, SeedProductsTables_1.seedProductTables)(data_source_1.AppDataSource)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!(process.env.RUN_UPDATE_CONTRACT_DATETIME === "true")) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, UpdateContractEmissionDatetime_1.updateContractEmissionDatetime)(data_source_1.AppDataSource)];
            case 4:
                _a.sent();
                // Desativa a flag após executar (você pode remover manualmente do .env depois)
                console.log("⚠️  Script executado! Remova RUN_UPDATE_CONTRACT_DATETIME=true do .env para evitar execuções futuras.");
                _a.label = 5;
            case 5:
                app.listen(port, function () {
                    console.log("Server is running on port: ".concat(port));
                });
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (err) {
    console.error("💥 Erro fatal ao inicializar AppDataSource:", err);
    console.error("🔄 O processo será encerrado. O container deve reiniciar automaticamente.");
    process.exit(1); // Força o container a reiniciar
});
//# sourceMappingURL=server.js.map