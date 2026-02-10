"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPrice = void 0;
function convertPrice(price, typeCurrency, dayExchangeRate) {
    var priceNumber = Number(price);
    if (typeCurrency === "Dólar" && dayExchangeRate) {
        var normalizeRate = function (value) {
            var raw = String(value).trim();
            if (!raw) {
                return Number.NaN;
            }
            if (raw.includes(",")) {
                return Number(raw.replace(/\./g, "").replace(",", "."));
            }
            if (raw.includes(".")) {
                return Number(raw);
            }
            return Number(raw);
        };
        var rateNumber = normalizeRate(dayExchangeRate);
        return Number((priceNumber * rateNumber).toFixed(2));
    }
    return priceNumber;
}
exports.convertPrice = convertPrice;
//# sourceMappingURL=convertPrice.js.map