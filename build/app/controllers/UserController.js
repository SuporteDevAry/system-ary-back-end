"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const api_errors_1 = require("../helpers/api-errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const PermissionRepository_1 = require("../repositories/PermissionRepository");
class UserController {
    async getProfile(req, res) {
        return res.json(req.user);
    }
    async getPermissionsByEmail(req, res) {
        const { email } = req.query;
        const userEmail = email.toString();
        const user = await UserRepository_1.userRepository.findOneBy({ email: userEmail });
        if (!user) {
            throw new api_errors_1.NotFoundError("Usuário não encontrado");
        }
        const permissions = await PermissionRepository_1.permissionRepository.findOneBy({
            id: user.permissions_id,
        });
        if (!permissions) {
            throw new api_errors_1.NotFoundError("Permissões não encontradas");
        }
        return res.json(permissions);
    }
    async getUsers(req, res) {
        const users = await (0, UserRepository_1.getUsers)();
        users.map((i) => delete i.password);
        if (!users) {
            throw new api_errors_1.BadRequestError("Usuário pesquisado não existe!");
        }
        return res.status(200).json(users);
    }
    async getUserById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new api_errors_1.BadRequestError("E-mail já existe");
        }
        const userSearched = await UserRepository_1.userRepository.findOneBy({ id });
        if (!userSearched) {
            throw new api_errors_1.BadRequestError("Usuário pesquisado não existe!");
        }
        const { password: _ } = userSearched, user = __rest(userSearched, ["password"]);
        return res.status(200).json(user);
    }
    async create(req, res) {
        const { name, email, password } = req.body;
        const userExists = await UserRepository_1.userRepository.findOneBy({ email });
        if (userExists) {
            throw new api_errors_1.BadRequestError("E-mail já existe");
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const newPermissions = PermissionRepository_1.permissionRepository.create();
        await PermissionRepository_1.permissionRepository.save(newPermissions);
        const newUser = UserRepository_1.userRepository.create({
            name,
            email,
            password: hashPassword,
            permissions_id: newPermissions.id,
        });
        await UserRepository_1.userRepository.save(newUser);
        const { password: _ } = newUser, user = __rest(newUser, ["password"]);
        return res.status(201).json(user);
    }
    async updateUser(req, res) {
        const { id } = req.params;
        const { name, email, password } = req.body;
        if (!id) {
            throw new api_errors_1.BadRequestError("ID do usuário não fornecido");
        }
        const userToUpdate = await UserRepository_1.userRepository.findOneBy({ id });
        if (!userToUpdate) {
            throw new api_errors_1.BadRequestError("Usuário não encontrado");
        }
        if (name)
            userToUpdate.name = name;
        if (email)
            userToUpdate.email = email;
        if (password) {
            const hashPassword = await bcrypt_1.default.hash(password, 10);
            userToUpdate.password = hashPassword;
        }
        await UserRepository_1.userRepository.save(userToUpdate);
        const { password: _ } = userToUpdate, updatedUser = __rest(userToUpdate, ["password"]);
        return res.status(200).json(updatedUser);
    }
    async deleteUser(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new api_errors_1.BadRequestError("ID do usuário não fornecido");
        }
        const userToDelete = await UserRepository_1.userRepository.findOneBy({ id });
        if (!userToDelete) {
            throw new api_errors_1.BadRequestError("Usuário não encontrado");
        }
        await UserRepository_1.userRepository.remove(userToDelete);
        return res.status(204).send();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map