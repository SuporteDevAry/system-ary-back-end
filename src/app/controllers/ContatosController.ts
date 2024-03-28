import { Request, Response } from "express";
import { contatosRepository, getContatos } from "../repositories/ContatosRepository";
import { BadRequestError } from "../helpers/api-errors";

export class ContatosController {
    async getProfile(req: Request, res: Response) {

        return res.json(req.user);
    }

    async getContatos(req: Request, res: Response) {
        const contatos = await getContatos();

        return res.status(200).json(contatos);
    }

    async getContatosCliente(req: Request, res: Response) {
        const { cli_codigo } = req.params;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }

        const contatosSearched = await contatosRepository.findOneBy({ cli_codigo });

        if (!contatosSearched) {
            throw new BadRequestError("Não encontrato Contato para o Cliente pesquisado!");
        }

        return res.status(200).json(contatosSearched);
    }

    async getContatosClienteBySeq(req: Request, res: Response) {
        const { cli_codigo, sequencia } = req.params;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }
        if (!sequencia) {
            throw new BadRequestError("Sequência do Contato não informada.");
        }

        const contatosSearched = await contatosRepository.findBy({ cli_codigo, sequencia });

        if (!contatosSearched) {
            throw new BadRequestError("Não encontrato Contato para o Cliente pesquisado!");
        }

        return res.status(200).json(contatosSearched);
    }


    async create(req: Request, res: Response) {
        const { id,
            cli_codigo,
            sequencia,
            grupo,
            nome,
            cargo,
            email,
            telefone,
            celular,
            recebe_email } = req.body;

        const contatosExists = await contatosRepository.findOneBy({ cli_codigo, sequencia });

        if (contatosExists) {
            throw new BadRequestError("Contato já cadastrado.");
        }

        const newContato = contatosRepository.create({
            cli_codigo,
            sequencia,
            grupo,
            nome,
            cargo,
            email,
            telefone,
            celular,
            recebe_email,
        });

        await contatosRepository.save(newContato);

        const { ...contatos } = newContato;

        return res.status(201).json(contatos);
    }

    async updateContato(req: Request, res: Response) {
        const { cli_codigo, sequencia } = req.params;
        const { grupo,
            nome,
            cargo,
            email,
            telefone,
            celular,
            recebe_email } = req.body;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }
        if (!sequencia) {
            throw new BadRequestError("Sequência do Contato não informada.");
        }

        const contatoToUpdate = await contatosRepository.findOneBy({ cli_codigo, sequencia });

        if (!contatoToUpdate) {
            throw new BadRequestError("Contato não encontrado");
        }

        if (grupo) contatoToUpdate.grupo = grupo;
        if (nome) contatoToUpdate.nome = nome;
        if (cargo) contatoToUpdate.cargo = cargo;
        if (email) contatoToUpdate.email = email;
        if (telefone) contatoToUpdate.telefone = telefone;
        if (celular) contatoToUpdate.celular = celular;
        if (recebe_email) contatoToUpdate.recebe_email = recebe_email;

        await contatosRepository.save(contatoToUpdate);

        const { ...updatedContato } = contatoToUpdate;

        return res.status(200).json(updatedContato);
    }

    async deleteContato(req: Request, res: Response) {
        const { cli_codigo, sequencia } = req.params;

        if (!cli_codigo) {
            throw new BadRequestError("Código do Cliente não informado.");
        }
        if (!sequencia) {
            throw new BadRequestError("Sequência do Contato não informada.");
        }

        const contatoToDelete = await contatosRepository.findOneBy({ cli_codigo, sequencia });

        if (!contatoToDelete) {
            throw new BadRequestError("Contato não encontrado");
        }

        await contatosRepository.remove(contatoToDelete);

        return res.status(204).send();
    }
}
