import { Request, Response } from "express";
import { userRepository } from "../repositories/UserRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { permissionRepository } from "../repositories/PermissionRepository";

export class SessionController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestError("E-mail ou senha inválidos!");
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      throw new BadRequestError("E-mail ou senha inválidos!");
    }

    const permission = await permissionRepository.findOneBy({
      id: user.permissions_id,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: permission.rules,
      },
      process.env.JWT_PWD,
      {
        expiresIn: "8h",
      }
    );

    const userLogin = { id: user.id, email: user.email, name: user.name };

    return res.status(200).json({
      user: userLogin,
      token,
    });
  }
  async resetPassword(req: Request, res: Response) {
    // const { password, confirmPassword } = req.body;

    // if (password !== confirmPassword) {
    //   throw new BadRequestError("As senhas não coincidem!");
    // }

    const { email, newPassword } = req.body;

    // Encontre o usuário pelo e-mail
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestError("Usuário não encontrado!");
    }

    // Criptografe a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualize a senha do usuário
    user.password = hashedPassword;
    await userRepository.save(user);

    return res.status(200).json({ message: "Senha redefinida com sucesso!" });
  }
}
