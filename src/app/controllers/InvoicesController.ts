import { Request, Response } from "express";
import { InvoiceRepository } from "../repositories/InvoiceRepository";

export const InvoiceController = {
    async createInvoice(req: Request, res: Response) {
        const invoice = await InvoiceRepository.create(req.body);
        return res.status(201).json(invoice);
    },

    async findAllInvoices(_: Request, res: Response) {
        const invoices = await InvoiceRepository.findAll();
        return res.json(invoices);
    },

    async findInvoiceById(req: Request, res: Response) {
        const { id } = req.params;
        const invoice = await InvoiceRepository.findById(id);
        if (!invoice)
            return res.status(404).json({ message: "RPS não encontrada" });
        return res.json(invoice);
    },

    async findInvoiceByRps_number(req: Request, res: Response) {
        const { rps_number } = req.params;
        const invoice = await InvoiceRepository.findByRps_number(rps_number);
        if (!invoice)
            return res.status(404).json({ message: "Número de RPS não encontrada" });
        return res.json(invoice);
    },

    async findInvoiceByNfs_number(req: Request, res: Response) {
        const { nfs_number } = req.params;
        const invoice = await InvoiceRepository.findByNfs_number(nfs_number);
        if (!invoice)
            return res.status(404).json({ message: "Número de NF não encontrada" });
        return res.json(invoice);
    },

    async updateInvoice(req: Request, res: Response) {
        const { id } = req.params;
        const updated = await InvoiceRepository.update(id, req.body);
        return res.json(updated);
    },

    async deleteInvoice(req: Request, res: Response) {
        const { id } = req.params;
        await InvoiceRepository.delete(id);
        return res.status(204).send();
    },

    async nextNumberRps(req: Request, res: Response) {
        try {
            const nextNumber = await InvoiceRepository.nextNumberRps();
            return res.status(200).json({ nextNumber });
        } catch (error) {
            console.error("Erro ao buscar próximo RPS:", error);
            return res.status(500).json({ message: "Erro ao buscar próximo número de RPS" });
        }
    }

};
