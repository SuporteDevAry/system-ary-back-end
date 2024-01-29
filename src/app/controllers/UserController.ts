import { Request, Response } from "express";
import { getUsers, userRepository } from "../repositories/UserRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import { FindOptionsWhere } from "typeorm";
import { User } from "../entities/User";
import { permissionRepository } from "../repositories/PermissionRepository";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      throw new BadRequestError("E-mail já existe");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newPermissions = permissionRepository.create();

    await permissionRepository.save(newPermissions);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
      permissions_id: newPermissions.id,
    });

    await userRepository.save(newUser);

    const { password: _, ...user } = newUser;

    return res.status(201).json(user);
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async getUsers(req: Request, res: Response) {
    const users = await getUsers();

    users.map((i) => delete i.password);

    return res.status(200).json(users);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("E-mail já existe");
    }

    const userSearched = await userRepository.findOneBy({ id });

    if (!userSearched) {
      throw new BadRequestError("Usuário pesquisado não existe!");
    }

    const { password: _, ...user } = userSearched;

    return res.status(200).json(user);
  }

 
}
