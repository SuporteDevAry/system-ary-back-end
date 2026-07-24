"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const data_source_1 = require("../../database/data-source");
const Products_1 = require("../entities/Products");
const repo = data_source_1.AppDataSource.getRepository(Products_1.Product);
exports.ProductRepository = {
    async create(data) {
        const product = repo.create(data);
        return await repo.save(product);
    },
    async findAll() {
        return await repo.find();
    },
    async findById(id) {
        return await repo.findOneBy({ id });
    },
    async update(id, data) {
        const product = await repo.findOneBy({ id });
        if (!product)
            throw new Error("Produto não encontrado");
        Object.assign(product, data);
        return await repo.save(product);
    },
    async delete(id) {
        const product = await repo.findOneBy({ id });
        if (!product)
            throw new Error("Produto não encontrado");
        await repo.remove(product);
    },
};
//# sourceMappingURL=ProductRepository.js.map