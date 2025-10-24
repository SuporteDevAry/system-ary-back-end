"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalContractValue = void 0;
function calculateTotalContractValue(product, quantity, price) {
    var validProducts = ["O", "F", "OC", "OA", "SB", "EP"];
    var quantityNumber = Number(quantity);
    var priceNumber = Number(price);
    var quantityTon = validProducts.includes(product)
        ? quantityNumber / 1
        : quantityNumber / 1000;
    var totalContractValue = validProducts.includes(product)
        ? quantityTon * priceNumber
        : (quantityNumber / 60) * priceNumber;
    return totalContractValue;
}
exports.calculateTotalContractValue = calculateTotalContractValue;
//# sourceMappingURL=calculateTotalContractValue.js.map