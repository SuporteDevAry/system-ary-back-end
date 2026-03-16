import { Request, Response } from "express";
import {
  generateNumberContract,
  grainContractRepository,
} from "../repositories/GrainContractRepository";
import { calcCommission } from "../../utills/calcCommission";
import { convertPrice } from "../../utills/convertPrice";
import { calculateTotalContractValue } from "../../utills/calculateTotalContractValue";
import { calcCommissionBySack } from "../../utills/calcCommissionBySack";
import { GrainContract } from "../entities/GrainContracts";

function isZeroLikeValue(value: number | string | null | undefined): boolean {
  if (value === null || value === undefined) return false;

  const raw = String(value).trim();
  if (!raw) return false;

  const onlyDigits = raw.replace(/\D/g, "");
  return onlyDigits.length > 0 && Number(onlyDigits) === 0;
}

function resolveQuantityForFinancialCalc(
  finalQuantity: number | string | null | undefined,
  quantity: number | string,
): number | string {
  if (
    finalQuantity === null ||
    finalQuantity === undefined ||
    isZeroLikeValue(finalQuantity)
  ) {
    return quantity;
  }

  return finalQuantity;
}

export class GrainContractController {
  getReport = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        seller,
        buyer,
        year,
        month,
        date,
        date_start,
        date_end,
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

      const contractEmissionDateAsDate =
        "(CASE WHEN gc.contract_emission_date ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(gc.contract_emission_date, 'DD/MM/YYYY') ELSE CAST(gc.contract_emission_date AS date) END)";

      const parseDateToIso = (value: string): string | null => {
        const normalizedValue = value.trim();
        const brMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(normalizedValue);
        const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue);

        if (brMatch) {
          const [day, monthPart, yearPart] = normalizedValue.split("/");
          return `${yearPart}-${monthPart}-${day}`;
        }

        if (isoMatch) {
          return normalizedValue;
        }

        const parsedDate = new Date(normalizedValue);
        if (!Number.isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().slice(0, 10);
        }

