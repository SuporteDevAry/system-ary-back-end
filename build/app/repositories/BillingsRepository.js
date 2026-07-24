"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingRepository = void 0;
const data_source_1 = require("../../database/data-source");
const Billings_1 = require("../entities/Billings");
const repo = data_source_1.AppDataSource.getRepository(Billings_1.Billing);
exports.BillingRepository = {
    async create(data) {
        const billing = repo.create(data);
        return await repo.save(billing);
    },
    async findAll() {
        return await repo.find();
    },
    async findById(id) {
        return await repo.findOneBy({ id });
    },
    async findByNumberContract(number_contract) {
        return await repo.findBy({ number_contract });
    },
    async findByRps_number(rps_number) {
        return await repo.findBy({ rps_number });
    },
    async findByNfs_number(nfs_number) {
        return await repo.findBy({ nfs_number });
    },
    async update(id, data) {
        const billing = await repo.findOneBy({ id });
        if (!billing)
            throw new Error("Recebimento não encontrado");
        Object.assign(billing, data);
        return await repo.save(billing);
    },
    async delete(id) {
        const billing = await repo.findOneBy({ id });
        if (!billing)
            throw new Error("Recebimento não encontrado");
        await repo.remove(billing);
    },
};
//# sourceMappingURL=BillingsRepository.js.map