import { AppDataSource } from "../../database/data-source";
import { Client } from "../entities/Client";

export const clientRepository = AppDataSource.getRepository(Client);

export const getClients = (): Promise<Client[]> => clientRepository.find();
