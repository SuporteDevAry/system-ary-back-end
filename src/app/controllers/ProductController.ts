import { Request, Response } from "express";
import { ProductRepository } from "../repositories/ProductRepository";

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    const product = await ProductRepository.create(req.body);
    return res.status(201).json(product);
  },

  async findAllProducts(_: Request, res: Response) {
    const products = await ProductRepository.findAll();
    return res.json(products);
  },

  async findProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await ProductRepository.findById(id);
    if (!product)
      return res.status(404).json({ message: "Produto não encontrado" });
    return res.json(product);
  },

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await ProductRepository.update(id, req.body);
    return res.json(updated);
  },

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    await ProductRepository.delete(id);
    return res.status(204).send();
  },
};
