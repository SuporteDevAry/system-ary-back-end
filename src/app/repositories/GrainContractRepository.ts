import { GrainContract } from "../entities/GrainContracts";
import { AppDataSource } from "../../database/data-source";

export const grainContractRepository =
  AppDataSource.getRepository(GrainContract);
