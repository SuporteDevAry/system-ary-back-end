import { Request, Response } from "express";

import { BadRequestError } from "../helpers/api-errors";
import { clientRepository, getClients } from "../repositories/ClientRepository";

export class ClientController {
  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async getClients(req: Request, res: Response) {
    const clients = await getClients();

    return res.status(200).json(clients);
  }

  async getClientById(req: Request, res: Response) {
    const { code_client } = req.params;

    if (!code_client) {
      throw new BadRequestError("Código do Cliente não informado.");
    }

    const codeClientNumber = parseInt(code_client, 10);

    const clienteSearched = await clientRepository.findOneBy({
      code_client: codeClientNumber,
    });

    if (!clienteSearched) {
      throw new BadRequestError("Cliente pesquisado não existe!");
    }

    return res.status(200).json(clienteSearched);
  }

  async create(req: Request, res: Response) {
    const {
      nickname,
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
      account,
      cnpj_pagto,
    } = req.body;

    if (kind !== "E") {
      const clientExists = await clientRepository.findOneBy({ cnpj_cpf });

      if (clientExists) {
        throw new BadRequestError("Cliente já cadastrado.");
      }
    }

    const newClient = clientRepository.create({
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
      cnpj_pagto,
    });

    await clientRepository.save(newClient);

    const { ...client } = newClient;

    return res.status(201).json(client);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      nickname,
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
      account,
      cnpj_pagto,
    } = req.body;

    if (!id) {
      throw new BadRequestError("Código do Cliente não informado.");
    }

    const clientToUpdate = await clientRepository.findOneBy({ id });

    if (!clientToUpdate) {
      throw new BadRequestError("Cliente não encontrado");
    }

    if (nickname !== undefined) clientToUpdate.nickname = nickname;
    if (name !== undefined) clientToUpdate.name = name;
    if (address !== undefined) clientToUpdate.address = address;
    if (number !== undefined) clientToUpdate.number = number;
    if (complement !== undefined) clientToUpdate.complement = complement;
    if (district !== undefined) clientToUpdate.district = district;
    if (city !== undefined) clientToUpdate.city = city;
    if (state !== undefined) clientToUpdate.state = state;
    if (zip_code !== undefined) clientToUpdate.zip_code = zip_code;
    if (kind !== undefined) clientToUpdate.kind = kind;
    if (cnpj_cpf !== undefined) clientToUpdate.cnpj_cpf = cnpj_cpf;
    if (ins_est !== undefined) clientToUpdate.ins_est = ins_est;
    if (ins_mun !== undefined) clientToUpdate.ins_mun = ins_mun;
    if (telephone !== undefined) clientToUpdate.telephone = telephone;
    if (cellphone !== undefined) clientToUpdate.cellphone = cellphone;
    if (situation !== undefined) clientToUpdate.situation = situation;
    if (account !== undefined) clientToUpdate.account = account;
    if (cnpj_pagto !== undefined) clientToUpdate.cnpj_pagto = cnpj_pagto;

    await clientRepository.save(clientToUpdate);

    const { ...updatedCliente } = clientToUpdate;

    return res.status(200).json(updatedCliente);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Código do Cliente não informado.");
    }

    const clientToDelete = await clientRepository.findOneBy({ id });

    if (!clientToDelete) {
      throw new BadRequestError("Cliente não encontrado");
    }

    await clientRepository.remove(clientToDelete);

    return res.status(204).send();
  }
}
