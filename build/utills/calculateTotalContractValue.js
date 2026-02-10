"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalContractValue = void 0;
var convertPrice_1 = require("./convertPrice");
function calculateTotalContractValue(product, quantity, price, typeCurrency, dayExchangeRate, typeQuantity) {
    var normalizeNumber = function (value, preferDecimalDot) {
        var raw = String(value).trim();
        if (!raw) {
            return Number.NaN;
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
    var quantityNumber = normalizeNumber(quantity, false);
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
        var quantityType = typeQuantity.toLowerCase();
        if (quantityType === "tm" ||
            quantityType === "toneladas" ||
            quantityType === "tonelada" ||
            quantityType === "toneladas métricas") {
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