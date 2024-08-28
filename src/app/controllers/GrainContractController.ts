import { Request, Response } from "express";
import {
  generateNumberContract,
  grainContractRepository,
} from "../repositories/GrainContractRepository";

export class GrainContractController {
  getGrainContracts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const grainContracts = await grainContractRepository.find();
      return res.json(grainContracts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getGrainContractById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      const grainContract = await grainContractRepository.findOne({
        where: { id },
      });
      if (!grainContract) {
        return res.status(404).json({ message: "GrainContract not found" });
      }
      return res.json(grainContract);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  createGrainContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const numberContract = await generateNumberContract(req.body);

      const grainContract = grainContractRepository.create({
        ...req.body,
        number_contract: numberContract,
      });

      const result = await grainContractRepository.save(grainContract);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateGrainContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      let grainContract = await grainContractRepository.findOneBy({ id });
      if (!grainContract) {
        return res.status(404).json({ message: "Contrato não encontrado" });
      }
      grainContract = grainContractRepository.merge(grainContract, req.body);
      const result = await grainContractRepository.save(grainContract);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteGrainContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      const result = await grainContractRepository.delete(id);
      if (result.affected === 0) {
        return res.status(404).json({ message: "Contrato não encontrado" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
