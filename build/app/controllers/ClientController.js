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
exports.ClientController = void 0;
var api_errors_1 = require("../helpers/api-errors");
var ClientRepository_1 = require("../repositories/ClientRepository");
var ClientController = /** @class */ (function () {
    function ClientController() {
    }
    ClientController.prototype.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.json(req.user)];
            });
        });
    };
    ClientController.prototype.getClients = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var clients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ClientRepository_1.getClients)()];
                    case 1:
                        clients = _a.sent();
                        return [2 /*return*/, res.status(200).json(clients)];
                }
            });
        });
    };
    ClientController.prototype.getClientById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var code_client, codeClientNumber, clienteSearched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code_client = req.params.code_client;
                        if (!code_client) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        codeClientNumber = parseInt(code_client, 10);
                        return [4 /*yield*/, ClientRepository_1.clientRepository.findOneBy({
                                code_client: codeClientNumber,
                            })];
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
    ClientController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nickname, name, address, number, complement, district, city, state, zip_code, kind, cnpj_cpf, ins_est, ins_mun, telephone, cellphone, situation, clientExists, newClient, client;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, nickname = _a.nickname, name = _a.name, address = _a.address, number = _a.number, complement = _a.complement, district = _a.district, city = _a.city, state = _a.state, zip_code = _a.zip_code, kind = _a.kind, cnpj_cpf = _a.cnpj_cpf, ins_est = _a.ins_est, ins_mun = _a.ins_mun, telephone = _a.telephone, cellphone = _a.cellphone, situation = _a.situation;
                        if (!(kind !== "E")) return [3 /*break*/, 2];
                        return [4 /*yield*/, ClientRepository_1.clientRepository.findOneBy({ cnpj_cpf: cnpj_cpf })];
                    case 1:
                        clientExists = _b.sent();
                        if (clientExists) {
                            throw new api_errors_1.BadRequestError("Cliente já cadastrado.");
                        }
                        _b.label = 2;
                    case 2:
                        newClient = ClientRepository_1.clientRepository.create({
                            name: name,
                            address: address,
                            number: number,
                            complement: complement,
                            district: district,
                            city: city,
                            state: state,
                            zip_code: zip_code,
                            kind: kind,
                            cnpj_cpf: cnpj_cpf,
                            ins_est: ins_est,
                            ins_mun: ins_mun,
                            telephone: telephone,
                            cellphone: cellphone,
                            situation: situation,
                            nickname: nickname,
                        });
                        return [4 /*yield*/, ClientRepository_1.clientRepository.save(newClient)];
                    case 3:
                        _b.sent();
                        client = __rest(newClient, []);
                        return [2 /*return*/, res.status(201).json(client)];
                }
            });
        });
    };
    ClientController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, nickname, name, address, number, complement, district, city, state, zip_code, kind, cnpj_cpf, ins_est, ins_mun, telephone, cellphone, situation, clientToUpdate, updatedCliente;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _a = req.body, nickname = _a.nickname, name = _a.name, address = _a.address, number = _a.number, complement = _a.complement, district = _a.district, city = _a.city, state = _a.state, zip_code = _a.zip_code, kind = _a.kind, cnpj_cpf = _a.cnpj_cpf, ins_est = _a.ins_est, ins_mun = _a.ins_mun, telephone = _a.telephone, cellphone = _a.cellphone, situation = _a.situation;
                        if (!id) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ClientRepository_1.clientRepository.findOneBy({ id: id })];
                    case 1:
                        clientToUpdate = _b.sent();
                        if (!clientToUpdate) {
                            throw new api_errors_1.BadRequestError("Cliente não encontrado");
                        }
                        if (nickname)
                            clientToUpdate.nickname = nickname;
                        if (name)
                            clientToUpdate.name = name;
                        if (address)
                            clientToUpdate.address = address;
                        if (number)
                            clientToUpdate.number = number;
                        if (complement)
                            clientToUpdate.complement = complement;
                        if (district)
                            clientToUpdate.district = district;
                        if (city)
                            clientToUpdate.city = city;
                        if (state)
                            clientToUpdate.state = state;
                        if (zip_code)
                            clientToUpdate.zip_code = zip_code;
                        if (kind)
                            clientToUpdate.kind = kind;
                        if (cnpj_cpf)
                            clientToUpdate.cnpj_cpf = cnpj_cpf;
                        if (ins_est)
                            clientToUpdate.ins_est = ins_est;
                        if (ins_mun)
                            clientToUpdate.ins_mun = ins_mun;
                        if (telephone)
                            clientToUpdate.telephone = telephone;
                        if (cellphone)
                            clientToUpdate.cellphone = cellphone;
                        if (situation)
                            clientToUpdate.situation = situation;
                        return [4 /*yield*/, ClientRepository_1.clientRepository.save(clientToUpdate)];
                    case 2:
                        _b.sent();
                        updatedCliente = __rest(clientToUpdate, []);
                        return [2 /*return*/, res.status(200).json(updatedCliente)];
                }
            });
        });
    };
    ClientController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, clientToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ClientRepository_1.clientRepository.findOneBy({ id: id })];
                    case 1:
                        clientToDelete = _a.sent();
                        if (!clientToDelete) {
                            throw new api_errors_1.BadRequestError("Cliente não encontrado");
                        }
                        return [4 /*yield*/, ClientRepository_1.clientRepository.remove(clientToDelete)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(204).send()];
                }
            });
        });
    };
    return ClientController;
}());
exports.ClientController = ClientController;
//# sourceMappingURL=ClientController.js.map