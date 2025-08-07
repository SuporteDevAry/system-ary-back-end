import { AppDataSource } from "../../database/data-source";
import { Product } from "../entities/Products";

const repo = AppDataSource.getRepository(Product);

export const ProductRepository = {
  async create(data: Partial<Product>) {
    const product = repo.create(data);
    return await repo.save(product);
  },

  async findAll() {
    return await repo.find();
  },

  async findById(id: string) {
    return await repo.findOneBy({ id });
  },

  async update(id: string, data: Partial<Product>) {
    const product = await repo.findOneBy({ id });
    if (!product) throw new Error("Produto não encontrado");

    Object.assign(product, data);
    return await repo.save(product);
  },

  async delete(id: string) {
    const product = await repo.findOneBy({ id });
    if (!product) throw new Error("Produto não encontrado");

    await repo.remove(product);
  },
};
