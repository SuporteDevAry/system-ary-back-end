"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCommission = void 0;
// src/utils/calcCommission.ts
function calcCommission(contract) {
    // Converte o valor total em número
    var totalValue = typeof contract.total_contract_value === "string"
        ? Number(contract.total_contract_value.replace(/[,]/g, "."))
        : Number(contract.total_contract_value);
    var total = Number(totalValue);
    // Decide qual comissão usar: seller tem prioridade, senão buyer
    var commission = contract.commission_seller || contract.commission_buyer || 0;
    var typeCommission = contract.type_commission_seller || contract.type_commission_buyer || "";
    var commissionNumber = Number(typeof commission === "string" ? commission.replace(",", ".") : commission);
    // Calcula a comissão
    var commissionValue = typeCommission === "Percentual"
        ? (total * commissionNumber) / 100
        : commissionNumber; // Surgirá a mudança que a comissao pode ser valor por saca, hoje é só valor cheio.
    return commissionValue;
}
exports.calcCommission = calcCommission;
//# sourceMappingURL=calcCommission.js.map