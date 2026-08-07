import { GrainContractFixationItem } from "../entities/GrainContractFixationItem";
import { AppDataSource } from "../../database/data-source";

export const grainContractFixationItemRepository = AppDataSource.getRepository(
  GrainContractFixationItem
);
