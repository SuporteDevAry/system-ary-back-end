import { AppDataSource } from "../../database/data-source";
import { Contact } from "../entities/Contact";

export const contactRepository = AppDataSource.getRepository(Contact);
