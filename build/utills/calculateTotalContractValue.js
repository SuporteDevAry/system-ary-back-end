"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalContractValue = void 0;
var convertPrice_1 = require("./convertPrice");
function calculateTotalContractValue(product, quantity, price, typeCurrency, dayExchangeRate, typeQuantity) {
    var isToneladaMetrica = function (value) {
        if (!value)
            return false;
        var quantityType = value
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        return (quantityType === "tm" ||
            quantityType === "toneladas" ||
            quantityType === "tonelada" ||
            quantityType === "toneladas metricas");
    };
    var normalizeNumber = function (value, preferDecimalDot, options) {
        if (typeof value === "number") {
            return Number.isFinite(value) ? value : Number.NaN;
        }
        var raw = String(value).trim();
        if (!raw) {
            return Number.NaN;
        }
        if ((options === null || options === void 0 ? void 0 : options.isQuantity) && isToneladaMetrica(options.typeQuantity)) {
            var hasComma = raw.includes(",");
            var hasDot = raw.includes(".");
            if (hasComma && !hasDot) {
                return Number(raw.replace(/\./g, "").replace(",", "."));
            }
            if (hasDot && !hasComma) {
                var parts = raw.split(".");
                // Mais de um ponto segue o formato brasileiro com separador de milhar.
                if (parts.length > 2) {
                    return Number(raw.replace(/\./g, ""));
                }
                // Um unico ponto vindo do banco para TM representa casas decimais.
                // Ex.: "983.281" = 983 toneladas e 281 kg.
                return Number(raw);
            }
        }
        if (raw.includes(",")) {
            return Number(raw.replace(/\./g, "").replace(",", "."));
        }
        if (raw.includes(".")) {
            return preferDecimalDot ? Number(raw) : Number(raw.replace(/\./g, ""));
        }
        return Number(raw);
    };
    // Quantidade usa ponto como separador de milhares
    var quantityNumber = normalizeNumber(quantity, false, {
        isQuantity: true,
        typeQuantity: typeQuantity,
    });
    // Preco usa ponto como separador decimal
    var priceNumber = normalizeNumber(price, true);
    var normalizedExchangeRate = dayExchangeRate !== undefined && dayExchangeRate !== null
        ? normalizeNumber(dayExchangeRate, true)
        : undefined;
    // Converte o preço se for em Dólar
    var convertedPrice = (0, convertPrice_1.convertPrice)(priceNumber, typeCurrency, normalizedExchangeRate);
    // Determina o divisor baseado no tipo de quantidade
    // Kg (quilos) = divide por 60 (sacas)
    // Tm (toneladas métricas) = divide por 1 (não divide)
    var divisor = 60; // padrão: quilos
    if (typeQuantity) {
        var quantityType = typeQuantity
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        if (quantityType === "tm" ||
            quantityType === "toneladas" ||
            quantityType === "tonelada" ||
            quantityType === "toneladas metricas") {
            divisor = 1;
        }
    }
    // Calcula o valor total:
    // Kg = (Quantity/60) * price
    // Tm = (Quantity/1) * price
    var totalContractValue = (quantityNumber / divisor) * convertedPrice;
    return totalContractValue;
}
exports.calculateTotalContractValue = calculateTotalContractValue;
//# sourceMappingURL=calculateTotalContractValue.js.map