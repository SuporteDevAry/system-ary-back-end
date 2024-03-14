import { Clientes } from "../entities/Clientes";
import { AppDataSource } from "../../database/data-source";

export const clientesRepository = AppDataSource.getRepository(Clientes);

export const getClientes = (): Promise<Clientes[]> => clientesRepository.find();