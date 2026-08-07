import { AppDataSource } from "../../database/data-source";
import { ActiveSession } from "../entities/ActiveSession";

export const activeSessionRepository = AppDataSource.getRepository(ActiveSession);
