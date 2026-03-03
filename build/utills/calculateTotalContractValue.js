"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalContractValue = void 0;
var convertPrice_1 = require("./convertPrice");
function calculateTotalContractValue(product, quantity, price, typeCurrency, dayExchangeRate, typeQuantity) {
    var isToneladaMetrica = function (value) {
        if (!value)
            return false;
        var quantityType = value.toLowerCase();
        return (quantityType === "tm" ||
            quantityType === "toneladas" ||
            quantityType === "tonelada" ||
            quantityType === "toneladas métricas");
    };
    var normalizeNumber = function (value, preferDecimalDot, options) {
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
                // Mais de um ponto: tratar como separador de milhar
                if (parts.length > 2) {
                    return Number(raw.replace(/\./g, ""));
                }
                var integerPart = parts[0], _a = parts[1], decimalPart = _a === void 0 ? "" : _a;
                // Caso clássico de milhar em TM: 1.000, 10.000, 100.000
                if (decimalPart === "000") {
                    return Number(raw.replace(/\./g, ""));
                }
                // TM fracionada: 521.170 (521 t e 170 kg), 521.17, 521.1
                return Number("".concat(integerPart, ".").concat(decimalPart));
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