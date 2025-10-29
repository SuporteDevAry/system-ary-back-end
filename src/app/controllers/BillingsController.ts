import { Request, Response } from "express";
import { BillingRepository } from "../repositories/BillingsRepository";

export const BillingController = {
  async createBilling(req: Request, res: Response) {
    const billing = await BillingRepository.create(req.body);
    return res.status(201).json(billing);
  },

  async findAllBillings(_: Request, res: Response) {
    const billings = await BillingRepository.findAll();
    return res.json(billings);
  },

  async findBillingById(req: Request, res: Response) {
    const { id } = req.params;
    const billing = await BillingRepository.findById(id);
    if (!billing)
      return res.status(404).json({ message: "Recebimento não encontrado" });
    return res.json(billing);
  },

  async findBillingByNumberContract(req: Request, res: Response) {
    const { number_contract } = req.params;

    const billings = await BillingRepository.findByNumberContract(
      number_contract
    );
    if (!billings || billings.length === 0)
      return res.status(404).json({
        message: "Nenhum recebimento encontrado para o contrato informado",
      });
    return res.json(billings);
  },

  async findBillingByRps_number(req: Request, res: Response) {
    const { rps_number } = req.params;
    const billing = await BillingRepository.findByRps_number(rps_number);
    if (!billing)
      return res
        .status(404)
        .json({ message: "Recebimento não encontrado para a RPS" });
    return res.json(billing);
  },

  async findBillingByNfs_number(req: Request, res: Response) {
    const { nfs_number } = req.params;
    const billing = await BillingRepository.findByNfs_number(nfs_number);
    if (!billing)
      return res
        .status(404)
        .json({ message: "Recebimento não encontrado para a NF" });
    return res.json(billing);
  },

  async findBillingsByNumberContract(req: Request, res: Response) {
    const { number_contract } = req.body;

    if (!number_contract)
      return res
        .status(400)
        .json({ message: "Parâmetro 'number_contract' é obrigatório no body" });

    const billings = await BillingRepository.findByNumberContract(
      number_contract
    );
    return res.json(billings);
  },

  async updateBilling(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await BillingRepository.update(id, req.body);
    return res.json(updated);
  },

  async deleteBilling(req: Request, res: Response) {
    const { id } = req.params;
    await BillingRepository.delete(id);
    return res.status(204).send();
  },
};
