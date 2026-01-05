import { AppDataSource } from "../../database/data-source";
import { Invoice } from "../entities/Invoices";

const repo = AppDataSource.getRepository(Invoice);

export const InvoiceRepository = {
    async create(data: Partial<Invoice>) {
        const invoice = repo.create(data);
        return await repo.save(invoice);
    },

    async findAll() {
        return await repo.find();
    },

    async findById(id: string) {
        return await repo.findOneBy({ id });
    },

    async findByRps_number(rps_number: string) {
        return await repo.findOneBy({ rps_number });
    },

    async findByNfs_number(nfs_number: string) {
        return await repo.findOneBy({ nfs_number });
    },

    async update(id: string, data: Partial<Invoice>) {
        const invoice = await repo.findOneBy({ id });
        if (!invoice) throw new Error("RPS não encontrada");

        Object.assign(invoice, data);
        return await repo.save(invoice);
    },

    async delete(id: string) {
        const invoice = await repo.findOneBy({ id });
        if (!invoice) throw new Error("RPS não encontrada");

        await repo.remove(invoice);
    },

    async nextNumberRps() {
        const result = await repo.query(
            `SELECT MAX(rps_number::BIGINT) AS last_rps FROM invoices`
        );

        const lastRps = result?.[0]?.last_rps ?? 0;
        return Number(lastRps) + 1;
    }
};
