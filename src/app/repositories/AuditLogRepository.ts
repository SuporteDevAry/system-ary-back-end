import { AppDataSource } from "../../database/data-source";
import { AuditLog } from "../entities/AuditLog";

export const auditLogRepository = AppDataSource.getRepository(AuditLog);
