"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTableRepository = void 0;
const data_source_1 = require("../../database/data-source");
const ProductsTable_1 = require("../entities/ProductsTable");
const repo = data_source_1.AppDataSource.getRepository(ProductsTable_1.ProductTable);
exports.ProductTableRepository = {
    async create(data) {
        const table = repo.create(data);
        return await repo.save(table);
    },
    async findAll() {
        return await repo.find();
    },
    async findById(id) {
        return await repo.findOne({
            where: { id },
        });
    },
    async update(id, data) {
        const table = await repo.findOneBy({ id });
        if (!table)
            throw new Error("Mesa de produto não encontrada");
        Object.assign(table, data);
        return await repo.save(table);
    },
    async delete(id) {
        const table = await repo.findOneBy({ id });
        if (!table)
            throw new Error("Mesa de produto não encontrada");
        await repo.remove(table);
    },
};
//# sourceMappingURL=ProductsTablesRepository.js.map