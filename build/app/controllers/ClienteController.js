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
exports.ClienteController = void 0;
var ClienteRepository_1 = require("../repositories/ClienteRepository");
var api_errors_1 = require("../helpers/api-errors");
var ClienteController = /** @class */ (function () {
    function ClienteController() {
    }
    ClienteController.prototype.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.json(req.user)];
            });
        });
    };
    ClienteController.prototype.getClientes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var clientes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ClienteRepository_1.getClientes)()];
                    case 1:
                        clientes = _a.sent();
                        console.log("ClienteController");
                        console.log(clientes);
                        return [2 /*return*/, res.status(200).json(clientes)];
                }
            });
        });
    };
    ClienteController.prototype.getClienteById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cli_codigo, clienteSearched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cli_codigo = req.params.cli_codigo;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.findOneBy({ cli_codigo: cli_codigo })];
                    case 1:
                        clienteSearched = _a.sent();
                        if (!clienteSearched) {
                            throw new api_errors_1.BadRequestError("Cliente pesquisado não existe!");
                        }
                        return [2 /*return*/, res.status(200).json(clienteSearched)];
                }
            });
        });
    };
    ClienteController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, cli_codigo, nome, endereco, numero, complemento, bairro, cidade, uf, cep, natureza, cnpj, ins_est, ins_mun, email, telefone, celular, situacao, clienteExists, newCliente, cliente;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, cli_codigo = _a.cli_codigo, nome = _a.nome, endereco = _a.endereco, numero = _a.numero, complemento = _a.complemento, bairro = _a.bairro, cidade = _a.cidade, uf = _a.uf, cep = _a.cep, natureza = _a.natureza, cnpj = _a.cnpj, ins_est = _a.ins_est, ins_mun = _a.ins_mun, email = _a.email, telefone = _a.telefone, celular = _a.celular, situacao = _a.situacao;
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.findOneBy({ cli_codigo: cli_codigo })];
                    case 1:
                        clienteExists = _b.sent();
                        if (clienteExists) {
                            throw new api_errors_1.BadRequestError("Cliente já cadastrado.");
                        }
                        newCliente = ClienteRepository_1.clienteRepository.create({
                            id: id,
                            cli_codigo: cli_codigo,
                            nome: nome,
                            endereco: endereco,
                            numero: numero,
                            complemento: complemento,
                            bairro: bairro,
                            cidade: cidade,
                            uf: uf,
                            cep: cep,
                            natureza: natureza,
                            cnpj: cnpj,
                            ins_est: ins_est,
                            ins_mun: ins_mun,
                            email: email,
                            telefone: telefone,
                            celular: celular,
                            situacao: situacao,
                        });
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.save(newCliente)];
                    case 2:
                        _b.sent();
                        cliente = __rest(newCliente, []);
                        return [2 /*return*/, res.status(201).json(cliente)];
                }
            });
        });
    };
    ClienteController.prototype.updateCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cli_codigo, _a, nome, endereco, numero, complemento, bairro, cidade, uf, cep, natureza, cnpj, ins_est, ins_mun, email, telefone, celular, situacao, clienteToUpdate, updatedCliente;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cli_codigo = req.params.cli_codigo;
                        _a = req.body, nome = _a.nome, endereco = _a.endereco, numero = _a.numero, complemento = _a.complemento, bairro = _a.bairro, cidade = _a.cidade, uf = _a.uf, cep = _a.cep, natureza = _a.natureza, cnpj = _a.cnpj, ins_est = _a.ins_est, ins_mun = _a.ins_mun, email = _a.email, telefone = _a.telefone, celular = _a.celular, situacao = _a.situacao;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.findOneBy({ cli_codigo: cli_codigo })];
                    case 1:
                        clienteToUpdate = _b.sent();
                        if (!clienteToUpdate) {
                            throw new api_errors_1.BadRequestError("Cliente não encontrado");
                        }
                        if (nome)
                            clienteToUpdate.nome = nome;
                        if (endereco)
                            clienteToUpdate.endereco = endereco;
                        if (numero)
                            clienteToUpdate.numero = numero;
                        if (complemento)
                            clienteToUpdate.complemento = complemento;
                        if (bairro)
                            clienteToUpdate.bairro = bairro;
                        if (cidade)
                            clienteToUpdate.cidade = cidade;
                        if (uf)
                            clienteToUpdate.uf = uf;
                        if (cep)
                            clienteToUpdate.cep = cep;
                        if (natureza)
                            clienteToUpdate.natureza = natureza;
                        if (cnpj)
                            clienteToUpdate.cnpj = cnpj;
                        if (ins_est)
                            clienteToUpdate.ins_est = ins_est;
                        if (ins_mun)
                            clienteToUpdate.ins_mun = ins_mun;
                        if (email)
                            clienteToUpdate.email = email;
                        if (telefone)
                            clienteToUpdate.telefone = telefone;
                        if (celular)
                            clienteToUpdate.celular = celular;
                        if (situacao)
                            clienteToUpdate.situacao = situacao;
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.save(clienteToUpdate)];
                    case 2:
                        _b.sent();
                        updatedCliente = __rest(clienteToUpdate, []);
                        return [2 /*return*/, res.status(200).json(updatedCliente)];
                }
            });
        });
    };
    ClienteController.prototype.deleteCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cli_codigo, clienteToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cli_codigo = req.params.cli_codigo;
                        if (!cli_codigo) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.findOneBy({ cli_codigo: cli_codigo })];
                    case 1:
                        clienteToDelete = _a.sent();
                        if (!clienteToDelete) {
                            throw new api_errors_1.BadRequestError("Cliente não encontrado");
                        }
                        return [4 /*yield*/, ClienteRepository_1.clienteRepository.remove(clienteToDelete)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(204).send()];
                }
            });
        });
    };
    return ClienteController;
}());
exports.ClienteController = ClienteController;
//# sourceMappingURL=ClienteController.js.map