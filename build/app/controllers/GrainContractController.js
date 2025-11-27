"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrainContractController = void 0;
var GrainContractRepository_1 = require("../repositories/GrainContractRepository");
var calcCommission_1 = require("../../utills/calcCommission");
var convertPrice_1 = require("../../utills/convertPrice");
var calculateTotalContractValue_1 = require("../../utills/calculateTotalContractValue");
var GrainContractController = /** @class */ (function () {
    function GrainContractController() {
        var _this = this;
        this.getReport = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, seller, buyer, year, month, date, product, name_product, page, per_page, qb, sellers, conds_1, params_1, buyers, conds_2, params_2, parsedDate, d, brMatch, isoMatch, _b, day, monthP, yearP, dt, y, m, pageProvided, perPageProvided, data, total, pageNum, perPage, offset, error_1;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 4, , 5]);
                        _a = req.query, seller = _a.seller, buyer = _a.buyer, year = _a.year, month = _a.month, date = _a.date, product = _a.product, name_product = _a.name_product, page = _a.page, per_page = _a.per_page;
                        qb = GrainContractRepository_1.grainContractRepository.createQueryBuilder("gc");
                        // Filtrar por seller — suporta objeto com campo `name` ou arrays; aceita valores separados por vírgula
                        if (seller) {
                            sellers = String(seller)
                                .split(",")
                                .map(function (s) { return s.trim(); })
                                .filter(function (s) { return s.length > 0; });
                            if (sellers.length > 0) {
                                conds_1 = [];
                                params_1 = {};
                                // condições para buscar pelo campo name ou nickname dentro do objeto seller
                                sellers.forEach(function (s, i) {
                                    var keyName = "sellerName".concat(i);
                                    var keyNick = "sellerNick".concat(i);
                                    conds_1.push("gc.seller->>'name' ILIKE :".concat(keyName));
                                    conds_1.push("gc.seller->>'nickname' ILIKE :".concat(keyNick));
                                    params_1[keyName] = "%".concat(s, "%");
                                    params_1[keyNick] = "%".concat(s, "%");
                                });
                                // condição adicional para compatibilidade com seller sendo um array JSONB de strings
                                conds_1.push("gc.seller @> :sellersArray");
                                params_1.sellersArray = JSON.stringify(sellers);
                                qb.andWhere("(".concat(conds_1.join(" OR "), ")"), params_1);
                            }
                        }
                        // Filtrar por buyer — suporta objeto com campo `name` ou arrays; aceita valores separados por vírgula
                        if (buyer) {
                            buyers = String(buyer)
                                .split(",")
                                .map(function (b) { return b.trim(); })
                                .filter(function (b) { return b.length > 0; });
                            if (buyers.length > 0) {
                                conds_2 = [];
                                params_2 = {};
                                buyers.forEach(function (b, i) {
                                    var keyName = "buyerName".concat(i);
                                    var keyNick = "buyerNick".concat(i);
                                    conds_2.push("gc.buyer->>'name' ILIKE :".concat(keyName));
                                    conds_2.push("gc.buyer->>'nickname' ILIKE :".concat(keyNick));
                                    params_2[keyName] = "%".concat(b, "%");
                                    params_2[keyNick] = "%".concat(b, "%");
                                });
                                conds_2.push("gc.buyer @> :buyersArray");
                                params_2.buyersArray = JSON.stringify(buyers);
                                qb.andWhere("(".concat(conds_2.join(" OR "), ")"), params_2);
                            }
                        }
                        // Filtrar por produto (prefixo) e nome do produto (busca parcial)
                        if (product) {
                            qb.andWhere("gc.product = :product", { product: product });
                        }
                        if (name_product) {
                            qb.andWhere("gc.name_product ILIKE :name_product", {
                                name_product: "%".concat(String(name_product), "%"),
                            });
                        }
                        // Filtrar por data completa (DD/MM/YYYY ou YYYY-MM-DD) — compara a parte DATE de created_at
                        if (date) {
                            parsedDate = null;
                            d = String(date).trim();
                            brMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(d);
                            isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(d);
                            if (brMatch) {
                                _b = d.split("/"), day = _b[0], monthP = _b[1], yearP = _b[2];
                                parsedDate = "".concat(yearP, "-").concat(monthP, "-").concat(day); // YYYY-MM-DD
                            }
                            else if (isoMatch) {
                                parsedDate = d;
                            }
                            else {
                                dt = new Date(d);
                                if (!Number.isNaN(dt.getTime())) {
                                    parsedDate = dt.toISOString().slice(0, 10);
                                }
                            }
                            if (parsedDate) {
                                qb.andWhere("(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END) = to_date(:createdDate, 'YYYY-MM-DD')", {
                                    createdDate: parsedDate,
                                });
                            }
                        }
                        else {
                            // Filtrar por ano/mês a partir do created_at
                            if (year) {
                                y = Number(year);
                                if (!Number.isNaN(y)) {
                                    qb.andWhere("EXTRACT(YEAR FROM (CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END)) = :year", {
                                        year: y,
                                    });
                                }
                            }
                            if (month) {
                                m = Number(month);
                                if (!Number.isNaN(m)) {
                                    qb.andWhere("EXTRACT(MONTH FROM (CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END)) = :month", {
                                        month: m,
                                    });
                                }
                            }
                        }
                        pageProvided = typeof page !== "undefined";
                        perPageProvided = typeof per_page !== "undefined";
                        data = [];
                        total = 0;
                        if (!(pageProvided || perPageProvided)) return [3 /*break*/, 2];
                        pageNum = Number(page) >= 1 ? Number(page) : 1;
                        perPage = Number(per_page) >= 1 ? Number(per_page) : 50;
                        offset = (pageNum - 1) * perPage;
                        return [4 /*yield*/, qb
                                .orderBy("(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS timestamp) END)", "DESC")
                                .skip(offset)
                                .take(perPage)
                                .getManyAndCount()];
                    case 1:
                        _c = _e.sent(), data = _c[0], total = _c[1];
                        return [2 /*return*/, res.json({ data: data, total: total, page: pageNum, per_page: perPage })];
                    case 2: return [4 /*yield*/, qb
                            .orderBy("(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS timestamp) END)", "DESC")
                            .getManyAndCount()];
                    case 3:
                        // Sem paginação: retornar todos os resultados
                        _d = _e.sent(), data = _d[0], total = _d[1];
                        return [2 /*return*/, res.json({ data: data, total: total })];
                    case 4:
                        error_1 = _e.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_1.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.getGrainContracts = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var grainContracts, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.find()];
                    case 1:
                        grainContracts = _a.sent();
                        return [2 /*return*/, res.json(grainContracts)];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_2.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getGrainContractById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, grainContract, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.findOne({
                                where: { id: id },
                            })];
                    case 2:
                        grainContract = _a.sent();
                        if (!grainContract) {
                            return [2 /*return*/, res.status(404).json({ message: "GrainContract not found" })];
                        }
                        return [2 /*return*/, res.json(grainContract)];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_3.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.createGrainContract = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var numberContract, total_contract_value, dataWithConvertedPrice, commissionValue, grainContract, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, GrainContractRepository_1.generateNumberContract)(req.body)];
                    case 1:
                        numberContract = _a.sent();
                        total_contract_value = (0, calculateTotalContractValue_1.calculateTotalContractValue)(req.body.product, req.body.quantity, req.body.price);
                        dataWithConvertedPrice = __assign(__assign({}, req.body), { total_contract_value: total_contract_value });
                        commissionValue = (0, calcCommission_1.calcCommission)(dataWithConvertedPrice);
                        grainContract = GrainContractRepository_1.grainContractRepository.create(__assign(__assign({}, dataWithConvertedPrice), { number_contract: numberContract, final_quantity: req.body.quantity, status_received: "Não", commission_contract: commissionValue }));
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(grainContract)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, res.status(201).json(result)];
                    case 3:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_4.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.updateGrainContract = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, otherFields, grainContract, validNumberContract, match, currentProduct, currentBroker, currentIncrement, currentYear, isProductDifferent, isBrokerDifferent, updatedProduct, updatedBroker, listProducts, siglaProduct, productToCheck, quantityToUse, priceFromRequest, currencyToCheck, exchangeRateToCheck, price, total_contract_value, updatedGrainContract, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        otherFields = __rest(req.body, []);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.findOneBy({ id: id })];
                    case 2:
                        grainContract = _a.sent();
                        if (!grainContract) {
                            return [2 /*return*/, res.status(404).json({ message: "Contrato não encontrado" })];
                        }
                        validNumberContract = /^([A-Z]+)\.([A-Z0-9]+)-(\d{3})\/(\d{2})$/;
                        match = grainContract.number_contract.match(validNumberContract);
                        if (match) {
                            currentProduct = match[1], currentBroker = match[2], currentIncrement = match[3], currentYear = match[4];
                            isProductDifferent = otherFields.product && otherFields.product !== currentProduct;
                            isBrokerDifferent = otherFields.number_broker &&
                                otherFields.number_broker !== currentBroker;
                            if (isProductDifferent || isBrokerDifferent) {
                                updatedProduct = isProductDifferent
                                    ? otherFields.product
                                    : currentProduct;
                                updatedBroker = isBrokerDifferent
                                    ? otherFields.number_broker
                                    : currentBroker;
                                listProducts = ["O", "OC", "OA", "SB", "EP"];
                                siglaProduct = listProducts.includes(updatedProduct)
                                    ? "O"
                                    : updatedProduct;
                                // Mantém o radical e o ano, alterando apenas o prefixo e sufixo
                                grainContract.number_contract = "".concat(siglaProduct, ".").concat(updatedBroker, "-").concat(currentIncrement, "/").concat(currentYear);
                                grainContract.number_broker = updatedBroker;
                                grainContract.product = updatedProduct;
                            }
                        }
                        else {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: "Formato do número do contrato inválido" })];
                        }
                        productToCheck = otherFields.product || grainContract.product;
                        quantityToUse = otherFields.quantity !== undefined
                            ? otherFields.quantity
                            : grainContract.quantity;
                        priceFromRequest = otherFields.price !== undefined
                            ? otherFields.price
                            : grainContract.price;
                        currencyToCheck = otherFields.type_currency || grainContract.type_currency;
                        exchangeRateToCheck = otherFields.day_exchange_rate || grainContract.day_exchange_rate;
                        price = (0, convertPrice_1.convertPrice)(priceFromRequest, currencyToCheck, exchangeRateToCheck);
                        total_contract_value = (0, calculateTotalContractValue_1.calculateTotalContractValue)(productToCheck, quantityToUse, price);
                        updatedGrainContract = __assign(__assign({}, otherFields), { number_contract: grainContract.number_contract, number_broker: grainContract.number_broker, product: grainContract.product, price: priceFromRequest, final_quantity: Number(grainContract.quantity), total_contract_value: total_contract_value, quantity_kg: Number(grainContract.quantity_kg), quantity_bag: Number(grainContract.quantity_bag), commission_contract: Number(grainContract.commission_contract), total_received: Number(grainContract.total_received) });
                        // Recalcula a comissão
                        updatedGrainContract.commission_contract = (0, calcCommission_1.calcCommission)(__assign(__assign({}, grainContract), updatedGrainContract));
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(updatedGrainContract)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, res.json(result)];
                    case 4:
                        error_5 = _a.sent();
                        console.log("erro 500", error_5);
                        return [2 /*return*/, res.status(500).json({ message: error_5.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.deleteGrainContract = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, grainContract, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.findOneBy({ id: id })];
                    case 2:
                        grainContract = _a.sent();
                        if (!grainContract) {
                            return [2 /*return*/, res.status(404).json({ message: "Contrato não encontrado" })];
                        }
                        grainContract = GrainContractRepository_1.grainContractRepository.merge(grainContract, req.body);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(grainContract)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, res.json(result)];
                    case 4:
                        error_6 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_6.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.updateContractAdjustments = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, _a, final_quantity, payment_date, charge_date, expected_receipt_date, internal_communication, status_received, total_received, number_external_contract_buyer, day_exchange_rate, grainContract, updatedFields, type_currency, exchangeRateChanged, finalQuantityChanged, priceConverted, total_contract_value, filteredUpdates, result, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _a = req.body, final_quantity = _a.final_quantity, payment_date = _a.payment_date, charge_date = _a.charge_date, expected_receipt_date = _a.expected_receipt_date, internal_communication = _a.internal_communication, status_received = _a.status_received, total_received = _a.total_received, number_external_contract_buyer = _a.number_external_contract_buyer, day_exchange_rate = _a.day_exchange_rate;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.findOneBy({ id: id })];
                    case 2:
                        grainContract = _b.sent();
                        if (!grainContract) {
                            return [2 /*return*/, res.status(404).json({ message: "Contrato não encontrado." })];
                        }
                        updatedFields = {
                            final_quantity: final_quantity,
                            payment_date: payment_date,
                            charge_date: charge_date,
                            expected_receipt_date: expected_receipt_date,
                            internal_communication: internal_communication,
                            status_received: status_received,
                            total_received: total_received,
                            number_external_contract_buyer: number_external_contract_buyer,
                            day_exchange_rate: day_exchange_rate,
                        };
                        type_currency = req.body.type_currency || grainContract.type_currency;
                        exchangeRateChanged = typeof day_exchange_rate !== "undefined" &&
                            Number(day_exchange_rate) !== Number(grainContract.day_exchange_rate);
                        finalQuantityChanged = typeof final_quantity !== "undefined" &&
                            Number(final_quantity) !== Number(grainContract.quantity);
                        if (finalQuantityChanged ||
                            (type_currency === "Dólar" && exchangeRateChanged)) {
                            priceConverted = (0, convertPrice_1.convertPrice)(grainContract.price, type_currency, day_exchange_rate || grainContract.day_exchange_rate);
                            total_contract_value = (0, calculateTotalContractValue_1.calculateTotalContractValue)(grainContract.product, final_quantity || grainContract.quantity, priceConverted);
                            updatedFields.total_contract_value = total_contract_value;
                        }
                        filteredUpdates = Object.fromEntries(Object.entries(updatedFields).filter(function (_a) {
                            var _ = _a[0], v = _a[1];
                            return v !== undefined;
                        }));
                        // Recalcula a comissão também
                        filteredUpdates.commission_contract = (0, calcCommission_1.calcCommission)(__assign(__assign({}, grainContract), filteredUpdates));
                        GrainContractRepository_1.grainContractRepository.merge(grainContract, filteredUpdates);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(grainContract)];
                    case 3:
                        result = _b.sent();
                        return [2 /*return*/, res.json(result)];
                    case 4:
                        error_7 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_7.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
    }
    return GrainContractController;
}());
exports.GrainContractController = GrainContractController;
//# sourceMappingURL=GrainContractController.js.map