import { AppDataSource } from "../../database/data-source";
import { Broker } from "../entities/Broker";

const repo = AppDataSource.getRepository(Broker);

export const BrokerRepository = {
  async create(data: Partial<Broker>) {
    const broker = repo.create(data);
    return await repo.save(broker);
  },

  async findAll() {
    return await repo.find();
  },

  async findById(id: string) {
    return await repo.findOneBy({ id });
  },

  async update(id: string, data: Partial<Broker>) {
    const broker = await repo.findOneBy({ id });
    if (!broker) throw new Error("Broker não encontrado");

    Object.assign(broker, data);
    return await repo.save(broker);
  },

  async delete(id: string) {
    const broker = await repo.findOneBy({ id });
    if (!broker) throw new Error("Broker não encontrado");

    await repo.remove(broker);
  },
};
