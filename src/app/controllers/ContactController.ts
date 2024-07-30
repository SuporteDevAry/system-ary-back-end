import { Request, Response } from "express";

import { BadRequestError } from "../helpers/api-errors";
import { contactRepository } from "../repositories/ContactRepository";

export class ContactController {
  async getContactsByClient(req: Request, res: Response) {
    const { code_client } = req.params;

    if (!code_client) {
      throw new BadRequestError("Código do Cliente não informado.");
    }

    const codeClientNumber = parseInt(code_client, 10);

    const contactsSearched = await contactRepository.find({
      where: { code_client: codeClientNumber },
    });

    if (!contactsSearched) {
      throw new BadRequestError(
        "Não encontrato Contato para o Cliente pesquisado!"
      );
    }

    return res.status(200).json(contactsSearched);
  }

  async create(req: Request, res: Response) {
    const { name, email, sector, telephone, cellphone, code_client } = req.body;

    const contactExists = await contactRepository.findOneBy({
      email,
      code_client,
    });

    if (contactExists) {
      throw new BadRequestError("Contato já cadastrado.");
    }

    const newContato = contactRepository.create({
      name,
      email,
      sector,
      telephone,
      cellphone,
      code_client,
    });

    await contactRepository.save(newContato);

    const { ...contatos } = newContato;

    return res.status(201).json(contatos);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, sector, telephone, cellphone } = req.body;

    if (!id) {
      throw new BadRequestError("Código do Cliente não informado.");
    }

    const contactToUpdate = await contactRepository.findOneBy({
      id,
    });

    if (!contactToUpdate) {
      throw new BadRequestError("Contato não encontrado");
    }

    if (name) contactToUpdate.name = name;
    if (email) contactToUpdate.email = email;
    if (sector) contactToUpdate.sector = sector;
    if (telephone) contactToUpdate.telephone = telephone;
    if (cellphone) contactToUpdate.cellphone = cellphone;

    await contactRepository.save(contactToUpdate);

    const { ...updatedContato } = contactToUpdate;

    return res.status(200).json(updatedContato);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Código do Cliente não informado.");
    }

    const contactToDelete = await contactRepository.findOneBy({
      id,
    });

    if (!contactToDelete) {
      throw new BadRequestError("Contato não encontrado");
    }

    await contactRepository.remove(contactToDelete);

    return res.status(204).send();
  }
}
