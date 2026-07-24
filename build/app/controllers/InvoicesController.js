"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const InvoiceRepository_1 = require("../repositories/InvoiceRepository");
exports.InvoiceController = {
    async createInvoice(req, res) {
        const invoice = await InvoiceRepository_1.InvoiceRepository.create(req.body);
        return res.status(201).json(invoice);
    },
    async findAllInvoices(_, res) {
        const invoices = await InvoiceRepository_1.InvoiceRepository.findAll();
        return res.json(invoices);
    },
    async findInvoiceById(req, res) {
        const { id } = req.params;
        const invoice = await InvoiceRepository_1.InvoiceRepository.findById(id);
        if (!invoice)
            return res.status(404).json({ message: "RPS não encontrada" });
        return res.json(invoice);
    },
    async findInvoiceByRps_number(req, res) {
        const { rps_number } = req.params;
        const invoice = await InvoiceRepository_1.InvoiceRepository.findByRps_number(rps_number);
        if (!invoice)
            return res.status(404).json({ message: "Número de RPS não encontrada" });
        return res.json(invoice);
    },
    async findInvoiceByNfs_number(req, res) {
        const { nfs_number } = req.params;
        const invoice = await InvoiceRepository_1.InvoiceRepository.findByNfs_number(nfs_number);
        if (!invoice)
            return res.status(404).json({ message: "Número de NF não encontrada" });
        return res.json(invoice);
    },
    async updateInvoice(req, res) {
        const { id } = req.params;
        const updated = await InvoiceRepository_1.InvoiceRepository.update(id, req.body);
        return res.json(updated);
    },
    async deleteInvoice(req, res) {
        const { id } = req.params;
        await InvoiceRepository_1.InvoiceRepository.delete(id);
        return res.status(204).send();
    },
    async nextNumberRps(req, res) {
        try {
            const nextNumber = await InvoiceRepository_1.InvoiceRepository.nextNumberRps();
            return res.status(200).json({ nextNumber });
        }
        catch (error) {
            console.error("Erro ao buscar próximo RPS:", error);
            return res.status(500).json({ message: "Erro ao buscar próximo número de RPS" });
        }
    }
};
//# sourceMappingURL=InvoicesController.js.map