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
exports.authMiddleware = void 0;
const api_errors_1 = require("../helpers/api-errors");
const UserRepository_1 = require("../repositories/UserRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new api_errors_1.UnauthorizedError("Não autorizado");
    }
    const token = authorization.split(" ")[1];
    const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_PWD);
    const user = await UserRepository_1.userRepository.findOneBy({ id });
    if (!user) {
        throw new api_errors_1.UnauthorizedError("Não autorizado");
    }
    const { password: _ } = user, loggedUser = __rest(user, ["password"]);
    req.user = loggedUser;
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map