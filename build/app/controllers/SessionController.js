"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
var UserRepository_1 = require("../repositories/UserRepository");
var api_errors_1 = require("../helpers/api-errors");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var PermissionRepository_1 = require("../repositories/PermissionRepository");
var SessionController = /** @class */ (function () {
    function SessionController() {
    }
    SessionController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, verifyPassword, permission, token, userLogin;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, UserRepository_1.userRepository.findOneBy({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new api_errors_1.BadRequestError("E-mail ou senha inválidos!");
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 2:
                        verifyPassword = _b.sent();
                        if (!verifyPassword) {
                            throw new api_errors_1.BadRequestError("E-mail ou senha inválidos!");
                        }
                        return [4 /*yield*/, PermissionRepository_1.permissionRepository.findOneBy({
                                id: user.permissions_id,
                            })];
                    case 3:
                        permission = _b.sent();
                        token = jsonwebtoken_1.default.sign({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            permissions: permission.rules,
                        }, process.env.JWT_PWD, {
                            expiresIn: "8h",
                        });
                        userLogin = { id: user.id, email: user.email, name: user.name };
                        return [2 /*return*/, res.status(200).json({
                                user: userLogin,
                                token: token,
                            })];
                }
            });
        });
    };
    SessionController.prototype.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, newPassword, user, hashedPassword;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, newPassword = _a.newPassword;
                        return [4 /*yield*/, UserRepository_1.userRepository.findOneBy({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new api_errors_1.BadRequestError("Usuário não encontrado!");
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
                    case 2:
                        hashedPassword = _b.sent();
                        // Atualize a senha do usuário
                        user.password = hashedPassword;
                        return [4 /*yield*/, UserRepository_1.userRepository.save(user)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Senha redefinida com sucesso!" })];
                }
            });
        });
    };
    return SessionController;
}());
exports.SessionController = SessionController;
//# sourceMappingURL=SessionController.js.map