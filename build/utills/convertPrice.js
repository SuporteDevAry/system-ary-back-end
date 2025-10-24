"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPrice = void 0;
function convertPrice(price, typeCurrency, dayExchangeRate) {
    var priceNumber = Number(price);
    if (typeCurrency === "Dólar" && dayExchangeRate) {
        return Number((priceNumber * Number(dayExchangeRate)).toFixed(2));
    }
    return priceNumber;
}
exports.convertPrice = convertPrice;
//# sourceMappingURL=convertPrice.js.map