        return null;
      };

      // Quando date_start/date_end vierem preenchidos, prioriza faixa e ignora date/month/year
      const hasDateRange =
        (typeof date_start !== "undefined" &&
          String(date_start).trim() !== "") ||
        (typeof date_end !== "undefined" && String(date_end).trim() !== "");

      if (hasDateRange) {
        const parsedStartDate =
          typeof date_start !== "undefined" && String(date_start).trim() !== ""
            ? parseDateToIso(String(date_start))
            : null;
        const parsedEndDate =
          typeof date_end !== "undefined" && String(date_end).trim() !== ""
            ? parseDateToIso(String(date_end))
            : null;

        if (parsedStartDate) {
          qb.andWhere(
            `${contractEmissionDateAsDate} >= to_date(:dateStart, 'YYYY-MM-DD')`,
            { dateStart: parsedStartDate },
          );
        }

        if (parsedEndDate) {
          qb.andWhere(
            `${contractEmissionDateAsDate} <= to_date(:dateEnd, 'YYYY-MM-DD')`,
            { dateEnd: parsedEndDate },
          );
        }
      } else if (date) {
        // Filtrar por data completa (DD/MM/YYYY ou YYYY-MM-DD)
        const parsedDate = parseDateToIso(String(date));

        if (parsedDate) {
          qb.andWhere(
            `${contractEmissionDateAsDate} = to_date(:createdDate, 'YYYY-MM-DD')`,
            {
              createdDate: parsedDate,
            },
          );
        }
      } else {
        // Compatibilidade antiga: filtrar por ano/mês quando não houver date_start/date_end/date
        if (year) {
          const y = Number(year);
          if (!Number.isNaN(y)) {
            qb.andWhere(
              `EXTRACT(YEAR FROM ${contractEmissionDateAsDate}) = :year`,
              {
                year: y,
              },
            );
          }
        }

        if (month) {
          const m = Number(month);
          if (!Number.isNaN(m)) {
            qb.andWhere(
              `EXTRACT(MONTH FROM ${contractEmissionDateAsDate}) = :month`,
              {
                month: m,
              },
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
            "DESC",
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
          "DESC",
        )
        .getManyAndCount();
      return res.json({ data, total });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getGrainContracts = async (
    req: Request,
    res: Response,
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
    res: Response,
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
    res: Response,
  ): Promise<Response> => {
    try {
      const numberContract = await generateNumberContract(req.body);
      const initialFinalQuantity = resolveQuantityForFinancialCalc(
        req.body.final_quantity,
        req.body.quantity,
      );

      // const price = convertPrice(
      //   req.body.price,
      //   req.body.type_currency,
      //   req.body.day_exchange_rate
      // );

      const total_contract_value = calculateTotalContractValue(
        req.body.product,
        req.body.quantity,
        req.body.price,
        req.body.type_currency,
        req.body.day_exchange_rate,
        req.body.type_quantity,
      );

      const dataWithConvertedPrice = {
        ...req.body,
        total_contract_value,
        type_commission_seller_currency:
          req.body.type_commission_seller === "Percentual"
            ? null
            : req.body.type_commission_seller_currency,
        type_commission_buyer_currency:
          req.body.type_commission_buyer === "Percentual"
            ? null
            : req.body.type_commission_buyer_currency,
      };

      const commissionValue = calcCommission(dataWithConvertedPrice);

      // Calcula comissões do vendedor e comprador se os valores estiverem preenchidos
      let commissionSellerContract = null;
      let commissionBuyerContract = null;

      if (req.body.commission_seller) {
        // Usa type_currency do contrato como fallback se type_commission_seller_currency não for preenchido
        const sellerCurrency =
          (req.body.type_commission_seller === "Percentual"
            ? ""
            : req.body.type_commission_seller_currency) ||
          (req.body.type_currency === "Dólar" ||
          req.body.type_currency === "USD" ||
          req.body.type_currency === "US$"
            ? "Dólar"
            : "BRL");

        // Usa day_exchange_rate do contrato como fallback se commission_seller_exchange_rate não for preenchido
        const sellerRate =
          req.body.commission_seller_exchange_rate ||
          (sellerCurrency === "Dólar" ||
          sellerCurrency === "USD" ||
          sellerCurrency === "US$"
            ? req.body.day_exchange_rate
            : undefined);

        commissionSellerContract = calcCommissionBySack(
          req.body.quantity,
          req.body.type_quantity,
          req.body.commission_seller,
          req.body.type_commission_seller,
          sellerCurrency,
          sellerRate,
          total_contract_value,
        );

        // Arredonda para 2 casas decimais
        commissionSellerContract =
          Math.round(commissionSellerContract * 100) / 100;
      }

      if (req.body.commission_buyer) {
        // Usa type_currency do contrato como fallback se type_commission_buyer_currency não for preenchido
        const buyerCurrency =
          (req.body.type_commission_buyer === "Percentual"
            ? ""
            : req.body.type_commission_buyer_currency) ||
          (req.body.type_currency === "Dólar" ||
          req.body.type_currency === "USD" ||
          req.body.type_currency === "US$"
            ? "Dólar"
            : "BRL");

        // Usa day_exchange_rate do contrato como fallback se commission_buyer_exchange_rate não for preenchido
        const buyerRate =
          req.body.commission_buyer_exchange_rate ||
          (buyerCurrency === "Dólar" ||
          buyerCurrency === "USD" ||
          buyerCurrency === "US$"
            ? req.body.day_exchange_rate
            : undefined);

        commissionBuyerContract = calcCommissionBySack(
          req.body.quantity,
          req.body.type_quantity,
          req.body.commission_buyer,
          req.body.type_commission_buyer,
          buyerCurrency,
          buyerRate,
          total_contract_value,
        );

        // Arredonda para 2 casas decimais
        commissionBuyerContract =
          Math.round(commissionBuyerContract * 100) / 100;
      }

      // Define commission_contract baseado na lógica: null se houver ambos, senão usar o que existe
      let finalCommissionContract: number | null = commissionValue;
      if (
        commissionSellerContract !== null &&
        commissionBuyerContract !== null
      ) {
        // Quando há comissão de ambos, deixar null
        finalCommissionContract = null;
      } else if (commissionSellerContract !== null) {
        finalCommissionContract = commissionSellerContract;
      } else if (commissionBuyerContract !== null) {
        finalCommissionContract = commissionBuyerContract;
      }

      const grainContract = grainContractRepository.create({
        ...dataWithConvertedPrice,
        number_contract: numberContract,
        final_quantity: initialFinalQuantity,
        status_received: "Não",
        commission_contract: finalCommissionContract,
        commission_seller_contract_value: commissionSellerContract,
        commission_buyer_contract_value: commissionBuyerContract,
      });

      const result = (await grainContractRepository.save(
        grainContract,
      )) as unknown as GrainContract;

      // Na criacao, quantidade final deve espelhar a quantidade do contrato.
      if (
        isZeroLikeValue(result.final_quantity) &&
        !isZeroLikeValue(result.quantity)
      ) {
        result.final_quantity = result.quantity;
        await grainContractRepository.save(result);
      }

      // Atualiza contract_emission_datetime com a data de emissão e hora do created_at
      if (result.contract_emission_date && result.created_at) {
        const dateStr = result.contract_emission_date;
        const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        let dateIso = "";
        if (match) {
          dateIso = `${match[3]}-${match[2]}-${match[1]}`;
        } else {
          dateIso = dateStr;
        }

        const createdAt = new Date(result.created_at);
        const hourStr = createdAt.getHours().toString().padStart(2, "0");
        const minStr = createdAt.getMinutes().toString().padStart(2, "0");
        const secStr = createdAt.getSeconds().toString().padStart(2, "0");
        const msStr = createdAt.getMilliseconds().toString().padStart(3, "0");
        result.contract_emission_datetime = new Date(
          `${dateIso}T${hourStr}:${minStr}:${secStr}.${msStr}`,
        );

        await grainContractRepository.save(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateGrainContract = async (
    req: Request,
    res: Response,
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
      const finalQuantityToUse =
        otherFields.final_quantity !== undefined
          ? otherFields.final_quantity
          : grainContract.final_quantity;
      const quantityForFinancialCalc = resolveQuantityForFinancialCalc(
        finalQuantityToUse,
        quantityToUse,
      );
      const priceFromRequest =
        otherFields.price !== undefined
          ? otherFields.price
          : grainContract.price;
      const currencyToCheck =
        otherFields.type_currency || grainContract.type_currency;
      const exchangeRateToCheck =
        otherFields.day_exchange_rate || grainContract.day_exchange_rate;
      const typeQuantityToCheck =
        otherFields.type_quantity || grainContract.type_quantity;

      const total_contract_value = calculateTotalContractValue(
        productToCheck,
        quantityForFinancialCalc,
        priceFromRequest,
        currencyToCheck,
        exchangeRateToCheck,
        typeQuantityToCheck,
      );

      let updatedGrainContract = {
        ...otherFields,
        number_contract: grainContract.number_contract,
        number_broker: grainContract.number_broker,
        product: grainContract.product,
        price: priceFromRequest,
        final_quantity:
          otherFields.final_quantity !== undefined
            ? resolveQuantityForFinancialCalc(
                otherFields.final_quantity,
                quantityToUse,
              )
            : grainContract.final_quantity,
        total_contract_value,
        type_quantity: typeQuantityToCheck,
        quantity_kg: Number(grainContract.quantity_kg),
        quantity_bag: Number(grainContract.quantity_bag),
        commission_contract: Number(grainContract.commission_contract),
        commission_seller_contract_value:
          grainContract.commission_seller_contract_value,
        commission_buyer_contract_value:
          grainContract.commission_buyer_contract_value,
        total_received: Number(grainContract.total_received),
      };

      const hasOwn = Object.prototype.hasOwnProperty;

      const sellerCurrencyFieldWasSent = hasOwn.call(
        otherFields,
        "type_commission_seller_currency",
      );
      const buyerCurrencyFieldWasSent = hasOwn.call(
        otherFields,
        "type_commission_buyer_currency",
      );

      const sellerCommissionEdited = [
        "commission_seller",
        "type_commission_seller",
        "commission_seller_exchange_rate",
      ].some((field) => hasOwn.call(otherFields, field));

      const buyerCommissionEdited = [
        "commission_buyer",
        "type_commission_buyer",
        "commission_buyer_exchange_rate",
      ].some((field) => hasOwn.call(otherFields, field));

      if (
        sellerCurrencyFieldWasSent &&
        (otherFields.type_commission_seller_currency === "" ||
          otherFields.type_commission_seller_currency === null)
      ) {
        updatedGrainContract.type_commission_seller_currency = null;
      } else if (sellerCommissionEdited && !sellerCurrencyFieldWasSent) {
        updatedGrainContract.type_commission_seller_currency = null;
      }

      if (
        buyerCurrencyFieldWasSent &&
        (otherFields.type_commission_buyer_currency === "" ||
          otherFields.type_commission_buyer_currency === null)
      ) {
        updatedGrainContract.type_commission_buyer_currency = null;
      } else if (buyerCommissionEdited && !buyerCurrencyFieldWasSent) {
        updatedGrainContract.type_commission_buyer_currency = null;
      }

      // Recalcula comissões do vendedor e comprador se os valores estiverem preenchidos
      const mergedData = { ...grainContract, ...updatedGrainContract };

      if (mergedData.type_commission_seller === "Percentual") {
        updatedGrainContract.type_commission_seller_currency = null;
      }

      if (mergedData.type_commission_buyer === "Percentual") {
        updatedGrainContract.type_commission_buyer_currency = null;
      }

      if (mergedData.commission_seller) {
        // Usa type_currency do contrato como fallback se type_commission_seller_currency não for preenchido
        const sellerCurrency =
          mergedData.type_commission_seller_currency ||
          (mergedData.type_currency === "Dólar" ||
          mergedData.type_currency === "USD" ||
          mergedData.type_currency === "US$"
            ? "Dólar"
            : "BRL");

        // Usa day_exchange_rate do contrato como fallback se commission_seller_exchange_rate não for preenchido
        const sellerRate =
          mergedData.commission_seller_exchange_rate ||
          (sellerCurrency === "Dólar" ||
          sellerCurrency === "USD" ||
          sellerCurrency === "US$"
            ? mergedData.day_exchange_rate
            : undefined);

        updatedGrainContract.commission_seller_contract_value =
          calcCommissionBySack(
            resolveQuantityForFinancialCalc(
              mergedData.final_quantity,
              mergedData.quantity,
            ),
            mergedData.type_quantity,
            mergedData.commission_seller,
            mergedData.type_commission_seller,
            sellerCurrency,
            sellerRate,
            total_contract_value,
          );

        // Arredonda para 2 casas decimais
        updatedGrainContract.commission_seller_contract_value =
          Math.round(
            updatedGrainContract.commission_seller_contract_value * 100,
          ) / 100;
      }

      if (mergedData.commission_buyer) {
        // Usa type_currency do contrato como fallback se type_commission_buyer_currency não for preenchido
        const buyerCurrency =
          mergedData.type_commission_buyer_currency ||
          (mergedData.type_currency === "Dólar" ||
          mergedData.type_currency === "USD" ||
          mergedData.type_currency === "US$"
            ? "Dólar"
            : "BRL");

        // Usa day_exchange_rate do contrato como fallback se commission_buyer_exchange_rate não for preenchido
        const buyerRate =
          mergedData.commission_buyer_exchange_rate ||
          (buyerCurrency === "Dólar" ||
          buyerCurrency === "USD" ||
          buyerCurrency === "US$"
            ? mergedData.day_exchange_rate
            : undefined);

        updatedGrainContract.commission_buyer_contract_value =
          calcCommissionBySack(
            resolveQuantityForFinancialCalc(
              mergedData.final_quantity,
              mergedData.quantity,
            ),
            mergedData.type_quantity,
            mergedData.commission_buyer,
            mergedData.type_commission_buyer,
            buyerCurrency,
            buyerRate,
            total_contract_value,
          );

        // Arredonda para 2 casas decimais
        updatedGrainContract.commission_buyer_contract_value =
          Math.round(
            updatedGrainContract.commission_buyer_contract_value * 100,
          ) / 100;
      }

      // Define commission_contract baseado na lógica: null se houver ambos, senão usar o que existe
      const sellerComm =
        updatedGrainContract.commission_seller_contract_value ??
        mergedData.commission_seller_contract_value;
      const buyerComm =
        updatedGrainContract.commission_buyer_contract_value ??
        mergedData.commission_buyer_contract_value;

      if (
        sellerComm !== null &&
        sellerComm !== undefined &&
        buyerComm !== null &&
        buyerComm !== undefined
      ) {
        // Quando há comissão de ambos, deixar null
        updatedGrainContract.commission_contract = null;
      } else if (sellerComm !== null && sellerComm !== undefined) {
        updatedGrainContract.commission_contract = sellerComm;
      } else if (buyerComm !== null && buyerComm !== undefined) {
        updatedGrainContract.commission_contract = buyerComm;
      } else {
        // Se nenhum existir, manter o cálculo padrão
        updatedGrainContract.commission_contract = calcCommission({
          ...grainContract,
          ...updatedGrainContract,
        });
      }

      const result = await grainContractRepository.save(updatedGrainContract);
      return res.json(result);
    } catch (error) {
      console.log("erro 500", error);
      return res.status(500).json({ message: error.message });
    }
  };

  deleteGrainContract = async (
    req: Request,
    res: Response,
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
    res: Response,
  ): Promise<Response> => {
    const { id } = req.params;

    try {
      let grainContract = await grainContractRepository.findOneBy({ id });
      if (!grainContract) {
        return res.status(404).json({ message: "Contrato não encontrado." });
      }

      const hasOwn = Object.prototype.hasOwnProperty;

      const allowedPatchFields: (keyof GrainContract)[] = [
        "final_quantity",
        "payment_date",
        "charge_date",
        "expected_receipt_date",
        "internal_communication",
        "status_received",
        "total_received",
        "number_external_contract_buyer",
        "day_exchange_rate",
      ];

      const updatedFields: Partial<GrainContract> = {};

      allowedPatchFields.forEach((field) => {
        if (hasOwn.call(req.body, field) && req.body[field] !== undefined) {
          (updatedFields as Record<string, any>)[field] = req.body[field];
        }
      });

      const finalQuantityWasSent =
        hasOwn.call(req.body, "final_quantity") &&
        req.body.final_quantity !== undefined;

      if (finalQuantityWasSent) {
        updatedFields.final_quantity = resolveQuantityForFinancialCalc(
          req.body.final_quantity,
          grainContract.quantity,
        ) as number;
      }

      // Verifica se precisa recalcular total do contrato e comissão
      const type_currency =
        req.body.type_currency || grainContract.type_currency;
      const currentFinalQuantity = grainContract.final_quantity;
      const nextDayExchangeRate =
        updatedFields.day_exchange_rate ?? grainContract.day_exchange_rate;
      const exchangeRateChanged =
        hasOwn.call(updatedFields, "day_exchange_rate") &&
        Number(nextDayExchangeRate) !== Number(grainContract.day_exchange_rate);
      const finalQuantityChanged =
        finalQuantityWasSent &&
        Number(updatedFields.final_quantity) !== Number(currentFinalQuantity);

      const hasCommissionConfigured =
        !!grainContract.commission_seller || !!grainContract.commission_buyer;

      const shouldRecalculateDerivedFields =
        finalQuantityWasSent ||
        finalQuantityChanged ||
        hasCommissionConfigured ||
        ((type_currency === "Dólar" ||
          type_currency === "USD" ||
          type_currency === "US$") &&
          exchangeRateChanged);

      if (shouldRecalculateDerivedFields) {
        const finalQuantityForCalc = finalQuantityWasSent
          ? resolveQuantityForFinancialCalc(
              updatedFields.final_quantity,
              grainContract.quantity,
            )
          : resolveQuantityForFinancialCalc(
              grainContract.final_quantity,
              grainContract.quantity,
            );
        const exchangeRateForCalc =
          updatedFields.day_exchange_rate ?? grainContract.day_exchange_rate;

        // Recalcula o preço convertido se necessário
        convertPrice(grainContract.price, type_currency, exchangeRateForCalc);

        if (
          finalQuantityForCalc !== null &&
          typeof finalQuantityForCalc !== "undefined"
        ) {
          const total_contract_value = calculateTotalContractValue(
            grainContract.product,
            finalQuantityForCalc,
            grainContract.price,
            type_currency,
            exchangeRateForCalc,
            grainContract.type_quantity,
          );
          updatedFields.total_contract_value = total_contract_value;
        }
      }

      //[x] Remove os campos undefined para evitar que o merge os sobrescreva
      const filteredUpdates = Object.fromEntries(
        Object.entries(updatedFields).filter(([_, v]) => v !== undefined),
      );

      if (shouldRecalculateDerivedFields) {
        // Recalcula comissões do vendedor e comprador se os valores estiverem preenchidos
        const mergedData = { ...grainContract, ...filteredUpdates };

        if (mergedData.type_commission_seller === "Percentual") {
          filteredUpdates.type_commission_seller_currency = null;
        }

        if (mergedData.type_commission_buyer === "Percentual") {
          filteredUpdates.type_commission_buyer_currency = null;
        }

        if (mergedData.commission_seller) {
          // Usa type_currency do contrato como fallback se type_commission_seller_currency não for preenchido
          const sellerCurrency =
            mergedData.type_commission_seller_currency ||
            (mergedData.type_currency === "Dólar" ||
            mergedData.type_currency === "USD" ||
            mergedData.type_currency === "US$"
              ? "Dólar"
              : "BRL");

          // Usa day_exchange_rate do contrato como fallback se commission_seller_exchange_rate não for preenchido
          const sellerRate =
            mergedData.commission_seller_exchange_rate ??
            (sellerCurrency === "Dólar" ||
            sellerCurrency === "USD" ||
            sellerCurrency === "US$"
              ? mergedData.day_exchange_rate
              : undefined);

          filteredUpdates.commission_seller_contract_value =
            calcCommissionBySack(
              resolveQuantityForFinancialCalc(
                mergedData.final_quantity,
                mergedData.quantity,
              ),
              mergedData.type_quantity,
              mergedData.commission_seller,
              mergedData.type_commission_seller,
              sellerCurrency,
              sellerRate,
              updatedFields.total_contract_value ??
                grainContract.total_contract_value,
            );

          // Arredonda para 2 casas decimais
          filteredUpdates.commission_seller_contract_value =
            Math.round(filteredUpdates.commission_seller_contract_value * 100) /
            100;
        }

        if (mergedData.commission_buyer) {
          // Usa type_currency do contrato como fallback se type_commission_buyer_currency não for preenchido
          const buyerCurrency =
            mergedData.type_commission_buyer_currency ||
            (mergedData.type_currency === "Dólar" ||
            mergedData.type_currency === "USD" ||
            mergedData.type_currency === "US$"
              ? "Dólar"
              : "BRL");

          // Usa day_exchange_rate do contrato como fallback se commission_buyer_exchange_rate não for preenchido
          const buyerRate =
            mergedData.commission_buyer_exchange_rate ??
            (buyerCurrency === "Dólar" ||
            buyerCurrency === "USD" ||
            buyerCurrency === "US$"
              ? mergedData.day_exchange_rate
              : undefined);

          filteredUpdates.commission_buyer_contract_value =
            calcCommissionBySack(
              resolveQuantityForFinancialCalc(
                mergedData.final_quantity,
                mergedData.quantity,
              ),
              mergedData.type_quantity,
              mergedData.commission_buyer,
              mergedData.type_commission_buyer,
              buyerCurrency,
              buyerRate,
              updatedFields.total_contract_value ??
                grainContract.total_contract_value,
            );

          // Arredonda para 2 casas decimais
          filteredUpdates.commission_buyer_contract_value =
            Math.round(filteredUpdates.commission_buyer_contract_value * 100) /
            100;
        }

        // Define commission_contract baseado na lógica: null se houver ambos, senão usar o que existe
        const sellerComm =
          filteredUpdates.commission_seller_contract_value ??
          mergedData.commission_seller_contract_value;
        const buyerComm =
          filteredUpdates.commission_buyer_contract_value ??
          mergedData.commission_buyer_contract_value;

        if (
          sellerComm !== null &&
          sellerComm !== undefined &&
          buyerComm !== null &&
          buyerComm !== undefined
        ) {
          // Quando há comissão de ambos, deixar null
          filteredUpdates.commission_contract = null;
        } else if (sellerComm !== null && sellerComm !== undefined) {
          filteredUpdates.commission_contract = sellerComm;
        } else if (buyerComm !== null && buyerComm !== undefined) {
          filteredUpdates.commission_contract = buyerComm;
        } else {
          // Se nenhum existir, manter o cálculo padrão
          filteredUpdates.commission_contract = calcCommission({
            ...grainContract,
            ...filteredUpdates,
          });
        }
      }

      grainContractRepository.merge(grainContract, filteredUpdates);

      const result = await grainContractRepository.save(grainContract);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
