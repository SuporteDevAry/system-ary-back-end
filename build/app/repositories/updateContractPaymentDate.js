"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContractPaymentDate = void 0;
const GrainContractRepository_1 = require("./GrainContractRepository");
async function updateContractPaymentDate(number_contract, receipt_date) {
    // Busca o contrato pelo número
    const contract = await GrainContractRepository_1.grainContractRepository.findOneBy({ number_contract });
    if (!contract)
        return;
    // Atualiza a data de pagamento
    contract.payment_date = receipt_date;
    await GrainContractRepository_1.grainContractRepository.save(contract);
}
exports.updateContractPaymentDate = updateContractPaymentDate;
//# sourceMappingURL=updateContractPaymentDate.js.map