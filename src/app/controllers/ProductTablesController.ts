import { Request, Response } from "express";
import { ProductTableRepository } from "../repositories/ProductsTablesRepository";

export const ProductTablesController = {
  async createTable(req: Request, res: Response) {
    try {
      const table = await ProductTableRepository.create(req.body);
      return res.status(201).json(table);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar mesa", error });
    }
  },

  async findTablesAll(_: Request, res: Response) {
    try {
      const tables = await ProductTableRepository.findAll();
      return res.json(tables);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar mesas", error });
    }
  },

  async findTableById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const table = await ProductTableRepository.findById(id);
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }
      return res.json(table);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar mesa", error });
    }
  },

  async updateTable(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await ProductTableRepository.update(id, req.body);
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar mesa", error });
    }
  },

  async deleteTable(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProductTableRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar mesa", error });
    }
  },
};
