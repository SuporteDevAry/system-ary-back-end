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

    if (nickname) clientToUpdate.nickname = nickname;
    if (name) clientToUpdate.name = name;
    if (address) clientToUpdate.address = address;
    if (number) clientToUpdate.number = number;
    if (complement) clientToUpdate.complement = complement;
    if (district) clientToUpdate.district = district;
    if (city) clientToUpdate.city = city;
    if (state) clientToUpdate.state = state;
    if (zip_code) clientToUpdate.zip_code = zip_code;
    if (kind) clientToUpdate.kind = kind;
    if (cnpj_cpf) clientToUpdate.cnpj_cpf = cnpj_cpf;
    if (ins_est) clientToUpdate.ins_est = ins_est;
    if (ins_mun) clientToUpdate.ins_mun = ins_mun;
    if (telephone) clientToUpdate.telephone = telephone;
    if (cellphone) clientToUpdate.cellphone = cellphone;
    if (situation) clientToUpdate.situation = situation;
    if (account) clientToUpdate.account = account;
    if (cnpj_pagto) clientToUpdate.cnpj_pagto = cnpj_pagto;

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
