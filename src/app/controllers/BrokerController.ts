import { Request, Response } from "express";
import { BrokerRepository } from "../repositories/BrokerRepository";

export const BrokerController = {
  async createBroker(req: Request, res: Response) {
    const broker = await BrokerRepository.create(req.body);
    return res.status(201).json(broker);
  },

  async findAllBrokers(_: Request, res: Response) {
    const brokers = await BrokerRepository.findAll();
    return res.json(brokers);
  },

  async findBrokerById(req: Request, res: Response) {
    const { id } = req.params;
    const broker = await BrokerRepository.findById(id);
    if (!broker)
      return res.status(404).json({ message: "Broker não encontrado" });
    return res.json(broker);
  },

  async updateBroker(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await BrokerRepository.update(id, req.body);
    return res.json(updated);
  },

  async deleteBroker(req: Request, res: Response) {
    const { id } = req.params;
    await BrokerRepository.delete(id);
    return res.status(204).send();
  },
};
