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
exports.ContactController = void 0;
var api_errors_1 = require("../helpers/api-errors");
var ContactRepository_1 = require("../repositories/ContactRepository");
var ContactController = /** @class */ (function () {
    function ContactController() {
    }
    ContactController.prototype.getContactsByClient = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var code_client, codeClientNumber, contactsSearched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code_client = req.params.code_client;
                        if (!code_client) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        codeClientNumber = parseInt(code_client, 10);
                        return [4 /*yield*/, ContactRepository_1.contactRepository.find({
                                where: { code_client: codeClientNumber },
                            })];
                    case 1:
                        contactsSearched = _a.sent();
                        if (!contactsSearched) {
                            throw new api_errors_1.BadRequestError("Não encontrato Contato para o Cliente pesquisado!");
                        }
                        return [2 /*return*/, res.status(200).json(contactsSearched)];
                }
            });
        });
    };
    ContactController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, sector, telephone, cellphone, code_client, receive_email, contactExists, newContato, contatos;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, email = _a.email, sector = _a.sector, telephone = _a.telephone, cellphone = _a.cellphone, code_client = _a.code_client, receive_email = _a.receive_email;
                        return [4 /*yield*/, ContactRepository_1.contactRepository.findOneBy({
                                email: email,
                                code_client: code_client,
                            })];
                    case 1:
                        contactExists = _b.sent();
                        if (contactExists) {
                            throw new api_errors_1.BadRequestError("Contato já cadastrado.");
                        }
                        newContato = ContactRepository_1.contactRepository.create({
                            name: name,
                            email: email,
                            sector: sector,
                            telephone: telephone,
                            cellphone: cellphone,
                            code_client: code_client,
                            receive_email: receive_email,
                        });
                        return [4 /*yield*/, ContactRepository_1.contactRepository.save(newContato)];
                    case 2:
                        _b.sent();
                        contatos = __rest(newContato, []);
                        return [2 /*return*/, res.status(201).json(contatos)];
                }
            });
        });
    };
    ContactController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, name, email, sector, telephone, cellphone, receive_email, contactToUpdate, updatedContato;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _a = req.body, name = _a.name, email = _a.email, sector = _a.sector, telephone = _a.telephone, cellphone = _a.cellphone, receive_email = _a.receive_email;
                        if (!id) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ContactRepository_1.contactRepository.findOneBy({
                                id: id,
                            })];
                    case 1:
                        contactToUpdate = _b.sent();
                        if (!contactToUpdate) {
                            throw new api_errors_1.BadRequestError("Contato não encontrado");
                        }
                        if (name)
                            contactToUpdate.name = name;
                        if (email)
                            contactToUpdate.email = email;
                        if (sector)
                            contactToUpdate.sector = sector;
                        if (telephone)
                            contactToUpdate.telephone = telephone;
                        if (cellphone)
                            contactToUpdate.cellphone = cellphone;
                        if (receive_email)
                            contactToUpdate.receive_email = receive_email;
                        return [4 /*yield*/, ContactRepository_1.contactRepository.save(contactToUpdate)];
                    case 2:
                        _b.sent();
                        updatedContato = __rest(contactToUpdate, []);
                        return [2 /*return*/, res.status(200).json(updatedContato)];
                }
            });
        });
    };
    ContactController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, contactToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
                        }
                        return [4 /*yield*/, ContactRepository_1.contactRepository.findOneBy({
                                id: id,
                            })];
                    case 1:
                        contactToDelete = _a.sent();
                        if (!contactToDelete) {
                            throw new api_errors_1.BadRequestError("Contato não encontrado");
                        }
                        return [4 /*yield*/, ContactRepository_1.contactRepository.remove(contactToDelete)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(204).send()];
                }
            });
        });
    };
    return ContactController;
}());
exports.ContactController = ContactController;
//# sourceMappingURL=ContactController.js.map