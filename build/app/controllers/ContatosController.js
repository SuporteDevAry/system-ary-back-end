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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatosController = void 0;
var ContatosRepository_1 = require("../repositories/ContatosRepository");
var api_errors_1 = require("../helpers/api-errors");
var ContatosController = /** @class */ (function () {
    function ContatosController() {
    }
    ContatosController.prototype.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.json(req.user)];
            });
        });
    };
    ContatosController.prototype.getContatos = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var contatos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ContatosRepository_1.getContatos)()];
                    case 1:
                        contatos = _a.sent();
                        return [2 /*return*/, res.status(200).json(contatos)];
                }
            });
        });
    };
    ContatosController.prototype.getContatosCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cli_codigo, contatosSearched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cli_codigo = req.params.cli_codigo;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.findOneBy({ cli_codigo: cli_codigo })];
                    case 1:
                        contatosSearched = _a.sent();
                        if (!contatosSearched) {
                            throw new api_errors_1.BadRequestError("Não encontrato Contato para o Cliente pesquisado!");
                        }
                        return [2 /*return*/, res.status(200).json(contatosSearched)];
                }
            });
        });
    };
    ContatosController.prototype.getContatosClienteBySeq = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cli_codigo, sequencia, contatosSearched;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, cli_codigo = _a.cli_codigo, sequencia = _a.sequencia;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        if (!sequencia) {
                            throw new api_errors_1.BadRequestError("Sequência do Contato não informada.");
                        }
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.findBy({ cli_codigo: cli_codigo, sequencia: sequencia })];
                    case 1:
                        contatosSearched = _b.sent();
                        if (!contatosSearched) {
                            throw new api_errors_1.BadRequestError("Não encontrato Contato para o Cliente pesquisado!");
                        }
                        return [2 /*return*/, res.status(200).json(contatosSearched)];
                }
            });
        });
    };
    ContatosController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, cli_codigo, sequencia, grupo, nome, cargo, email, telefone, celular, recebe_email, contatosExists, newContato, contatos;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, cli_codigo = _a.cli_codigo, sequencia = _a.sequencia, grupo = _a.grupo, nome = _a.nome, cargo = _a.cargo, email = _a.email, telefone = _a.telefone, celular = _a.celular, recebe_email = _a.recebe_email;
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.findOneBy({ cli_codigo: cli_codigo, sequencia: sequencia })];
                    case 1:
                        contatosExists = _b.sent();
                        if (contatosExists) {
                            throw new api_errors_1.BadRequestError("Contato já cadastrado.");
                        }
                        newContato = ContatosRepository_1.contatosRepository.create({
                            cli_codigo: cli_codigo,
                            sequencia: sequencia,
                            grupo: grupo,
                            nome: nome,
                            cargo: cargo,
                            email: email,
                            telefone: telefone,
                            celular: celular,
                            recebe_email: recebe_email,
                        });
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.save(newContato)];
                    case 2:
                        _b.sent();
                        contatos = __rest(newContato, []);
                        return [2 /*return*/, res.status(201).json(contatos)];
                }
            });
        });
    };
    ContatosController.prototype.updateContato = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cli_codigo, sequencia, _b, grupo, nome, cargo, email, telefone, celular, recebe_email, contatoToUpdate, updatedContato;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.params, cli_codigo = _a.cli_codigo, sequencia = _a.sequencia;
                        _b = req.body, grupo = _b.grupo, nome = _b.nome, cargo = _b.cargo, email = _b.email, telefone = _b.telefone, celular = _b.celular, recebe_email = _b.recebe_email;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        if (!sequencia) {
                            throw new api_errors_1.BadRequestError("Sequência do Contato não informada.");
                        }
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.findOneBy({ cli_codigo: cli_codigo, sequencia: sequencia })];
                    case 1:
                        contatoToUpdate = _c.sent();
                        if (!contatoToUpdate) {
                            throw new api_errors_1.BadRequestError("Contato não encontrado");
                        }
                        if (grupo)
                            contatoToUpdate.grupo = grupo;
                        if (nome)
                            contatoToUpdate.nome = nome;
                        if (cargo)
                            contatoToUpdate.cargo = cargo;
                        if (email)
                            contatoToUpdate.email = email;
                        if (telefone)
                            contatoToUpdate.telefone = telefone;
                        if (celular)
                            contatoToUpdate.celular = celular;
                        if (recebe_email)
                            contatoToUpdate.recebe_email = recebe_email;
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.save(contatoToUpdate)];
                    case 2:
                        _c.sent();
                        updatedContato = __rest(contatoToUpdate, []);
                        return [2 /*return*/, res.status(200).json(updatedContato)];
                }
            });
        });
    };
    ContatosController.prototype.deleteContato = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cli_codigo, sequencia, contatoToDelete;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, cli_codigo = _a.cli_codigo, sequencia = _a.sequencia;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        if (!sequencia) {
                            throw new api_errors_1.BadRequestError("Sequência do Contato não informada.");
                        }
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.findOneBy({ cli_codigo: cli_codigo, sequencia: sequencia })];
                    case 1:
                        contatoToDelete = _b.sent();
                        if (!contatoToDelete) {
                            throw new api_errors_1.BadRequestError("Contato não encontrado");
                        }
                        return [4 /*yield*/, ContatosRepository_1.contatosRepository.remove(contatoToDelete)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(204).send()];
                }
            });
        });
    };
    return ContatosController;
}());
exports.ContatosController = ContatosController;
//# sourceMappingURL=ContatosController.js.map