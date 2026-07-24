"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTablesController = void 0;
const ProductsTablesRepository_1 = require("../repositories/ProductsTablesRepository");
exports.ProductTablesController = {
    async createTable(req, res) {
        try {
            const table = await ProductsTablesRepository_1.ProductTableRepository.create(req.body);
            return res.status(201).json(table);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao criar mesa", error });
        }
    },
    async findTablesAll(_, res) {
        try {
            const tables = await ProductsTablesRepository_1.ProductTableRepository.findAll();
            return res.json(tables);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao buscar mesas", error });
        }
    },
    async findTableById(req, res) {
        try {
            const { id } = req.params;
            const table = await ProductsTablesRepository_1.ProductTableRepository.findById(id);
            if (!table) {
                return res.status(404).json({ message: "Mesa não encontrada" });
            }
            return res.json(table);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao buscar mesa", error });
        }
    },
    async updateTable(req, res) {
        try {
            const { id } = req.params;
            const updated = await ProductsTablesRepository_1.ProductTableRepository.update(id, req.body);
            return res.json(updated);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar mesa", error });
        }
    },
    async deleteTable(req, res) {
        try {
            const { id } = req.params;
            await ProductsTablesRepository_1.ProductTableRepository.delete(id);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao deletar mesa", error });
        }
    },
};
//# sourceMappingURL=ProductTablesController.js.map