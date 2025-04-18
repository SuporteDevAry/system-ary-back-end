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
exports.AddClientNew1720832053181 = void 0;
var typeorm_1 = require("typeorm");
var AddClientNew1720832053181 = /** @class */ (function () {
    function AddClientNew1720832053181() {
    }
    AddClientNew1720832053181.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var hasTable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.hasTable("client")];
                    case 1:
                        hasTable = _a.sent();
                        if (!!hasTable) return [3 /*break*/, 3];
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "client",
                                columns: [
                                    {
                                        name: "id",
                                        type: "uuid",
                                        isPrimary: true,
                                    },
                                    {
                                        name: "code_client",
                                        type: "int",
                                    },
                                    {
                                        name: "nickname",
                                        type: "varchar",
                                    },
                                    {
                                        name: "name",
                                        type: "varchar",
                                    },
                                    {
                                        name: "address",
                                        type: "varchar",
                                    },
                                    {
                                        name: "number",
                                        type: "varchar",
                                    },
                                    {
                                        name: "complement",
                                        type: "varchar",
                                    },
                                    {
                                        name: "district",
                                        type: "varchar",
                                    },
                                    {
                                        name: "city",
                                        type: "varchar",
                                    },
                                    {
                                        name: "state",
                                        type: "varchar",
                                    },
                                    {
                                        name: "zip_code",
                                        type: "varchar",
                                    },
                                    {
                                        name: "kind",
                                        type: "varchar",
                                    },
                                    {
                                        name: "cnpj_cpf",
                                        type: "varchar",
                                    },
                                    {
                                        name: "ins_est",
                                        type: "varchar",
                                    },
                                    {
                                        name: "ins_mun",
                                        type: "varchar",
                                    },
                                    {
                                        name: "telephone",
                                        type: "varchar",
                                    },
                                    {
                                        name: "cellphone",
                                        type: "varchar",
                                    },
                                    {
                                        name: "situation",
                                        type: "varchar",
                                    },
                                    {
                                        name: "account",
                                        type: "text",
                                        isArray: true,
                                        default: "'{}'::text[]",
                                    },
                                    {
                                        name: "created_at",
                                        type: "timestamp",
                                        default: "now()",
                                    },
                                    {
                                        name: "updated_at",
                                        type: "timestamp",
                                        default: "now()",
                                    },
                                ],
                                uniques: [
                                    // Correção do nome para `uniqueConstraints`
                                    {
                                        name: "UQ_client_code_client",
                                        columnNames: ["code_client"], // Colunas que têm a restrição única
                                    },
                                ],
                            }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddClientNew1720832053181.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var hasTable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.hasTable("client")];
                    case 1:
                        hasTable = _a.sent();
                        if (!hasTable) return [3 /*break*/, 3];
                        return [4 /*yield*/, queryRunner.dropTable("client")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AddClientNew1720832053181;
}());
exports.AddClientNew1720832053181 = AddClientNew1720832053181;
//# sourceMappingURL=1720832053181-AddClientNew.js.map