import { Contatos } from "../entities/Contatos";
import { AppDataSource } from "../../database/data-source";

export const contatosRepository = AppDataSource.getRepository(Contatos);

export const getContatos = (): Promise<Contatos[]> => contatosRepository.find();