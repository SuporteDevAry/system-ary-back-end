"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCommission = void 0;
function calcCommission(contract) {
    // Prioridade 1: Verificar se há comissão de vendedor calculada por saca
    if (contract.commission_seller_contract_value !== null &&
        contract.commission_seller_contract_value !== undefined) {
        return Number(contract.commission_seller_contract_value);
    }
    // Prioridade 2: Verificar se há comissão de comprador calculada por saca
    if (contract.commission_buyer_contract_value !== null &&
        contract.commission_buyer_contract_value !== undefined) {
        return Number(contract.commission_buyer_contract_value);
    }
    // Fallback: Cálculo padrão usando a comissão percentual/fixa antiga
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
        : commissionNumber;
    return commissionValue;
}
exports.calcCommission = calcCommission;
//# sourceMappingURL=calcCommission.js.map