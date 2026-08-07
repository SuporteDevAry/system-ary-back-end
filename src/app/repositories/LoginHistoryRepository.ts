import { AppDataSource } from "../../database/data-source";
import { LoginHistory } from "../entities/LoginHistory";

export const loginHistoryRepository = AppDataSource.getRepository(LoginHistory);
