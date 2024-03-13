import { Request, Response } from "express";
import { clientesRepository, getClientes } from "../repositories/ClientesRepository";
import { BadRequestError } from "../helpers/api-errors";

export class ClientesController {
    async getProfile(req: Request, res: Response) {
        return res.json(req.user);
    }

    async getClientes(req: Request, res: Response) {
        const clientes = await getClientes();

        return res.status(200).json(clientes);
    }

    async getClienteById(req: Request, res: Response) {
        const { cli_codigo } = req.params;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }

        const clienteSearched = await clientesRepository.findOneBy({ cli_codigo });

        if (!clienteSearched) {
            throw new BadRequestError("Cliente pesquisado não existe!");
        }

        return res.status(200).json(clienteSearched);
    }

    async create(req: Request, res: Response) {
        const { id,
            cli_codigo,
            nome,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
            natureza,
            cnpj,
            ins_est,
            ins_mun,
            email,
            telefone,
            celular,
            situacao } = req.body;

        const clienteExists = await clientesRepository.findOneBy({ cli_codigo });

        if (clienteExists) {
            throw new BadRequestError("Cliente já cadastrado.");
        }

        const newCliente = clientesRepository.create({
            id,
            cli_codigo,
            nome,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
            natureza,
            cnpj,
            ins_est,
            ins_mun,
            email,
            telefone,
            celular,
            situacao,
        });

        await clientesRepository.save(newCliente);

        const { ...clientes } = newCliente;

        return res.status(201).json(clientes);
    }

    async updateCliente(req: Request, res: Response) {
        const { cli_codigo } = req.params;
        const { nome,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
            natureza,
            cnpj,
            ins_est,
            ins_mun,
            email,
            telefone,
            celular,
            situacao } = req.body;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }

        const clienteToUpdate = await clientesRepository.findOneBy({ cli_codigo });

        if (!clienteToUpdate) {
            throw new BadRequestError("Cliente não encontrado");
        }

        if (nome) clienteToUpdate.nome = nome;
        if (endereco) clienteToUpdate.endereco = endereco;
        if (numero) clienteToUpdate.numero = numero;
        if (complemento) clienteToUpdate.complemento = complemento;
        if (bairro) clienteToUpdate.bairro = bairro;
        if (cidade) clienteToUpdate.cidade = cidade;
        if (uf) clienteToUpdate.uf = uf;
        if (cep) clienteToUpdate.cep = cep;
        if (natureza) clienteToUpdate.natureza = natureza;
        if (cnpj) clienteToUpdate.cnpj = cnpj;
        if (ins_est) clienteToUpdate.ins_est = ins_est;
        if (ins_mun) clienteToUpdate.ins_mun = ins_mun;
        if (email) clienteToUpdate.email = email;
        if (telefone) clienteToUpdate.telefone = telefone;
        if (celular) clienteToUpdate.celular = celular;
        if (situacao) clienteToUpdate.situacao = situacao;

        await clientesRepository.save(clienteToUpdate);

        const { ...updatedCliente } = clienteToUpdate;

        return res.status(200).json(updatedCliente);
    }

    async deleteCliente(req: Request, res: Response) {
        const { cli_codigo } = req.params;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }

        const clienteToDelete = await clientesRepository.findOneBy({ cli_codigo });

        if (!clienteToDelete) {
            throw new BadRequestError("Cliente não encontrado");
        }

        await clientesRepository.remove(clienteToDelete);

        return res.status(204).send();
    }
}
