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
exports.AddTaxAndContractFieldsToInvoices1778624659540 = void 0;
var typeorm_1 = require("typeorm");
var AddTaxAndContractFieldsToInvoices1778624659540 = /** @class */ (function () {
    function AddTaxAndContractFieldsToInvoices1778624659540() {
    }
    AddTaxAndContractFieldsToInvoices1778624659540.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var hasTable, columns, _i, columns_1, column, hasColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.hasTable("invoices")];
                    case 1:
                        hasTable = _a.sent();
                        if (!hasTable)
                            return [2 /*return*/];
                        columns = [
                            { name: "pis_value", type: "decimal" },
                            { name: "cofins_value", type: "decimal" },
                            { name: "csll_value", type: "decimal" },
                            { name: "iss_value", type: "decimal" },
                            { name: "number_contract", type: "varchar" },
                            { name: "exportacao", type: "varchar" },
                        ];
                        _i = 0, columns_1 = columns;
                        _a.label = 2;
                    case 2:
                        if (!(_i < columns_1.length)) return [3 /*break*/, 6];
                        column = columns_1[_i];
                        return [4 /*yield*/, queryRunner.hasColumn("invoices", column.name)];
                    case 3:
                        hasColumn = _a.sent();
                        if (!!hasColumn) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.addColumn("invoices", new typeorm_1.TableColumn({
                                name: column.name,
                                type: column.type,
                                isNullable: true,
                            }))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AddTaxAndContractFieldsToInvoices1778624659540.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var hasTable, columns, _i, columns_2, column, hasColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.hasTable("invoices")];
                    case 1:
                        hasTable = _a.sent();
                        if (!hasTable)
                            return [2 /*return*/];
                        columns = [
                            "exportacao",
                            "number_contract",
                            "iss_value",
                            "csll_value",
                            "cofins_value",
                            "pis_value",
                        ];
                        _i = 0, columns_2 = columns;
                        _a.label = 2;
                    case 2:
                        if (!(_i < columns_2.length)) return [3 /*break*/, 6];
                        column = columns_2[_i];
                        return [4 /*yield*/, queryRunner.hasColumn("invoices", column)];
                    case 3:
                        hasColumn = _a.sent();
                        if (!hasColumn) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.dropColumn("invoices", column)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AddTaxAndContractFieldsToInvoices1778624659540;
}());
exports.AddTaxAndContractFieldsToInvoices1778624659540 = AddTaxAndContractFieldsToInvoices1778624659540;
//# sourceMappingURL=1778624659540-AddTaxAndContractFieldsToInvoices.js.map