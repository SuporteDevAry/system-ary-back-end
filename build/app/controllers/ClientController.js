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
exports.ClientController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const ClientRepository_1 = require("../repositories/ClientRepository");
const typeorm_1 = require("typeorm");
function formatCpfCnpj(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 11) {
        // CPF
        return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
    if (digits.length === 14) {
        // CNPJ
        return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    return value; // se não for válido
}
class ClientController {
    async getProfile(req, res) {
        return res.json(req.user);
    }
    async getClients(req, res) {
        const clients = await (0, ClientRepository_1.getClients)();
        return res.status(200).json(clients);
    }
    async getClientById(req, res) {
        const { code_client } = req.params;
        if (!code_client) {
            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
        }
        const codeClientNumber = parseInt(code_client, 10);
        const clienteSearched = await ClientRepository_1.clientRepository.findOneBy({
            code_client: codeClientNumber,
        });
        if (!clienteSearched) {
            throw new api_errors_1.BadRequestError("Cliente pesquisado não existe!");
        }
        return res.status(200).json(clienteSearched);
    }
    async getClientByCnpj_cpf(req, res) {
        const { cnpj_cpf_client } = req.params;
        if (!cnpj_cpf_client) {
            throw new api_errors_1.BadRequestError("CNPJ/CPF não informado." + cnpj_cpf_client);
        }
        const cnpj_cpf_clientNumber = cnpj_cpf_client;
        const formattedCnpj_cpf = formatCpfCnpj(cnpj_cpf_clientNumber);
        const cnpj_cpf_clientSearched = await ClientRepository_1.clientRepository.findOne({
            where: {
                cnpj_cpf: formattedCnpj_cpf,
                kind: (0, typeorm_1.Not)("E"), // <- ignorar estrangeiro
            },
        });
        if (!cnpj_cpf_clientSearched) {
            throw new api_errors_1.BadRequestError("Não encontrado Cliente com CNPJ/CPF informado.");
        }
        return res.status(200).json(cnpj_cpf_clientSearched);
    }
    async create(req, res) {
        const { nickname, name, address, number, complement, district, city, state, zip_code, kind, cnpj_cpf, ins_est, ins_mun, telephone, cellphone, situation, account, } = req.body;
        if (kind !== "E") {
            const clientExists = await ClientRepository_1.clientRepository.findOneBy({ cnpj_cpf });
            if (clientExists) {
                throw new api_errors_1.BadRequestError("Cliente já cadastrado.");
            }
        }
        const newClient = ClientRepository_1.clientRepository.create({
            name,
            address,
            number,
            complement,
            district,
            city,
            state,
            zip_code,
            kind,
            cnpj_cpf,
            ins_est,
            ins_mun,
            telephone,
            cellphone,
            situation,
            nickname,
            account,
        });
        await ClientRepository_1.clientRepository.save(newClient);
        const client = __rest(newClient, []);
        return res.status(201).json(client);
    }
    async update(req, res) {
        const { id } = req.params;
        const { nickname, name, address, number, complement, district, city, state, zip_code, kind, cnpj_cpf, ins_est, ins_mun, telephone, cellphone, situation, account, } = req.body;
        if (!id) {
            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
        }
        const clientToUpdate = await ClientRepository_1.clientRepository.findOneBy({ id });
        if (!clientToUpdate) {
            throw new api_errors_1.BadRequestError("Cliente não encontrado");
        }
        if (nickname !== undefined)
            clientToUpdate.nickname = nickname;
        if (name !== undefined)
            clientToUpdate.name = name;
        if (address !== undefined)
            clientToUpdate.address = address;
        if (number !== undefined)
            clientToUpdate.number = number;
        if (complement !== undefined)
            clientToUpdate.complement = complement;
        if (district !== undefined)
            clientToUpdate.district = district;
        if (city !== undefined)
            clientToUpdate.city = city;
        if (state !== undefined)
            clientToUpdate.state = state;
        if (zip_code !== undefined)
            clientToUpdate.zip_code = zip_code;
        if (kind !== undefined)
            clientToUpdate.kind = kind;
        if (cnpj_cpf !== undefined)
            clientToUpdate.cnpj_cpf = cnpj_cpf;
        if (ins_est !== undefined)
            clientToUpdate.ins_est = ins_est;
        if (ins_mun !== undefined)
            clientToUpdate.ins_mun = ins_mun;
        if (telephone !== undefined)
            clientToUpdate.telephone = telephone;
        if (cellphone !== undefined)
            clientToUpdate.cellphone = cellphone;
        if (situation !== undefined)
            clientToUpdate.situation = situation;
        if (account !== undefined)
            clientToUpdate.account = account;
        await ClientRepository_1.clientRepository.save(clientToUpdate);
        const updatedCliente = __rest(clientToUpdate, []);
        return res.status(200).json(updatedCliente);
    }
    async delete(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new api_errors_1.BadRequestError("Código do Cliente não informado.");
        }
        const clientToDelete = await ClientRepository_1.clientRepository.findOneBy({ id });
        if (!clientToDelete) {
            throw new api_errors_1.BadRequestError("Cliente não encontrado");
        }
        await ClientRepository_1.clientRepository.remove(clientToDelete);
        return res.status(204).send();
    }
}
exports.ClientController = ClientController;
//# sourceMappingURL=ClientController.js.map