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
var calcCommissionBySack_1 = require("../../utills/calcCommissionBySack");
function isZeroLikeValue(value) {
    if (value === null || value === undefined)
        return false;
    var raw = String(value).trim();
    if (!raw)
        return false;
    var onlyDigits = raw.replace(/\D/g, "");
    return onlyDigits.length > 0 && Number(onlyDigits) === 0;
}
function resolveQuantityForFinancialCalc(finalQuantity, quantity) {
    if (finalQuantity === null ||
        finalQuantity === undefined ||
        isZeroLikeValue(finalQuantity)) {
        return quantity;
    }
    return finalQuantity;
}
var GrainContractController = /** @class */ (function () {
    function GrainContractController() {
        var _this = this;
        this.getReport = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, seller, buyer, year, month, date, date_start, date_end, product, name_product, page, per_page, qb, sellers, conds_1, params_1, buyers, conds_2, params_2, contractEmissionDateAsDate, parseDateToIso, hasDateRange, parsedStartDate, parsedEndDate, parsedDate, y, m, pageProvided, perPageProvided, data, total, pageNum, perPage, offset, error_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = req.query, seller = _a.seller, buyer = _a.buyer, year = _a.year, month = _a.month, date = _a.date, date_start = _a.date_start, date_end = _a.date_end, product = _a.product, name_product = _a.name_product, page = _a.page, per_page = _a.per_page;
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
                        contractEmissionDateAsDate = "(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END)";
                        parseDateToIso = function (value) {
                            var normalizedValue = value.trim();
                            var brMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(normalizedValue);
                            var isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue);
                            if (brMatch) {
                                var _a = normalizedValue.split("/"), day = _a[0], monthPart = _a[1], yearPart = _a[2];
                                return "".concat(yearPart, "-").concat(monthPart, "-").concat(day);
                            }
                            if (isoMatch) {
                                return normalizedValue;
                            }
                            var parsedDate = new Date(normalizedValue);
                            if (!Number.isNaN(parsedDate.getTime())) {
                                return parsedDate.toISOString().slice(0, 10);
                            }
                            return null;
                        };
                        hasDateRange = (typeof date_start !== "undefined" &&
                            String(date_start).trim() !== "") ||
                            (typeof date_end !== "undefined" && String(date_end).trim() !== "");
                        if (hasDateRange) {
                            parsedStartDate = typeof date_start !== "undefined" && String(date_start).trim() !== ""
                                ? parseDateToIso(String(date_start))
                                : null;
                            parsedEndDate = typeof date_end !== "undefined" && String(date_end).trim() !== ""
                                ? parseDateToIso(String(date_end))
                                : null;
                            if (parsedStartDate) {
                                qb.andWhere("".concat(contractEmissionDateAsDate, " >= to_date(:dateStart, 'YYYY-MM-DD')"), { dateStart: parsedStartDate });
                            }
                            if (parsedEndDate) {
                                qb.andWhere("".concat(contractEmissionDateAsDate, " <= to_date(:dateEnd, 'YYYY-MM-DD')"), { dateEnd: parsedEndDate });
                            }
                        }
                        else if (date) {
                            parsedDate = parseDateToIso(String(date));
                            if (parsedDate) {
                                qb.andWhere("".concat(contractEmissionDateAsDate, " = to_date(:createdDate, 'YYYY-MM-DD')"), {
                                    createdDate: parsedDate,
                                });
                            }
                        }
                        else {
                            // Compatibilidade antiga: filtrar por ano/mês quando não houver date_start/date_end/date
                            if (year) {
                                y = Number(year);
                                if (!Number.isNaN(y)) {
                                    qb.andWhere("EXTRACT(YEAR FROM ".concat(contractEmissionDateAsDate, ") = :year"), {
                                        year: y,
                                    });
                                }
                            }
                            if (month) {
                                m = Number(month);
                                if (!Number.isNaN(m)) {
                                    qb.andWhere("EXTRACT(MONTH FROM ".concat(contractEmissionDateAsDate, ") = :month"), {
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
                        _b = _d.sent(), data = _b[0], total = _b[1];
                        return [2 /*return*/, res.json({ data: data, total: total, page: pageNum, per_page: perPage })];
                    case 2: return [4 /*yield*/, qb
                            .orderBy("(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS timestamp) END)", "DESC")
                            .getManyAndCount()];
                    case 3:
                        // Sem paginação: retornar todos os resultados
                        _c = _d.sent(), data = _c[0], total = _c[1];
                        return [2 /*return*/, res.json({ data: data, total: total })];
                    case 4:
                        error_1 = _d.sent();
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
            var numberContract, initialFinalQuantity, total_contract_value, dataWithConvertedPrice, commissionValue, commissionSellerContract, commissionBuyerContract, sellerCurrency, sellerRate, buyerCurrency, buyerRate, finalCommissionContract, grainContract, result, dateStr, match, dateIso, createdAt, hourStr, minStr, secStr, msStr, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, (0, GrainContractRepository_1.generateNumberContract)(req.body)];
                    case 1:
                        numberContract = _a.sent();
                        initialFinalQuantity = resolveQuantityForFinancialCalc(req.body.final_quantity, req.body.quantity);
                        total_contract_value = (0, calculateTotalContractValue_1.calculateTotalContractValue)(req.body.product, req.body.quantity, req.body.price, req.body.type_currency, req.body.day_exchange_rate, req.body.type_quantity);
                        dataWithConvertedPrice = __assign(__assign({}, req.body), { total_contract_value: total_contract_value, type_commission_seller_currency: req.body.type_commission_seller === "Percentual"
                                ? null
                                : req.body.type_commission_seller_currency, type_commission_buyer_currency: req.body.type_commission_buyer === "Percentual"
                                ? null
                                : req.body.type_commission_buyer_currency });
                        commissionValue = (0, calcCommission_1.calcCommission)(dataWithConvertedPrice);
                        commissionSellerContract = null;
                        commissionBuyerContract = null;
                        if (req.body.commission_seller) {
                            sellerCurrency = (req.body.type_commission_seller === "Percentual"
                                ? ""
                                : req.body.type_commission_seller_currency) ||
                                (req.body.type_currency === "Dólar" ||
                                    req.body.type_currency === "USD" ||
                                    req.body.type_currency === "US$"
                                    ? "Dólar"
                                    : "BRL");
                            sellerRate = req.body.commission_seller_exchange_rate ||
                                (sellerCurrency === "Dólar" ||
                                    sellerCurrency === "USD" ||
                                    sellerCurrency === "US$"
                                    ? req.body.day_exchange_rate
                                    : undefined);
                            commissionSellerContract = (0, calcCommissionBySack_1.calcCommissionBySack)(req.body.quantity, req.body.type_quantity, req.body.commission_seller, req.body.type_commission_seller, sellerCurrency, sellerRate, total_contract_value);
                            // Arredonda para 2 casas decimais
                            commissionSellerContract =
                                Math.round(commissionSellerContract * 100) / 100;
                        }
                        if (req.body.commission_buyer) {
                            buyerCurrency = (req.body.type_commission_buyer === "Percentual"
                                ? ""
                                : req.body.type_commission_buyer_currency) ||
                                (req.body.type_currency === "Dólar" ||
                                    req.body.type_currency === "USD" ||
                                    req.body.type_currency === "US$"
                                    ? "Dólar"
                                    : "BRL");
                            buyerRate = req.body.commission_buyer_exchange_rate ||
                                (buyerCurrency === "Dólar" ||
                                    buyerCurrency === "USD" ||
                                    buyerCurrency === "US$"
                                    ? req.body.day_exchange_rate
                                    : undefined);
                            commissionBuyerContract = (0, calcCommissionBySack_1.calcCommissionBySack)(req.body.quantity, req.body.type_quantity, req.body.commission_buyer, req.body.type_commission_buyer, buyerCurrency, buyerRate, total_contract_value);
                            // Arredonda para 2 casas decimais
                            commissionBuyerContract =
                                Math.round(commissionBuyerContract * 100) / 100;
                        }
                        finalCommissionContract = commissionValue;
                        if (commissionSellerContract !== null &&
                            commissionBuyerContract !== null) {
                            // Quando há comissão de ambos, deixar null
                            finalCommissionContract = null;
                        }
                        else if (commissionSellerContract !== null) {
                            finalCommissionContract = commissionSellerContract;
                        }
                        else if (commissionBuyerContract !== null) {
                            finalCommissionContract = commissionBuyerContract;
                        }
                        grainContract = GrainContractRepository_1.grainContractRepository.create(__assign(__assign({}, dataWithConvertedPrice), { number_contract: numberContract, final_quantity: initialFinalQuantity, status_received: "Não", commission_contract: finalCommissionContract, commission_seller_contract_value: commissionSellerContract, commission_buyer_contract_value: commissionBuyerContract }));
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(grainContract)];
                    case 2:
                        result = (_a.sent());
                        if (!(isZeroLikeValue(result.final_quantity) &&
                            !isZeroLikeValue(result.quantity))) return [3 /*break*/, 4];
                        result.final_quantity = result.quantity;
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(result)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(result.contract_emission_date && result.created_at)) return [3 /*break*/, 6];
                        dateStr = result.contract_emission_date;
                        match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                        dateIso = "";
                        if (match) {
                            dateIso = "".concat(match[3], "-").concat(match[2], "-").concat(match[1]);
                        }
                        else {
                            dateIso = dateStr;
                        }
                        createdAt = new Date(result.created_at);
                        hourStr = createdAt.getHours().toString().padStart(2, "0");
                        minStr = createdAt.getMinutes().toString().padStart(2, "0");
                        secStr = createdAt.getSeconds().toString().padStart(2, "0");
                        msStr = createdAt.getMilliseconds().toString().padStart(3, "0");
                        result.contract_emission_datetime = new Date("".concat(dateIso, "T").concat(hourStr, ":").concat(minStr, ":").concat(secStr, ".").concat(msStr));
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(result)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, res.status(201).json(result)];
                    case 7:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ message: error_4.message })];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.updateGrainContract = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, otherFields, grainContract, validNumberContract, match, currentProduct, currentBroker, currentIncrement, currentYear, isProductDifferent, isBrokerDifferent, updatedProduct, updatedBroker, listProducts, siglaProduct, productToCheck, quantityToUse, finalQuantityToUse, quantityForFinancialCalc, priceFromRequest, currencyToCheck, exchangeRateToCheck, typeQuantityToCheck, total_contract_value, updatedGrainContract, hasOwn_1, sellerCurrencyFieldWasSent, buyerCurrencyFieldWasSent, sellerCommissionEdited, buyerCommissionEdited, mergedData, sellerCurrency, sellerRate, buyerCurrency, buyerRate, sellerComm, buyerComm, result, error_5;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = req.params.id;
                        otherFields = __rest(req.body, []);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.findOneBy({ id: id })];
                    case 2:
                        grainContract = _c.sent();
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
                        finalQuantityToUse = otherFields.final_quantity !== undefined
                            ? otherFields.final_quantity
                            : grainContract.final_quantity;
                        quantityForFinancialCalc = resolveQuantityForFinancialCalc(finalQuantityToUse, quantityToUse);
                        priceFromRequest = otherFields.price !== undefined
                            ? otherFields.price
                            : grainContract.price;
                        currencyToCheck = otherFields.type_currency || grainContract.type_currency;
                        exchangeRateToCheck = otherFields.day_exchange_rate || grainContract.day_exchange_rate;
                        typeQuantityToCheck = otherFields.type_quantity || grainContract.type_quantity;
                        total_contract_value = (0, calculateTotalContractValue_1.calculateTotalContractValue)(productToCheck, quantityForFinancialCalc, priceFromRequest, currencyToCheck, exchangeRateToCheck, typeQuantityToCheck);
                        updatedGrainContract = __assign(__assign({}, otherFields), { number_contract: grainContract.number_contract, number_broker: grainContract.number_broker, product: grainContract.product, price: priceFromRequest, final_quantity: otherFields.final_quantity !== undefined
                                ? resolveQuantityForFinancialCalc(otherFields.final_quantity, quantityToUse)
                                : grainContract.final_quantity, total_contract_value: total_contract_value, type_quantity: typeQuantityToCheck, quantity_kg: Number(grainContract.quantity_kg), quantity_bag: Number(grainContract.quantity_bag), commission_contract: Number(grainContract.commission_contract), commission_seller_contract_value: grainContract.commission_seller_contract_value, commission_buyer_contract_value: grainContract.commission_buyer_contract_value, total_received: Number(grainContract.total_received) });
                        hasOwn_1 = Object.prototype.hasOwnProperty;
                        sellerCurrencyFieldWasSent = hasOwn_1.call(otherFields, "type_commission_seller_currency");
                        buyerCurrencyFieldWasSent = hasOwn_1.call(otherFields, "type_commission_buyer_currency");
                        sellerCommissionEdited = [
                            "commission_seller",
                            "type_commission_seller",
                            "commission_seller_exchange_rate",
                        ].some(function (field) { return hasOwn_1.call(otherFields, field); });
                        buyerCommissionEdited = [
                            "commission_buyer",
                            "type_commission_buyer",
                            "commission_buyer_exchange_rate",
                        ].some(function (field) { return hasOwn_1.call(otherFields, field); });
                        if (sellerCurrencyFieldWasSent &&
                            (otherFields.type_commission_seller_currency === "" ||
                                otherFields.type_commission_seller_currency === null)) {
                            updatedGrainContract.type_commission_seller_currency = null;
                        }
                        else if (sellerCommissionEdited && !sellerCurrencyFieldWasSent) {
                            updatedGrainContract.type_commission_seller_currency = null;
                        }
                        if (buyerCurrencyFieldWasSent &&
                            (otherFields.type_commission_buyer_currency === "" ||
                                otherFields.type_commission_buyer_currency === null)) {
                            updatedGrainContract.type_commission_buyer_currency = null;
                        }
                        else if (buyerCommissionEdited && !buyerCurrencyFieldWasSent) {
                            updatedGrainContract.type_commission_buyer_currency = null;
                        }
                        mergedData = __assign(__assign({}, grainContract), updatedGrainContract);
                        if (mergedData.type_commission_seller === "Percentual") {
                            updatedGrainContract.type_commission_seller_currency = null;
                        }
                        if (mergedData.type_commission_buyer === "Percentual") {
                            updatedGrainContract.type_commission_buyer_currency = null;
                        }
                        if (mergedData.commission_seller) {
                            sellerCurrency = mergedData.type_commission_seller_currency ||
                                (mergedData.type_currency === "Dólar" ||
                                    mergedData.type_currency === "USD" ||
                                    mergedData.type_currency === "US$"
                                    ? "Dólar"
                                    : "BRL");
                            sellerRate = mergedData.commission_seller_exchange_rate ||
                                (sellerCurrency === "Dólar" ||
                                    sellerCurrency === "USD" ||
                                    sellerCurrency === "US$"
                                    ? mergedData.day_exchange_rate
                                    : undefined);
                            updatedGrainContract.commission_seller_contract_value =
                                (0, calcCommissionBySack_1.calcCommissionBySack)(resolveQuantityForFinancialCalc(mergedData.final_quantity, mergedData.quantity), mergedData.type_quantity, mergedData.commission_seller, mergedData.type_commission_seller, sellerCurrency, sellerRate, total_contract_value);
                            // Arredonda para 2 casas decimais
                            updatedGrainContract.commission_seller_contract_value =
                                Math.round(updatedGrainContract.commission_seller_contract_value * 100) / 100;
                        }
                        if (mergedData.commission_buyer) {
                            buyerCurrency = mergedData.type_commission_buyer_currency ||
                                (mergedData.type_currency === "Dólar" ||
                                    mergedData.type_currency === "USD" ||
                                    mergedData.type_currency === "US$"
                                    ? "Dólar"
                                    : "BRL");
                            buyerRate = mergedData.commission_buyer_exchange_rate ||
                                (buyerCurrency === "Dólar" ||
                                    buyerCurrency === "USD" ||
                                    buyerCurrency === "US$"
                                    ? mergedData.day_exchange_rate
                                    : undefined);
                            updatedGrainContract.commission_buyer_contract_value =
                                (0, calcCommissionBySack_1.calcCommissionBySack)(resolveQuantityForFinancialCalc(mergedData.final_quantity, mergedData.quantity), mergedData.type_quantity, mergedData.commission_buyer, mergedData.type_commission_buyer, buyerCurrency, buyerRate, total_contract_value);
                            // Arredonda para 2 casas decimais
                            updatedGrainContract.commission_buyer_contract_value =
                                Math.round(updatedGrainContract.commission_buyer_contract_value * 100) / 100;
                        }
                        sellerComm = (_a = updatedGrainContract.commission_seller_contract_value) !== null && _a !== void 0 ? _a : mergedData.commission_seller_contract_value;
                        buyerComm = (_b = updatedGrainContract.commission_buyer_contract_value) !== null && _b !== void 0 ? _b : mergedData.commission_buyer_contract_value;
                        if (sellerComm !== null &&
                            sellerComm !== undefined &&
                            buyerComm !== null &&
                            buyerComm !== undefined) {
                            // Quando há comissão de ambos, deixar null
                            updatedGrainContract.commission_contract = null;
                        }
                        else if (sellerComm !== null && sellerComm !== undefined) {
                            updatedGrainContract.commission_contract = sellerComm;
                        }
                        else if (buyerComm !== null && buyerComm !== undefined) {
                            updatedGrainContract.commission_contract = buyerComm;
                        }
                        else {
                            // Se nenhum existir, manter o cálculo padrão
                            updatedGrainContract.commission_contract = (0, calcCommission_1.calcCommission)(__assign(__assign({}, grainContract), updatedGrainContract));
                        }
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(updatedGrainContract)];
                    case 3:
                        result = _c.sent();
                        return [2 /*return*/, res.json(result)];
                    case 4:
                        error_5 = _c.sent();
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
            var id, grainContract, hasOwn_2, allowedPatchFields, updatedFields_1, finalQuantityWasSent, type_currency, currentFinalQuantity, nextDayExchangeRate, exchangeRateChanged, finalQuantityChanged, hasCommissionConfigured, shouldRecalculateDerivedFields, finalQuantityForCalc, exchangeRateForCalc, total_contract_value, filteredUpdates, mergedData, sellerCurrency, sellerRate, buyerCurrency, buyerRate, sellerComm, buyerComm, result, error_7;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        id = req.params.id;
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.findOneBy({ id: id })];
                    case 2:
                        grainContract = _j.sent();
                        if (!grainContract) {
                            return [2 /*return*/, res.status(404).json({ message: "Contrato não encontrado." })];
                        }
                        hasOwn_2 = Object.prototype.hasOwnProperty;
                        allowedPatchFields = [
                            "final_quantity",
                            "payment_date",
                            "charge_date",
                            "expected_receipt_date",
                            "internal_communication",
                            "status_received",
                            "total_received",
                            "number_external_contract_buyer",
                            "day_exchange_rate",
                        ];
                        updatedFields_1 = {};
                        allowedPatchFields.forEach(function (field) {
                            if (hasOwn_2.call(req.body, field) && req.body[field] !== undefined) {
                                updatedFields_1[field] = req.body[field];
                            }
                        });
                        finalQuantityWasSent = hasOwn_2.call(req.body, "final_quantity") &&
                            req.body.final_quantity !== undefined;
                        if (finalQuantityWasSent) {
                            updatedFields_1.final_quantity = resolveQuantityForFinancialCalc(req.body.final_quantity, grainContract.quantity);
                        }
                        type_currency = req.body.type_currency || grainContract.type_currency;
                        currentFinalQuantity = grainContract.final_quantity;
                        nextDayExchangeRate = (_a = updatedFields_1.day_exchange_rate) !== null && _a !== void 0 ? _a : grainContract.day_exchange_rate;
                        exchangeRateChanged = hasOwn_2.call(updatedFields_1, "day_exchange_rate") &&
                            Number(nextDayExchangeRate) !== Number(grainContract.day_exchange_rate);
                        finalQuantityChanged = finalQuantityWasSent &&
                            Number(updatedFields_1.final_quantity) !== Number(currentFinalQuantity);
                        hasCommissionConfigured = !!grainContract.commission_seller || !!grainContract.commission_buyer;
                        shouldRecalculateDerivedFields = finalQuantityWasSent ||
                            finalQuantityChanged ||
                            hasCommissionConfigured ||
                            ((type_currency === "Dólar" ||
                                type_currency === "USD" ||
                                type_currency === "US$") &&
                                exchangeRateChanged);
                        if (shouldRecalculateDerivedFields) {
                            finalQuantityForCalc = finalQuantityWasSent
                                ? resolveQuantityForFinancialCalc(updatedFields_1.final_quantity, grainContract.quantity)
                                : resolveQuantityForFinancialCalc(grainContract.final_quantity, grainContract.quantity);
                            exchangeRateForCalc = (_b = updatedFields_1.day_exchange_rate) !== null && _b !== void 0 ? _b : grainContract.day_exchange_rate;
                            // Recalcula o preço convertido se necessário
                            (0, convertPrice_1.convertPrice)(grainContract.price, type_currency, exchangeRateForCalc);
                            if (finalQuantityForCalc !== null &&
                                typeof finalQuantityForCalc !== "undefined") {
                                total_contract_value = (0, calculateTotalContractValue_1.calculateTotalContractValue)(grainContract.product, finalQuantityForCalc, grainContract.price, type_currency, exchangeRateForCalc, grainContract.type_quantity);
                                updatedFields_1.total_contract_value = total_contract_value;
                            }
                        }
                        filteredUpdates = Object.fromEntries(Object.entries(updatedFields_1).filter(function (_a) {
                            var _ = _a[0], v = _a[1];
                            return v !== undefined;
                        }));
                        if (shouldRecalculateDerivedFields) {
                            mergedData = __assign(__assign({}, grainContract), filteredUpdates);
                            if (mergedData.type_commission_seller === "Percentual") {
                                filteredUpdates.type_commission_seller_currency = null;
                            }
                            if (mergedData.type_commission_buyer === "Percentual") {
                                filteredUpdates.type_commission_buyer_currency = null;
                            }
                            if (mergedData.commission_seller) {
                                sellerCurrency = mergedData.type_commission_seller_currency ||
                                    (mergedData.type_currency === "Dólar" ||
                                        mergedData.type_currency === "USD" ||
                                        mergedData.type_currency === "US$"
                                        ? "Dólar"
                                        : "BRL");
                                sellerRate = (_c = mergedData.commission_seller_exchange_rate) !== null && _c !== void 0 ? _c : (sellerCurrency === "Dólar" ||
                                    sellerCurrency === "USD" ||
                                    sellerCurrency === "US$"
                                    ? mergedData.day_exchange_rate
                                    : undefined);
                                filteredUpdates.commission_seller_contract_value =
                                    (0, calcCommissionBySack_1.calcCommissionBySack)(resolveQuantityForFinancialCalc(mergedData.final_quantity, mergedData.quantity), mergedData.type_quantity, mergedData.commission_seller, mergedData.type_commission_seller, sellerCurrency, sellerRate, (_d = updatedFields_1.total_contract_value) !== null && _d !== void 0 ? _d : grainContract.total_contract_value);
                                // Arredonda para 2 casas decimais
                                filteredUpdates.commission_seller_contract_value =
                                    Math.round(filteredUpdates.commission_seller_contract_value * 100) /
                                        100;
                            }
                            if (mergedData.commission_buyer) {
                                buyerCurrency = mergedData.type_commission_buyer_currency ||
                                    (mergedData.type_currency === "Dólar" ||
                                        mergedData.type_currency === "USD" ||
                                        mergedData.type_currency === "US$"
                                        ? "Dólar"
                                        : "BRL");
                                buyerRate = (_e = mergedData.commission_buyer_exchange_rate) !== null && _e !== void 0 ? _e : (buyerCurrency === "Dólar" ||
                                    buyerCurrency === "USD" ||
                                    buyerCurrency === "US$"
                                    ? mergedData.day_exchange_rate
                                    : undefined);
                                filteredUpdates.commission_buyer_contract_value =
                                    (0, calcCommissionBySack_1.calcCommissionBySack)(resolveQuantityForFinancialCalc(mergedData.final_quantity, mergedData.quantity), mergedData.type_quantity, mergedData.commission_buyer, mergedData.type_commission_buyer, buyerCurrency, buyerRate, (_f = updatedFields_1.total_contract_value) !== null && _f !== void 0 ? _f : grainContract.total_contract_value);
                                // Arredonda para 2 casas decimais
                                filteredUpdates.commission_buyer_contract_value =
                                    Math.round(filteredUpdates.commission_buyer_contract_value * 100) /
                                        100;
                            }
                            sellerComm = (_g = filteredUpdates.commission_seller_contract_value) !== null && _g !== void 0 ? _g : mergedData.commission_seller_contract_value;
                            buyerComm = (_h = filteredUpdates.commission_buyer_contract_value) !== null && _h !== void 0 ? _h : mergedData.commission_buyer_contract_value;
                            if (sellerComm !== null &&
                                sellerComm !== undefined &&
                                buyerComm !== null &&
                                buyerComm !== undefined) {
                                // Quando há comissão de ambos, deixar null
                                filteredUpdates.commission_contract = null;
                            }
                            else if (sellerComm !== null && sellerComm !== undefined) {
                                filteredUpdates.commission_contract = sellerComm;
                            }
                            else if (buyerComm !== null && buyerComm !== undefined) {
                                filteredUpdates.commission_contract = buyerComm;
                            }
                            else {
                                // Se nenhum existir, manter o cálculo padrão
                                filteredUpdates.commission_contract = (0, calcCommission_1.calcCommission)(__assign(__assign({}, grainContract), filteredUpdates));
                            }
                        }
                        GrainContractRepository_1.grainContractRepository.merge(grainContract, filteredUpdates);
                        return [4 /*yield*/, GrainContractRepository_1.grainContractRepository.save(grainContract)];
                    case 3:
                        result = _j.sent();
                        return [2 /*return*/, res.json(result)];
                    case 4:
                        error_7 = _j.sent();
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