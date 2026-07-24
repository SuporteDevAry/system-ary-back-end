"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const BillingsRepository_1 = require("../repositories/BillingsRepository");
const updateContractCommissionReceiptDate_1 = require("../repositories/updateContractCommissionReceiptDate");
exports.BillingController = {
    async createBilling(req, res) {
        const billing = await BillingsRepository_1.BillingRepository.create(req.body);
        // Atualiza a data de recebimento da comissão do contrato, se houver
        if (billing &&
            billing.number_contract &&
            req.body.commission_receipt_date) {
            await (0, updateContractCommissionReceiptDate_1.updateContractCommissionReceiptDate)(billing.number_contract, req.body.commission_receipt_date);
        }
        return res.status(201).json(billing);
    },
    async findAllBillings(_, res) {
        const billings = await BillingsRepository_1.BillingRepository.findAll();
        return res.json(billings);
    },
    async findBillingById(req, res) {
        const { id } = req.params;
        const billing = await BillingsRepository_1.BillingRepository.findById(id);
        if (!billing)
            return res.status(404).json({ message: "Recebimento não encontrado" });
        return res.json(billing);
    },
    async findBillingByNumberContract(req, res) {
        const { number_contract } = req.params;
        const billings = await BillingsRepository_1.BillingRepository.findByNumberContract(number_contract);
        if (!billings || billings.length === 0)
            return res.status(404).json({
                message: "Nenhum recebimento encontrado para o contrato informado",
            });
        return res.json(billings);
    },
    async findBillingByRps_number(req, res) {
        const { rps_number } = req.params;
        const billing = await BillingsRepository_1.BillingRepository.findByRps_number(rps_number);
        if (!billing)
            return res
                .status(404)
                .json({ message: "Recebimento não encontrado para a RPS" });
        return res.json(billing);
    },
    async findBillingByNfs_number(req, res) {
        const { nfs_number } = req.params;
        const billing = await BillingsRepository_1.BillingRepository.findByNfs_number(nfs_number);
        if (!billing)
            return res
                .status(404)
                .json({ message: "Recebimento não encontrado para a NF" });
        return res.json(billing);
    },
    async findBillingsByNumberContract(req, res) {
        const { number_contract } = req.body;
        if (!number_contract)
            return res
                .status(400)
                .json({ message: "Parâmetro 'number_contract' é obrigatório no body" });
        const billings = await BillingsRepository_1.BillingRepository.findByNumberContract(number_contract);
        return res.json(billings);
    },
    async updateBilling(req, res) {
        const { id } = req.params;
        const updated = await BillingsRepository_1.BillingRepository.update(id, req.body);
        // Atualiza a data de recebimento da comissão do contrato, se houver
        if (updated &&
            updated.number_contract &&
            req.body.commission_receipt_date) {
            await (0, updateContractCommissionReceiptDate_1.updateContractCommissionReceiptDate)(updated.number_contract, req.body.commission_receipt_date);
        }
        return res.json(updated);
    },
    async deleteBilling(req, res) {
        const { id } = req.params;
        await BillingsRepository_1.BillingRepository.delete(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=BillingsController.js.map