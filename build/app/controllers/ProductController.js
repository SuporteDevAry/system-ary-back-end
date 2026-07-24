"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductRepository_1 = require("../repositories/ProductRepository");
exports.ProductController = {
    async createProduct(req, res) {
        const product = await ProductRepository_1.ProductRepository.create(req.body);
        return res.status(201).json(product);
    },
    async findAllProducts(_, res) {
        const products = await ProductRepository_1.ProductRepository.findAll();
        return res.json(products);
    },
    async findProductById(req, res) {
        const { id } = req.params;
        const product = await ProductRepository_1.ProductRepository.findById(id);
        if (!product)
            return res.status(404).json({ message: "Produto não encontrado" });
        return res.json(product);
    },
    async updateProduct(req, res) {
        const { id } = req.params;
        const updated = await ProductRepository_1.ProductRepository.update(id, req.body);
        return res.json(updated);
    },
    async deleteProduct(req, res) {
        const { id } = req.params;
        await ProductRepository_1.ProductRepository.delete(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=ProductController.js.map