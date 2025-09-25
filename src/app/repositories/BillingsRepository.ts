import { AppDataSource } from "../../database/data-source";
import { Billing } from "../entities/Billings";

const repo = AppDataSource.getRepository(Billing);

export const BillingRepository = {
    async create(data: Partial<Billing>) {
        const billing = repo.create(data);
        return await repo.save(billing);
    },

    async findAll() {
        return await repo.find();
    },

    async findById(id: string) {
        return await repo.findOneBy({ id });
    },

    async findByNumberContract(number_contract: string) {
        return await repo.findOneBy({ number_contract });
    },

    async findByRps_number(rps_number: string) {
        return await repo.findOneBy({ rps_number });
    },

    async findByNfs_number(nfs_number: string) {
        return await repo.findOneBy({ nfs_number });
    },

    async update(id: string, data: Partial<Billing>) {
        const billing = await repo.findOneBy({ id });
        if (!billing) throw new Error("Recebimento não encontrado");

        Object.assign(billing, data);
        return await repo.save(billing);
    },

    async delete(id: string) {
        const billing = await repo.findOneBy({ id });
        if (!billing) throw new Error("Recebimento não encontrado");

        await repo.remove(billing);
    },

};
