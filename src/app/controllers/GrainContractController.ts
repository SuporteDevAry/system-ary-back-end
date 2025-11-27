import { Request, Response } from "express";
import {
  generateNumberContract,
  grainContractRepository,
} from "../repositories/GrainContractRepository";
import { calcCommission } from "../../utills/calcCommission";
import { convertPrice } from "../../utills/convertPrice";
import { calculateTotalContractValue } from "../../utills/calculateTotalContractValue";
import { GrainContract } from "../entities/GrainContracts";
import { Console } from "console";

export class GrainContractController {
  getReport = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        seller,
        buyer,
        year,
        month,
        date,
        product,
        name_product,
        page,
        per_page,
      } = req.query as any;

      const qb = grainContractRepository.createQueryBuilder("gc");

      // Filtrar por seller — suporta objeto com campo `name` ou arrays; aceita valores separados por vírgula
      if (seller) {
        const sellers = String(seller)
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        if (sellers.length > 0) {
          const conds: string[] = [];
          const params: any = {};

          // condições para buscar pelo campo name ou nickname dentro do objeto seller
          sellers.forEach((s: string, i: number) => {
            const keyName = `sellerName${i}`;
            const keyNick = `sellerNick${i}`;
            conds.push(`gc.seller->>'name' ILIKE :${keyName}`);
            conds.push(`gc.seller->>'nickname' ILIKE :${keyNick}`);
            params[keyName] = `%${s}%`;
            params[keyNick] = `%${s}%`;
          });

          // condição adicional para compatibilidade com seller sendo um array JSONB de strings
          conds.push(`gc.seller @> :sellersArray`);
          params.sellersArray = JSON.stringify(sellers);

          qb.andWhere(`(${conds.join(" OR ")})`, params);
        }
      }

      // Filtrar por buyer — suporta objeto com campo `name` ou arrays; aceita valores separados por vírgula
      if (buyer) {
        const buyers = String(buyer)
          .split(",")
          .map((b: string) => b.trim())
          .filter((b: string) => b.length > 0);

        if (buyers.length > 0) {
          const conds: string[] = [];
          const params: any = {};

          buyers.forEach((b: string, i: number) => {
            const keyName = `buyerName${i}`;
            const keyNick = `buyerNick${i}`;
            conds.push(`gc.buyer->>'name' ILIKE :${keyName}`);
            conds.push(`gc.buyer->>'nickname' ILIKE :${keyNick}`);
            params[keyName] = `%${b}%`;
            params[keyNick] = `%${b}%`;
          });

          conds.push(`gc.buyer @> :buyersArray`);
          params.buyersArray = JSON.stringify(buyers);

          qb.andWhere(`(${conds.join(" OR ")})`, params);
        }
      }

      // Filtrar por produto (prefixo) e nome do produto (busca parcial)
      if (product) {
        qb.andWhere("gc.product = :product", { product });
      }

      if (name_product) {
        qb.andWhere("gc.name_product ILIKE :name_product", {
          name_product: `%${String(name_product)}%`,
        });
      }

      // Filtrar por data completa (DD/MM/YYYY ou YYYY-MM-DD) — compara a parte DATE de created_at
      if (date) {
        let parsedDate: string | null = null;
        const d = String(date).trim();
        // Aceita formato DD/MM/YYYY
        const brMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(d);
        const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(d);
        if (brMatch) {
          const [day, monthP, yearP] = d.split("/");
          parsedDate = `${yearP}-${monthP}-${day}`; // YYYY-MM-DD
        } else if (isoMatch) {
          parsedDate = d;
        } else {
          // Tentativa de parse genérico
          const dt = new Date(d);
          if (!Number.isNaN(dt.getTime())) {
            parsedDate = dt.toISOString().slice(0, 10);
          }
        }

        if (parsedDate) {
          qb.andWhere(
            "(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END) = to_date(:createdDate, 'YYYY-MM-DD')",
            {
              createdDate: parsedDate,
            }
          );
        }
      } else {
        // Filtrar por ano/mês a partir do created_at
        if (year) {
          const y = Number(year);
          if (!Number.isNaN(y)) {
            qb.andWhere(
              "EXTRACT(YEAR FROM (CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END)) = :year",
              {
                year: y,
              }
            );
          }
        }

        if (month) {
          const m = Number(month);
          if (!Number.isNaN(m)) {
            qb.andWhere(
              "EXTRACT(MONTH FROM (CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END)) = :month",
              {
                month: m,
              }
            );
          }
        }
      }

      // Paginação opcional: se `page` ou `per_page` for informado, retorna paginado;
      // caso contrário, retorna todos os resultados.
      const pageProvided = typeof page !== "undefined";
      const perPageProvided = typeof per_page !== "undefined";

      let data: any[] = [];
      let total = 0;

      if (pageProvided || perPageProvided) {
        const pageNum = Number(page) >= 1 ? Number(page) : 1;
        const perPage = Number(per_page) >= 1 ? Number(per_page) : 50;
        const offset = (pageNum - 1) * perPage;

        [data, total] = await qb
          .orderBy(
            "(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS timestamp) END)",
            "DESC"
          )
          .skip(offset)
          .take(perPage)
          .getManyAndCount();

        return res.json({ data, total, page: pageNum, per_page: perPage });
      }

      // Sem paginação: retornar todos os resultados
      [data, total] = await qb
        .orderBy(
          "(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS timestamp) END)",
          "DESC"
        )
        .getManyAndCount();
      return res.json({ data, total });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

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

      // const price = convertPrice(
      //   req.body.price,
      //   req.body.type_currency,
      //   req.body.day_exchange_rate
      // );

      const total_contract_value = calculateTotalContractValue(
        req.body.product,
        req.body.quantity,
        req.body.price
      );

      const dataWithConvertedPrice = {
        ...req.body,
        total_contract_value,
      };

      const commissionValue = calcCommission(dataWithConvertedPrice);

      const grainContract = grainContractRepository.create({
        ...dataWithConvertedPrice,
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

      const productToCheck = otherFields.product || grainContract.product;
      const quantityToUse =
        otherFields.quantity !== undefined
          ? otherFields.quantity
          : grainContract.quantity;
      const priceFromRequest =
        otherFields.price !== undefined
          ? otherFields.price
          : grainContract.price;
      const currencyToCheck =
        otherFields.type_currency || grainContract.type_currency;
      const exchangeRateToCheck =
        otherFields.day_exchange_rate || grainContract.day_exchange_rate;

      //TODO: Ao mudar o status ele atualiza o valor do preço também, preciso validar isso melhor
      const price = convertPrice(
        priceFromRequest,
        currencyToCheck,
        exchangeRateToCheck
      );

      const total_contract_value = calculateTotalContractValue(
        productToCheck,
        quantityToUse,
        price
      );

      let updatedGrainContract = {
        ...otherFields,
        number_contract: grainContract.number_contract,
        number_broker: grainContract.number_broker,
        product: grainContract.product,
        price: priceFromRequest,
        final_quantity: Number(grainContract.quantity),
        total_contract_value,
        quantity_kg: Number(grainContract.quantity_kg),
        quantity_bag: Number(grainContract.quantity_bag),
        commission_contract: Number(grainContract.commission_contract),
        total_received: Number(grainContract.total_received),
      };

      // Recalcula a comissão
      updatedGrainContract.commission_contract = calcCommission({
        ...grainContract,
        ...updatedGrainContract,
      });

      const result = await grainContractRepository.save(updatedGrainContract);
      return res.json(result);
    } catch (error) {
      console.log("erro 500", error);
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
      total_received, // Total Recebido
      number_external_contract_buyer, // Numero Contrato Externo Comprador
      day_exchange_rate, // Cotação do Dia
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
        total_received,
        number_external_contract_buyer,
        day_exchange_rate,
      };

      // Verifica se precisa recalcular total do contrato e comissão
      const type_currency =
        req.body.type_currency || grainContract.type_currency;
      const exchangeRateChanged =
        typeof day_exchange_rate !== "undefined" &&
        Number(day_exchange_rate) !== Number(grainContract.day_exchange_rate);
      const finalQuantityChanged =
        typeof final_quantity !== "undefined" &&
        Number(final_quantity) !== Number(grainContract.quantity);

      if (
        finalQuantityChanged ||
        (type_currency === "Dólar" && exchangeRateChanged)
      ) {
        // Recalcula o preço convertido se necessário
        const priceConverted = convertPrice(
          grainContract.price,
          type_currency,
          day_exchange_rate || grainContract.day_exchange_rate
        );
        const total_contract_value = calculateTotalContractValue(
          grainContract.product,
          final_quantity || grainContract.quantity,
          priceConverted
        );
        updatedFields.total_contract_value = total_contract_value;
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
