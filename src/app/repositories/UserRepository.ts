import { User } from "../entities/User";
import { AppDataSource } from "../../database/data-source";
// import { FindOptionsWhere } from "typeorm";

export const userRepository = AppDataSource.getRepository(User);

export const getUsers = (): Promise<User[]> => userRepository.find();
