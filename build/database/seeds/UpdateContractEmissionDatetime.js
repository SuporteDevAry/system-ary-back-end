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
exports.updateContractEmissionDatetime = void 0;
var GrainContracts_1 = require("../../app/entities/GrainContracts");
function updateContractEmissionDatetime(dataSource) {
    return __awaiter(this, void 0, void 0, function () {
        var grainContractRepository, contracts, updated, skipped, _i, contracts_1, contract, dateStr, match, dateIso, createdAt, hourStr, minStr, secStr, msStr, datetimeStr, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    grainContractRepository = dataSource.getRepository(GrainContracts_1.GrainContract);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    console.log("Iniciando atualização de contract_emission_datetime...");
                    return [4 /*yield*/, grainContractRepository.find({
                            where: { contract_emission_date: null },
                        })];
                case 2:
                    contracts = _a.sent();
                    console.log("Encontrados ".concat(contracts.length, " contratos para atualizar..."));
                    updated = 0;
                    skipped = 0;
                    _i = 0, contracts_1 = contracts;
                    _a.label = 3;
                case 3:
                    if (!(_i < contracts_1.length)) return [3 /*break*/, 8];
                    contract = contracts_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    // Se já tem contract_emission_datetime, pula
                    if (contract.contract_emission_datetime) {
                        skipped++;
                        return [3 /*break*/, 7];
                    }
                    // Se não tem contract_emission_date, não consegue processar
                    if (!contract.contract_emission_date) {
                        console.warn("Contrato ".concat(contract.id, " n\u00E3o possui contract_emission_date"));
                        skipped++;
                        return [3 /*break*/, 7];
                    }
                    dateStr = contract.contract_emission_date;
                    match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                    dateIso = "";
                    if (match) {
                        // Converte para YYYY-MM-DD
                        dateIso = "".concat(match[3], "-").concat(match[2], "-").concat(match[1]);
                    }
                    else {
                        // Tenta usar como está
                        dateIso = dateStr;
                    }
                    createdAt = new Date(contract.created_at);
                    hourStr = createdAt.getHours().toString().padStart(2, "0");
                    minStr = createdAt.getMinutes().toString().padStart(2, "0");
                    secStr = createdAt.getSeconds().toString().padStart(2, "0");
                    msStr = createdAt.getMilliseconds().toString().padStart(3, "0");
                    datetimeStr = "".concat(dateIso, "T").concat(hourStr, ":").concat(minStr, ":").concat(secStr, ".").concat(msStr);
                    contract.contract_emission_datetime = new Date(datetimeStr);
                    // Salva
                    return [4 /*yield*/, grainContractRepository.save(contract)];
                case 5:
                    // Salva
                    _a.sent();
                    updated++;
                    if (updated % 100 === 0) {
                        console.log("Atualizados ".concat(updated, " contratos..."));
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Erro ao atualizar contrato ".concat(contract.id, ":"), error_1.message);
                    skipped++;
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    console.log("\n\u2705 Atualiza\u00E7\u00E3o conclu\u00EDda!\n   - Atualizados: ".concat(updated, "\n   - Pulados: ").concat(skipped, "\n   - Total processado: ").concat(updated + skipped, "\n    "));
                    return [3 /*break*/, 10];
                case 9:
                    error_2 = _a.sent();
                    console.error("Erro ao executar seed:", error_2);
                    throw error_2;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.updateContractEmissionDatetime = updateContractEmissionDatetime;
//# sourceMappingURL=UpdateContractEmissionDatetime.js.map