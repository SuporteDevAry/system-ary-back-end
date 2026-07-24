"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const api_errors_1 = require("../helpers/api-errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PermissionRepository_1 = require("../repositories/PermissionRepository");
class SessionController {
    async login(req, res) {
        const { email, password } = req.body;
        const user = await UserRepository_1.userRepository.findOneBy({ email });
        if (!user) {
            throw new api_errors_1.BadRequestError("E-mail ou senha inválidos!");
        }
        const verifyPassword = await bcrypt_1.default.compare(password, user.password);
        if (!verifyPassword) {
            throw new api_errors_1.BadRequestError("E-mail ou senha inválidos!");
        }
        const permission = await PermissionRepository_1.permissionRepository.findOneBy({
            id: user.permissions_id,
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            permissions: permission.rules,
        }, process.env.JWT_PWD, {
            expiresIn: "8h",
        });
        const userLogin = { id: user.id, email: user.email, name: user.name };
        return res.status(200).json({
            user: userLogin,
            token,
        });
    }
    async resetPassword(req, res) {
        // const { password, confirmPassword } = req.body;
        // if (password !== confirmPassword) {
        //   throw new BadRequestError("As senhas não coincidem!");
        // }
        const { email, newPassword } = req.body;
        // Encontre o usuário pelo e-mail
        const user = await UserRepository_1.userRepository.findOneBy({ email });
        if (!user) {
            throw new api_errors_1.BadRequestError("Usuário não encontrado!");
        }
        // Criptografe a nova senha
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Atualize a senha do usuário
        user.password = hashedPassword;
        await UserRepository_1.userRepository.save(user);
        return res.status(200).json({ message: "Senha redefinida com sucesso!" });
    }
}
exports.SessionController = SessionController;
//# sourceMappingURL=SessionController.js.map