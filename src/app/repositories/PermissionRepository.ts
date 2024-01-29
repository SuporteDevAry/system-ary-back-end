import { Permission } from "../entities/Permission";
import { AppDataSource } from "../../database/data-source";

export const permissionRepository = AppDataSource.getRepository(Permission);
