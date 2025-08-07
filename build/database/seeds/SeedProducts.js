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
exports.seedProducts = void 0;
var Products_1 = require("../../app/entities/Products");
function seedProducts(dataSource) {
    return __awaiter(this, void 0, void 0, function () {
        var productRepository, products, _i, products_1, product, exists, newProduct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productRepository = dataSource.getRepository(Products_1.Product);
                    products = [
                        {
                            product_type: "S",
                            name: "SOJA em Grãos",
                            commission_seller: "0,25",
                            type_commission_seller: "Percentual",
                            quality: "Padr\u00E3o exporta\u00E7\u00E3o conforme ANEC 41.\nSoja transg\u00EAnica (GMO positivo).",
                            observation: "1-Mercadoria destinada \u00E0 exporta\u00E7\u00E3o.\n2-O comprador se compromete a apresentar os documentos de exporta\u00E7\u00E3o no prazo determinado por lei, tais como:\nDUE com refer\u00EAncia das Notas Fiscais de Remessa.\nNF de Exporta\u00E7\u00E3o.\nBill of Lading (BL).\n3-CBOT refer\u00EAncia =   ... ......... / .......... spot.",
                        },
                        {
                            product_type: "CN",
                            name: "MILHO em Grãos",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Padrão exportação conforme contrato ANEC nr. 43.",
                            observation: "1-Mercadoria destinada \u00E0 exporta\u00E7\u00E3o.\n2-O comprador se compromete a apresentar os documentos de exporta\u00E7\u00E3o no prazo determinado por lei, tais como:\nDUE com refer\u00EAncia das Notas Fiscais de Remessa.\nNF de Exporta\u00E7\u00E3o.\nBill of Lading (BL).\n3-CBOT refer\u00EAncia =   ... ......... / .......... spot.",
                        },
                        {
                            product_type: "T",
                            name: "TRIGO",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Trigo P\u00E3o Tipo 1, \u00E0 granel, umidade m\u00E1xima 13,0%, impurezas m\u00E1xima1,0%, \nPH m\u00EDnimo 78, triguilho m\u00E1ximo 1,5%, falling number m\u00EDnimo 250, W m\u00EDnimo 250, \nDON m\u00E1ximo 2ppm, prote\u00EDna m\u00EDnima 12,5%, isento de mofados, germinados e livre de insetos vivos e/ou mortos.",
                            observation: "1- Venda para comercialização sem RE.",
                        },
                        {
                            product_type: "SG",
                            name: "SORGO",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Peso de Teste: 56,0 LB/Bushel\nBCFM: M\u00E1x. 7%\nN\u00FAmero Danificado: M\u00E1x. M\u00E1x. 5%\nDano de Calor: M\u00E1x. 0,5%\nUmidade: M\u00E1x. 14,5%\nTanino: M\u00E1x. 0,5%\nAflatoxina: M\u00E1x. 20PPB",
                            observation: "1- Mercadoria destinada \u00E0 exporta\u00E7\u00E3o.\n2- O comprador se compromete a apresentar os documentos de exporta\u00E7\u00E3o no prazo determinado por lei.",
                        },
                        {
                            product_type: "O",
                            name: "ÓLEO DE SOJA a Granel",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Padrão exportação, conforme contrato ANEC nr. 81.",
                            observation: "Mercadoria destinada a fabricação de biodiesel.",
                        },
                        {
                            product_type: "F",
                            name: "FARELO DE SOJA a Granel",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Farelo de soja, base 46% prote\u00EDna min 45%, demais termos e condi\u00E7\u00F5es desse contrato de acordo com a clausula 3 do contrato ANEC nr. 71. GMP+.",
                            observation: "1-O comprador e respons\u00E1vel pela obten\u00E7\u00E3o das cotas para remessa da mercadoria para o porto.\n2-Despesas portu\u00E1rias por conta do comprador.\n3-O comprador e respons\u00E1vel pela apresenta\u00E7\u00E3o de c\u00F3pias do(s) DUE (s) averbadas \n   e dever\u00E1 fazer constar no campo especifico do(s) DUE(s) o NOME e CNPJ do vendedor como \n   sendo o fabricante/vendedor. \n   O comprador tamb\u00E9m dever\u00E1 apresentar o(s) respectivo(s) memorando(s) de exporta\u00E7\u00E3o at\u00E9 \n   30 dias ap\u00F3s o(s) embarque(s).\n4-Vendedor e Comprador concordam em que a Control Union \u00E9 exclu\u00EDda como entidade \n   supervisora.\n5-Demais cl\u00E1usulas n\u00E3o citadas neste contrato ser\u00E3o conforme ANEC 71.",
                        },
                        {
                            product_type: "OC",
                            name: "ÓLEO DE CANOLA a Granel",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Acidez até 1.30% sem desconto, acima desconto de 2x1, Fósforo até 200 ppm.",
                            observation: "Mercadoria destinada a fabricação de biodiesel.",
                        },
                        {
                            product_type: "OA",
                            name: "ÓLEO DE ALGODÃO a Granel",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "",
                            observation: "Mercadoria destinada a fabricação de biodiesel.",
                        },
                        {
                            product_type: "SB",
                            name: "SEBO BOVINO",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Acidez máxima 10%.",
                            observation: "Mercadoria destinada a fabricação de biodiesel.",
                        },
                        {
                            product_type: "EP",
                            name: "ESTEARINA DE PALMA",
                            commission_seller: "0,50",
                            type_commission_seller: "Percentual",
                            quality: "Estearina de palma refinada, branqueada e desodorizada. (Refined bleached deodorised Palm Stearin - RBD PS)",
                            observation: "Mercadoria destinada a fabricação de biodiesel.",
                        },
                    ];
                    _i = 0, products_1 = products;
                    _a.label = 1;
                case 1:
                    if (!(_i < products_1.length)) return [3 /*break*/, 5];
                    product = products_1[_i];
                    return [4 /*yield*/, productRepository.findOneBy({
                            product_type: product.product_type,
                        })];
                case 2:
                    exists = _a.sent();
                    if (!!exists) return [3 /*break*/, 4];
                    newProduct = productRepository.create(product);
                    return [4 /*yield*/, productRepository.save(newProduct)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("✅ Seed de produtos finalizada com sucesso!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.seedProducts = seedProducts;
//# sourceMappingURL=SeedProducts.js.map