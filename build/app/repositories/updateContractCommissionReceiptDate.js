"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContractCommissionReceiptDate = void 0;
const GrainContractRepository_1 = require("./GrainContractRepository");
async function updateContractCommissionReceiptDate(number_contract, commission_receipt_date) {
    // Busca o contrato pelo número
    const contract = await GrainContractRepository_1.grainContractRepository.findOneBy({ number_contract });
    if (!contract)
        return;
    // Atualiza a data de recebimento da comissão
    contract.commission_receipt_date = commission_receipt_date;
    await GrainContractRepository_1.grainContractRepository.save(contract);
}
exports.updateContractCommissionReceiptDate = updateContractCommissionReceiptDate;
//# sourceMappingURL=updateContractCommissionReceiptDate.js.map