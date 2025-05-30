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
exports.generateNumberContract = exports.grainContractRepository = void 0;
var GrainContracts_1 = require("../entities/GrainContracts");
var data_source_1 = require("../../database/data-source");
exports.grainContractRepository = data_source_1.AppDataSource.getRepository(GrainContracts_1.GrainContract);
// Definição dos grupos
var productGroups = {
    group1: ["S", "T", "SG", "CN"],
    group2: ["O", "OC", "OA", "SB", "EP"],
    group3: ["F"],
};
// Função para determinar a qual grupo um produto pertence
var getProductGroup = function (product) {
    for (var _i = 0, _a = Object.entries(productGroups); _i < _a.length; _i++) {
        var _b = _a[_i], group = _b[0], products = _b[1];
        if (products.includes(product)) {
            return group; // Retorna "group1" ou "group2"
        }
    }
    return null; // Retorna null se não encontrar o grupo
};
var generateNumberContract = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var product, number_broker, currentYear, productGroup, productsInGroup, listProducts, validProducts, siglaProduct, query, result, nextIncrement, lastNumberContract, match, formattedIncrement, numberContract, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                product = data.product, number_broker = data.number_broker;
                currentYear = new Date().getFullYear().toString().slice(-2);
                if (!product) {
                    throw new Error("Produto não informado.");
                }
                productGroup = getProductGroup(product);
                if (!productGroup) {
                    throw new Error("Produto ".concat(product, " n\u00E3o pertence a nenhum grupo."));
                }
                productsInGroup = productGroups[productGroup];
                listProducts = ["O", "OC", "OA", "SB", "EP"];
                validProducts = listProducts.includes(product);
                siglaProduct = validProducts ? "O" : product;
                query = "\n      SELECT number_contract\n      FROM grain_contracts\n      WHERE product = ANY($1)  -- Passando o array de produtos\n      AND number_contract LIKE $2\n      ORDER BY created_at DESC\n      LIMIT 1\n  ";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.grainContractRepository.query(query, [
                        productsInGroup,
                        "%.%-%/".concat(currentYear),
                    ])];
            case 2:
                result = _a.sent();
                nextIncrement = 1;
                if (result.length > 0) {
                    lastNumberContract = result[0].number_contract;
                    match = lastNumberContract.match(/-(\d{3})\/\d{2}$/);
                    if (match && match[1]) {
                        nextIncrement = parseInt(match[1], 10) + 1; // Incrementa o número extraído
                    }
                }
                formattedIncrement = nextIncrement.toString().padStart(3, "0");
                numberContract = "".concat(siglaProduct, ".").concat(number_broker, "-").concat(formattedIncrement, "/").concat(currentYear);
                return [2 /*return*/, numberContract];
            case 3:
                error_1 = _a.sent();
                console.error("Erro ao gerar o número do contrato:", error_1);
                throw new Error("Erro ao gerar o número do contrato.");
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.generateNumberContract = generateNumberContract;
//# sourceMappingURL=GrainContractRepository.js.map