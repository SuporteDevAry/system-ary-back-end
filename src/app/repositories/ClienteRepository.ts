import { Cliente } from "../entities/Cliente";
import { AppDataSource } from "../../database/data-source";

export const clienteRepository = AppDataSource.getRepository(Cliente);

export const getClientes = (): Promise<Cliente[]> => clienteRepository.find();