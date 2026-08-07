import { GrainContract } from "../entities/GrainContracts";
import { AppDataSource } from "../../database/data-source";
import { generateNumberContract } from "./GrainContractRepository";

// Contratos "a fixar" vivem na MESMA tabela que os contratos de mercado
// interno (grain_contracts), diferenciados pela coluna type_contract. Este
// repositório e o controller que o usa SEMPRE filtram/gravam type_contract =
// "AF", para nunca vazar/misturar com os contratos "MI" do fluxo original.
export const grainFixationContractRepository =
  AppDataSource.getRepository(GrainContract);

// O contrato "a fixar" em si recebe o MESMO formato/sequência de número que
// um contrato MI (ex.: "S.007-001/26") — só as fixações (itens filhos, ver
// GrainFixationContractController.addFixationItem) recebem o marcador "F"
// próprio (ex.: "S.007-001/26-F01").
export const generateNumberFixationContract = generateNumberContract;
