import { Request, Response } from "express";
import {
  generateNumberContract,
  grainContractRepository,
} from "../repositories/GrainContractRepository";
import { calcCommission } from "../../utills/calcCommission";
import { GrainContract } from "../entities/GrainContracts";

export class GrainContractController {
  getGrainContracts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const grainContracts = await grainContractRepository.find();
      return res.json(grainContracts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getGrainContractById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      const grainContract = await grainContractRepository.findOne({
        where: { id },
      });
      if (!grainContract) {
        return res.status(404).json({ message: "GrainContract not found" });
      }
      return res.json(grainContract);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  createGrainContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const numberContract = await generateNumberContract(req.body);

      const commissionValue = calcCommission(req.body);

      const grainContract = grainContractRepository.create({
        ...req.body,
        number_contract: numberContract,
        final_quantity: req.body.quantity, // Salvando o mesmo valor que quantity
        status_received: "Não",
        commission_contract: commissionValue,
      });

      const result = await grainContractRepository.save(grainContract);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateGrainContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { ...otherFields } = req.body;

    try {
      let grainContract = await grainContractRepository.findOneBy({ id });
      if (!grainContract) {
        return res.status(404).json({ message: "Contrato não encontrado" });
      }

      // Regex para capturar as partes do número do contrato (prefixo, corretor, radical e ano)
      const validNumberContract = /^([A-Z]+)\.([A-Z0-9]+)-(\d{3})\/(\d{2})$/;
      const match = grainContract.number_contract.match(validNumberContract);

      if (match) {
        const [, currentProduct, currentBroker, currentIncrement, currentYear] =
          match;

        // Verifica se o product ou number_broker são diferentes dos valores atuais
        const isProductDifferent =
          otherFields.product && otherFields.product !== currentProduct;
        const isBrokerDifferent =
          otherFields.number_broker &&
          otherFields.number_broker !== currentBroker;

        if (isProductDifferent || isBrokerDifferent) {
          // Atualiza o prefixo e/ou sufixo do número do contrato
          const updatedProduct = isProductDifferent
            ? otherFields.product
            : currentProduct;
          const updatedBroker = isBrokerDifferent
            ? otherFields.number_broker
            : currentBroker;

          // Só iremos remover essa regra das siglas, caso o cliente aceite a sugestão da reunião do dia 09/04/2025
          const listProducts = ["O", "OC", "OA", "SB", "EP"];
          const siglaProduct = listProducts.includes(updatedProduct)
            ? "O"
            : updatedProduct;

          // Mantém o radical e o ano, alterando apenas o prefixo e sufixo
          grainContract.number_contract = `${siglaProduct}.${updatedBroker}-${currentIncrement}/${currentYear}`;
          grainContract.number_broker = updatedBroker;
          grainContract.product = updatedProduct;
        }
      } else {
        return res
          .status(400)
          .json({ message: "Formato do número do contrato inválido" });
      }

      const updatedGrainContract = {
        ...otherFields,
        number_contract: grainContract.number_contract,
        number_broker: grainContract.number_broker,
        product: grainContract.product,
      };

      // Recalcula a comissão
      updatedGrainContract.commission_contract = calcCommission({
        ...grainContract,
        ...updatedGrainContract,
      });

      const result = await grainContractRepository.save(updatedGrainContract);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteGrainContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      let grainContract = await grainContractRepository.findOneBy({ id });
      if (!grainContract) {
        return res.status(404).json({ message: "Contrato não encontrado" });
      }
      grainContract = grainContractRepository.merge(grainContract, req.body);
      const result = await grainContractRepository.save(grainContract);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateContractAdjustments = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const {
      final_quantity, // quantidade final
      payment_date, // data de pagamento
      charge_date, // Data da Cobrança
      expected_receipt_date, // Data Prevista de Recebimento
      internal_communication, //comunicao interna
      status_received, // Liquidado S ou N
    } = req.body;

    try {
      let grainContract = await grainContractRepository.findOneBy({ id });
      if (!grainContract) {
        return res.status(404).json({ message: "Contrato não encontrado." });
      }

      const updatedFields: Partial<GrainContract> = {
        final_quantity,
        payment_date,
        charge_date,
        expected_receipt_date,
        internal_communication,
        status_received,
      };

      if (
        final_quantity !== undefined &&
        Number(final_quantity) !== Number(grainContract.quantity)
      ) {
        //TODO: Validar se o produto é Kg ou Toneladas métricas(óleo), tornar dinâmico pegando direto da base.
        const validProducts = ["O", "F", "OC", "OA", "SB", "EP"];

        const quantityTon = validProducts.includes(grainContract.product)
          ? Number(final_quantity) / 1
          : Number(final_quantity) / 1000;

        updatedFields.total_contract_value =
          quantityTon * Number(grainContract.price);
      }

      //[x] Remove os campos undefined para evitar que o merge os sobrescreva
      const filteredUpdates = Object.fromEntries(
        Object.entries(updatedFields).filter(([_, v]) => v !== undefined)
      );

      // Recalcula a comissão também
      filteredUpdates.commission_contract = calcCommission({
        ...grainContract,
        ...filteredUpdates,
      });

      grainContractRepository.merge(grainContract, filteredUpdates);

      const result = await grainContractRepository.save(grainContract);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
