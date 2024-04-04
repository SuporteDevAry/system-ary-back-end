import { Request, Response } from "express";
import { getUsers, userRepository } from "../repositories/UserRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import { permissionRepository } from "../repositories/PermissionRepository";

export class UserController {
  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async getPermissionsByEmail(req: Request, res: Response) {
    const { email } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const permissions = await permissionRepository.findOneBy({
      id: user.permissions_id,
    });

    if (!permissions) {
      throw new NotFoundError("Permissões não encontradas");
    }

    return res.json(permissions);
  }

  async getUsers(req: Request, res: Response) {
    const users = await getUsers();

    users.map((i) => delete i.password);

    if (!users) {
      throw new BadRequestError("Usuário pesquisado não existe!");
    }

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

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!id) {
      throw new BadRequestError("ID do usuário não fornecido");
    }

    const userToUpdate = await userRepository.findOneBy({ id });

    if (!userToUpdate) {
      throw new BadRequestError("Usuário não encontrado");
    }

    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;
    if (password) userToUpdate.password = password;

    await userRepository.save(userToUpdate);

    const { password: _, ...updatedUser } = userToUpdate;

    return res.status(200).json(updatedUser);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("ID do usuário não fornecido");
    }

    const userToDelete = await userRepository.findOneBy({ id });

    if (!userToDelete) {
      throw new BadRequestError("Usuário não encontrado");
    }

    await userRepository.remove(userToDelete);

    return res.status(204).send();
  }
}
