import { AppDataSource } from "../../database/data-source";
import { ProductTable } from "../entities/ProductsTable";

const repo = AppDataSource.getRepository(ProductTable);

export const ProductTableRepository = {
  async create(data: Partial<ProductTable>) {
    const table = repo.create(data);
    return await repo.save(table);
  },

  async findAll() {
    return await repo.find();
  },

  async findById(id: string) {
    return await repo.findOne({
      where: { id },
    });
  },

  async update(id: string, data: Partial<ProductTable>) {
    const table = await repo.findOneBy({ id });
    if (!table) throw new Error("Mesa de produto não encontrada");

    Object.assign(table, data);
    return await repo.save(table);
  },

  async delete(id: string) {
    const table = await repo.findOneBy({ id });
    if (!table) throw new Error("Mesa de produto não encontrada");

    await repo.remove(table);
  },
};
