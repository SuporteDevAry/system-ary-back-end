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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const ContactRepository_1 = require("../repositories/ContactRepository");
class ContactController {
    async getContactsByClient(req, res) {
        const { code_client } = req.params;
        if (!code_client) {
            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
        }
        const codeClientNumber = parseInt(code_client, 10);
        const contactsSearched = await ContactRepository_1.contactRepository.find({
            where: { code_client: codeClientNumber },
        });
        if (!contactsSearched) {
            throw new api_errors_1.BadRequestError("Não encontrato Contato para o Cliente pesquisado!");
        }
        return res.status(200).json(contactsSearched);
    }
    async create(req, res) {
        const { name, email, sector, telephone, cellphone, code_client, receive_email, } = req.body;
        const contactExists = await ContactRepository_1.contactRepository.findOneBy({
            email,
            code_client,
        });
        if (contactExists) {
            throw new api_errors_1.BadRequestError("Contato já cadastrado.");
        }
        const newContato = ContactRepository_1.contactRepository.create({
            name,
            email,
            sector,
            telephone,
            cellphone,
            code_client,
            receive_email,
        });
        await ContactRepository_1.contactRepository.save(newContato);
        const contatos = __rest(newContato, []);
        return res.status(201).json(contatos);
    }
    async update(req, res) {
        const { id } = req.params;
        const { name, email, sector, telephone, cellphone, receive_email } = req.body;
        if (!id) {
            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
        }
        const contactToUpdate = await ContactRepository_1.contactRepository.findOneBy({
            id,
        });
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
        await ContactRepository_1.contactRepository.save(contactToUpdate);
        const updatedContato = __rest(contactToUpdate, []);
        return res.status(200).json(updatedContato);
    }
    async delete(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
        }
        const contactToDelete = await ContactRepository_1.contactRepository.findOneBy({
            id,
        });
        if (!contactToDelete) {
            throw new api_errors_1.BadRequestError("Contato não encontrado");
        }
        await ContactRepository_1.contactRepository.remove(contactToDelete);
        return res.status(204).send();
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=ContactController.js.map