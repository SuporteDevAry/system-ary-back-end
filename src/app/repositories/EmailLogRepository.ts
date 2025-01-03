import { AppDataSource } from "../../database/data-source";
import { EmailLog } from "../entities/EmailLog";

export const EmailLogRepository = AppDataSource.getRepository(EmailLog);
