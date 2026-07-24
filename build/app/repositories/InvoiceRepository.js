"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepository = void 0;
const data_source_1 = require("../../database/data-source");
const Invoices_1 = require("../entities/Invoices");
const repo = data_source_1.AppDataSource.getRepository(Invoices_1.Invoice);
exports.InvoiceRepository = {
    async create(data) {
        const invoice = repo.create(data);
        return await repo.save(invoice);
    },
    async findAll() {
        return await repo.find();
    },
    async findById(id) {
        return await repo.findOneBy({ id });
    },
    async findByRps_number(rps_number) {
        return await repo.findOneBy({ rps_number });
    },
    async findByNfs_number(nfs_number) {
        return await repo.findOneBy({ nfs_number });
    },
    async findByProtocoloLote(protocolo_lote) {
        return await repo.findOneBy({ protocolo_lote });
    },
    async update(id, data) {
        const invoice = await repo.findOneBy({ id });
        if (!invoice)
            throw new Error("RPS não encontrada");
        Object.assign(invoice, data);
        return await repo.save(invoice);
    },
    async delete(id) {
        const invoice = await repo.findOneBy({ id });
        if (!invoice)
            throw new Error("RPS não encontrada");
        await repo.remove(invoice);
    },
    async nextNumberRps() {
        var _a, _b;
        const result = await repo.query(`SELECT MAX(rps_number::BIGINT) AS last_rps FROM invoices`);
        const lastRps = (_b = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.last_rps) !== null && _b !== void 0 ? _b : 0;
        return Number(lastRps) + 1;
    }
};
//# sourceMappingURL=InvoiceRepository.js.map