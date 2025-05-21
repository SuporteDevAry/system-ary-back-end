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
var data_source_1 = require("../../database/data-source");
var GrainContracts_1 = require("../entities/GrainContracts");
// Definição dos grupos de produtos
var productGroups = {
    group1: ["S", "T", "SG", "CN"],
    group2: ["O"],
    group3: ["F"],
};
// Função para obter o grupo do produto
var getProductGroup = function (product) {
    for (var _i = 0, _a = Object.entries(productGroups); _i < _a.length; _i++) {
        var _b = _a[_i], group = _b[0], products = _b[1];
        if (products.includes(product)) {
            return group;
        }
    }
    return null;
};
var fixContractNumbers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var grainContractRepository, contracts, updatedContracts, lastIncrementByGroupYear, _i, contracts_1, contract, id, product, number_broker, created_at, year, productGroup, key, formattedIncrement, newNumberContract, _a, updatedContracts_1, _b, id, number_contract;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, data_source_1.AppDataSource.initialize()];
            case 1:
                _c.sent();
                grainContractRepository = data_source_1.AppDataSource.getRepository(GrainContracts_1.GrainContract);
                return [4 /*yield*/, grainContractRepository.find({
                        order: { created_at: "ASC" }, // Ordena pela data para manter o sequencial
                    })];
            case 2:
                contracts = _c.sent();
                updatedContracts = [];
                lastIncrementByGroupYear = {};
                for (_i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
                    contract = contracts_1[_i];
                    id = contract.id, product = contract.product, number_broker = contract.number_broker, created_at = contract.created_at;
                    year = new Date(created_at).getFullYear().toString().slice(-2);
                    productGroup = getProductGroup(product);
                    if (!productGroup) {
                        console.warn("Produto ".concat(product, " n\u00E3o pertence a nenhum grupo, ignorando..."));
                        continue;
                    }
                    key = "".concat(productGroup, "-").concat(year);
                    // Se for o primeiro contrato do grupo no ano, começa do 001
                    if (!lastIncrementByGroupYear[key]) {
                        lastIncrementByGroupYear[key] = 1;
                    }
                    else {
                        lastIncrementByGroupYear[key] += 1;
                    }
                    formattedIncrement = lastIncrementByGroupYear[key]
                        .toString()
                        .padStart(3, "0");
                    newNumberContract = "".concat(product, ".").concat(number_broker, "-").concat(formattedIncrement, "/").concat(year);
                    updatedContracts.push({ id: id, number_contract: newNumberContract });
                    console.log("Contrato atualizado: ".concat(id, " -> ").concat(newNumberContract));
                }
                _a = 0, updatedContracts_1 = updatedContracts;
                _c.label = 3;
            case 3:
                if (!(_a < updatedContracts_1.length)) return [3 /*break*/, 6];
                _b = updatedContracts_1[_a], id = _b.id, number_contract = _b.number_contract;
                return [4 /*yield*/, grainContractRepository.update(id, { number_contract: number_contract })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _a++;
                return [3 /*break*/, 3];
            case 6:
                console.log("Correção de contratos concluída!");
                process.exit();
                return [2 /*return*/];
        }
    });
}); };
fixContractNumbers().catch(function (error) {
    console.error("Erro ao corrigir contratos:", error);
    process.exit(1);
});
//# sourceMappingURL=FixContractNumbers.js.map