import path from "path";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { In } from "typeorm";
import {
  generateNumberFixationContract,
  grainFixationContractRepository,
} from "../repositories/GrainFixationContractRepository";
import { grainContractFixationItemRepository } from "../repositories/GrainContractFixationItemRepository";
import { calcCommissionBySack } from "../../utills/calcCommissionBySack";
import { calculateTotalContractValue } from "../../utills/calculateTotalContractValue";
import { convertPrice } from "../../utills/convertPrice";
import { GrainContract } from "../entities/GrainContracts";
import { GrainContractFixationItem } from "../entities/GrainContractFixationItem";
import { AppDataSource } from "../../database/data-source";
import PdfGeneratorNew from "../../pdfGenerator";
import { EmailLogRepository } from "../repositories/EmailLogRepository";
import { folhaDeRostoBuffer } from "../../pdfGenerator/helpers/coverPage";

const signatureEmailImageSoy = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_execucao_mi.png"
);

const signatureEmailImageOil = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_oleo.png"
);

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isZeroLikeValue(value: number | string | null | undefined): boolean {
  if (value === null || value === undefined) return false;

  const raw = String(value).trim();
  if (!raw) return false;

  const onlyDigits = raw.replace(/\D/g, "");
  return onlyDigits.length > 0 && Number(onlyDigits) === 0;
}

function resolveQuantityForFinancialCalc(
  finalQuantity: number | string | null | undefined,
  quantity: number | string
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

function roundCurrencyValue(value: number): number {
  return Math.round(value * 100) / 100;
}

export class GrainFixationContractController {
  createFixationContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { product, quantity } = req.body;

      if (!product) {
        return res.status(400).json({ message: "Produto não informado." });
      }

      if (!quantity) {
        return res.status(400).json({ message: "Quantidade é obrigatória." });
      }

      // Comissão "Percentual" pode ser selecionada normalmente na criação,
      // igual ao fluxo MI — só o cálculo do valor fica pendente (fica null)
      // até a primeira fixação real ser lançada, que é quando total_contract_value
      // passa a existir (ver addFixationItem, que já trata esse caso).

      const numberContract = await generateNumberFixationContract(req.body);
      const initialFinalQuantity = resolveQuantityForFinancialCalc(
        req.body.final_quantity,
        req.body.quantity
      );

      let commissionSellerContract: number | null = null;
      let commissionBuyerContract: number | null = null;

      // Comissão "Percentual" depende de total_contract_value, que ainda não
      // existe na criação — fica null (pendente) até a primeira fixação real
      // (ver addFixationItem). Fixo/Por Saca/Por TM não dependem de preço e já
      // podem ser calculados agora.
      if (
        req.body.commission_seller &&
        req.body.type_commission_seller !== "Percentual"
      ) {
        const sellerCurrency =
          req.body.type_commission_seller_currency ||
          (req.body.type_currency === "Dólar" ? "Dólar" : "BRL");
        const sellerRate =
          req.body.commission_seller_exchange_rate ||
          (sellerCurrency === "Dólar" ? req.body.day_exchange_rate : undefined);

        commissionSellerContract = roundCurrencyValue(
          calcCommissionBySack(
            req.body.quantity,
            req.body.type_quantity,
            req.body.commission_seller,
            req.body.type_commission_seller,
            sellerCurrency,
            sellerRate,
            undefined
          )
        );
      }

      if (
        req.body.commission_buyer &&
        req.body.type_commission_buyer !== "Percentual"
      ) {
        const buyerCurrency =
          req.body.type_commission_buyer_currency ||
          (req.body.type_currency === "Dólar" ? "Dólar" : "BRL");
        const buyerRate =
          req.body.commission_buyer_exchange_rate ||
          (buyerCurrency === "Dólar" ? req.body.day_exchange_rate : undefined);

        commissionBuyerContract = roundCurrencyValue(
          calcCommissionBySack(
            req.body.quantity,
            req.body.type_quantity,
            req.body.commission_buyer,
            req.body.type_commission_buyer,
            buyerCurrency,
            buyerRate,
            undefined
          )
        );
      }

      let finalCommissionContract: number | null = null;
      if (
        commissionSellerContract !== null &&
        commissionBuyerContract !== null
      ) {
        finalCommissionContract = null;
      } else if (commissionSellerContract !== null) {
        finalCommissionContract = commissionSellerContract;
      } else if (commissionBuyerContract !== null) {
        finalCommissionContract = commissionBuyerContract;
      }

      const fixationContract = grainFixationContractRepository.create({
        ...req.body,
        number_contract: numberContract,
        final_quantity: initialFinalQuantity,
        status_received: "Não",
        type_contract: "AF",
        // "price" aqui (se informado) é só um preço de referência inicial —
        // não conta como fixação, não gera item de fixação e não afeta
        // total_contract_value/average_fixed_price/fixation_status. Uma vez
        // que a primeira fixação de verdade for lançada, este campo passa a
        // refletir o preço médio ponderado das fixações (ver addFixationItem).
        price: req.body.price ?? null,
        total_contract_value: null,
        fixation_status: "Pendente",
        fixed_quantity: 0,
        average_fixed_price: null,
        commission_contract: finalCommissionContract,
        commission_seller_contract_value: commissionSellerContract,
        commission_buyer_contract_value: commissionBuyerContract,
      });

      const result = (await grainFixationContractRepository.save(
        fixationContract
      )) as unknown as GrainContract;

      // Na criacao, quantidade final deve espelhar a quantidade do contrato.
      if (
        isZeroLikeValue(result.final_quantity) &&
        !isZeroLikeValue(result.quantity)
      ) {
        result.final_quantity = result.quantity;
        await grainFixationContractRepository.save(result);
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
          `${dateIso}T${hourStr}:${minStr}:${secStr}.${msStr}`
        );

        await grainFixationContractRepository.save(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getFixationContracts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const contracts = await grainFixationContractRepository.find({
        where: { type_contract: "AF" },
      });
      return res.json(contracts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getFixationContractById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      const contract = await grainFixationContractRepository.findOne({
        where: { id, type_contract: "AF" },
      });
      if (!contract) {
        return res
          .status(404)
          .json({ message: "Contrato a fixar não encontrado." });
      }

      const fixationItems = await grainContractFixationItemRepository.find({
        where: { fixation_contract_id: id },
        order: { fixation_date: "ASC" },
      });

      return res.json({ ...contract, fixation_items: fixationItems });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateFixationContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    // Campos derivados do ciclo de fixação só podem mudar via addFixationItem.
    const {
      price,
      total_contract_value,
      fixed_quantity,
      average_fixed_price,
      fixation_status,
      ...otherFields
    } = req.body;

    try {
      const contract = await grainFixationContractRepository.findOneBy({
        id,
        type_contract: "AF",
      });
      if (!contract) {
        return res
          .status(404)
          .json({ message: "Contrato a fixar não encontrado." });
      }

      // Contrato "a fixar" usa o mesmo formato de número do MI (sem marcador
      // "F" — esse marcador só existe nas fixações, ver addFixationItem).
      // O marcador "F" opcional aqui é só para compatibilidade com contratos
      // "a fixar" criados antes dessa mudança (formato antigo, mantido como está).
      const validNumberContract = /^([A-Z]+)\.([A-Z0-9]+)-(F?)(\d{3})\/(\d{2})$/;
      const match = contract.number_contract.match(validNumberContract);

      if (match) {
        const [
          ,
          currentProduct,
          currentBroker,
          legacyMarker,
          currentIncrement,
          currentYear,
        ] = match;

        const isProductDifferent =
          otherFields.product && otherFields.product !== currentProduct;
        const isBrokerDifferent =
          otherFields.number_broker &&
          otherFields.number_broker !== currentBroker;

        if (isProductDifferent || isBrokerDifferent) {
          const updatedProduct = isProductDifferent
            ? otherFields.product
            : currentProduct;
          const updatedBroker = isBrokerDifferent
            ? otherFields.number_broker
            : currentBroker;

          const listProducts = ["O", "OC", "OA", "SB", "EP"];
          const siglaProduct = listProducts.includes(updatedProduct)
            ? "O"
            : updatedProduct;

          contract.number_contract = `${siglaProduct}.${updatedBroker}-${legacyMarker}${currentIncrement}/${currentYear}`;
          contract.number_broker = updatedBroker;
          contract.product = updatedProduct;
        }
      } else {
        return res
          .status(400)
          .json({ message: "Formato do número do contrato a fixar inválido." });
      }

      const finalQuantity =
        otherFields.final_quantity !== undefined
          ? resolveQuantityForFinancialCalc(
              otherFields.final_quantity,
              otherFields.quantity ?? contract.quantity
            )
          : contract.final_quantity;

      const mergedData = {
        ...contract,
        ...otherFields,
        id: contract.id,
        number_contract: contract.number_contract,
        number_broker: contract.number_broker,
        product: contract.product,
        final_quantity: finalQuantity,
      } as GrainContract;

      grainFixationContractRepository.merge(contract, mergedData);
      const result = await grainFixationContractRepository.save(contract);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteFixationContract = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      let contract = await grainFixationContractRepository.findOneBy({
        id,
        type_contract: "AF",
      });
      if (!contract) {
        return res
          .status(404)
          .json({ message: "Contrato a fixar não encontrado." });
      }
      contract = grainFixationContractRepository.merge(contract, req.body);
      const result = await grainFixationContractRepository.save(contract);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  listFixationItems = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      const items = await grainContractFixationItemRepository.find({
        where: { fixation_contract_id: id },
        order: { fixation_date: "ASC" },
      });
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // Lista, entre todos os contratos a fixar, as fixações que ainda não foram
  // enviadas por e-mail — usado pela tela "Enviar Contratos" para mesclar
  // fixações junto com os contratos MI na mesma listagem de envio.
  listPendingFixationItems = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const items = await grainContractFixationItemRepository.find({
        where: { email_sent: false },
        order: { fixation_date: "ASC" },
      });

      if (!items.length) {
        return res.json([]);
      }

      const contractIds = [
        ...new Set(items.map((item) => item.fixation_contract_id)),
      ];
      const contracts = await grainFixationContractRepository.findBy({
        id: In(contractIds),
      });
      const contractsById = new Map(
        contracts.map((contract) => [contract.id, contract])
      );

      const merged = items.map((item) => {
        const contract = contractsById.get(item.fixation_contract_id);
        return {
          ...item,
          parent_number_contract: contract?.number_contract,
          seller: contract?.seller,
          buyer: contract?.buyer,
          list_email_seller: contract?.list_email_seller,
          list_email_buyer: contract?.list_email_buyer,
          contract_emission_date: contract?.contract_emission_date,
        };
      });

      return res.json(merged);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // Só permite atualizar os metadados do PDF de confirmação gerado no front-end
  // (o arquivo em si não é armazenado no backend, é regerado sob demanda).
  updateFixationItemPdfMetadata = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { itemId } = req.params;
    const { pdf_file_name, pdf_file_size_kb, pdf_pages } = req.body;

    try {
      const item = await grainContractFixationItemRepository.findOneBy({
        id: itemId,
      });
      if (!item) {
        return res
          .status(404)
          .json({ message: "Fixação não encontrada." });
      }

      item.pdf_file_name = pdf_file_name;
      item.pdf_file_size_kb = pdf_file_size_kb;
      item.pdf_pages = pdf_pages;

      const result = await grainContractFixationItemRepository.save(item);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  addFixationItem = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      quantity,
      fixation_date,
      reference_month,
      cbot_code,
      cbot_value,
      premium,
      conversion_factor,
      fobbings,
      exchange_rate,
      exchange_rate_date,
      created_by_name,
      created_by_email,
    } = req.body;

    // Todos os insumos da fórmula de fixação (CBOT + prêmio + câmbio) são
    // sempre digitados pelo usuário — não há valor padrão/constante.
    const toNumber = (value: unknown): number =>
      Number(String(value ?? "").replace(",", "."));

    try {
      if (!quantity || toNumber(quantity) <= 0) {
        return res
          .status(400)
          .json({ message: "Quantidade da fixação deve ser maior que zero." });
      }

      if (!fixation_date) {
        return res
          .status(400)
          .json({ message: "Data da fixação é obrigatória." });
      }

      if (cbot_value === undefined || cbot_value === null || cbot_value === "") {
        return res.status(400).json({ message: "CBOT é obrigatório." });
      }

      if (premium === undefined || premium === null || premium === "") {
        return res.status(400).json({ message: "Prêmio é obrigatório." });
      }

      if (!conversion_factor || toNumber(conversion_factor) <= 0) {
        return res
          .status(400)
          .json({ message: "Fator de conversão (t/m) deve ser maior que zero." });
      }

      if (fobbings === undefined || fobbings === null || fobbings === "") {
        return res.status(400).json({ message: "Fobbings/tm é obrigatório." });
      }

      if (!exchange_rate || toNumber(exchange_rate) <= 0) {
        return res
          .status(400)
          .json({ message: "Câmbio é obrigatório." });
      }

      if (!reference_month) {
        return res
          .status(400)
          .json({ message: "Mês de referência é obrigatório." });
      }

      const result = await AppDataSource.transaction(async (manager) => {
        const fixationContractRepo = manager.getRepository(GrainContract);
        const fixationItemRepo = manager.getRepository(
          GrainContractFixationItem
        );

        const contract = await fixationContractRepo.findOneBy({
          id,
          type_contract: "AF",
        });
        if (!contract) {
          throw new HttpError(404, "Contrato a fixar não encontrado.");
        }

        const existingItems = await fixationItemRepo.find({
          where: { fixation_contract_id: id },
        });
        const alreadyFixedQuantity = existingItems.reduce(
          (sum, item) => sum + Number(item.quantity),
          0
        );

        const quantityNum = Number(String(quantity).replace(",", "."));
        const totalContractQuantity = Number(
          resolveQuantityForFinancialCalc(
            contract.final_quantity,
            contract.quantity
          )
        );

        if (alreadyFixedQuantity + quantityNum > totalContractQuantity + 0.001) {
          const saldo = Math.max(
            totalContractQuantity - alreadyFixedQuantity,
            0
          );
          throw new HttpError(
            400,
            `Quantidade excede o saldo do contrato. Saldo disponível: ${saldo.toFixed(
              3
            )}.`
          );
        }

        // Fórmula do "Aditivo Contratual — Fixação de CBOT, Prêmio e Câmbio":
        // PPE (USD/tonelada) = (CBOT + Prêmio) x Fator Conv - Fobbings/tm
        // Preço/saca (USD)   = PPE / 16,6667   (1 tonelada = 1000/60 sacas)
        // Preço/saca (BRL)   = Preço/saca (USD) x Câmbio
        const cbotValueNum = toNumber(cbot_value);
        const premiumNum = toNumber(premium);
        const conversionFactorNum = toNumber(conversion_factor);
        const fobbingsNum = toNumber(fobbings);
        const exchangeRateNum = toNumber(exchange_rate);

        const ppeUsd =
          (cbotValueNum + premiumNum) * conversionFactorNum - fobbingsNum;
        const priceUsdPerSaca = ppeUsd / (1000 / 60);
        const priceBrlPerSaca = roundCurrencyValue(
          priceUsdPerSaca * exchangeRateNum
        );

        const itemValue = roundCurrencyValue(
          calculateTotalContractValue(
            contract.product,
            quantityNum,
            priceBrlPerSaca,
            "Real",
            undefined,
            contract.type_quantity
          )
        );

        // Cada fixação é gerada como um "contrato" próprio: número do contrato
        // pai (mesmo formato/sequência do MI) + marcador "F" e sequencial de
        // 2 dígitos (ex.: "S.007-001/26-F01"), sempre único.
        const lastSeq = existingItems.reduce((max, item) => {
          const match = item.number_contract?.match(/-F(\d+)$/);
          const seq = match ? parseInt(match[1], 10) : 0;
          return Math.max(max, seq);
        }, 0);
        const fixationNumberContract = `${contract.number_contract}-F${String(
          lastSeq + 1
        ).padStart(2, "0")}`;

        const newItem = fixationItemRepo.create({
          fixation_contract_id: id,
          number_contract: fixationNumberContract,
          quantity: quantityNum,
          price: priceBrlPerSaca,
          type_currency: "Real",
          exchange_rate: String(exchangeRateNum),
          exchange_rate_date,
          fixation_date,
          reference_month,
          cbot_code,
          cbot_value: cbotValueNum,
          premium: premiumNum,
          conversion_factor: conversionFactorNum,
          fobbings: fobbingsNum,
          ppe_usd: roundCurrencyValue(ppeUsd),
          price_usd_per_saca: roundCurrencyValue(priceUsdPerSaca),
          item_value: itemValue,
          created_by_name,
          created_by_email,
        });

        await fixationItemRepo.save(newItem);

        const allItems = [...existingItems, newItem];
        const fixedQuantity = allItems.reduce(
          (sum, item) => sum + Number(item.quantity),
          0
        );
        const totalContractValue = roundCurrencyValue(
          allItems.reduce((sum, item) => sum + Number(item.item_value || 0), 0)
        );
        // Preço médio ponderado por quantidade, na mesma unidade em que o preço
        // é digitado (por saca/TM, conforme type_quantity) — NÃO é
        // totalContractValue/fixedQuantity, pois totalContractValue já é o valor
        // monetário total (quantidade/divisor * preço), não um valor "por kg".
        const weightedPriceSum = allItems.reduce((sum, item) => {
          const convertedItemPrice = convertPrice(
            Number(item.price),
            item.type_currency,
            item.exchange_rate
          );
          return sum + convertedItemPrice * Number(item.quantity);
        }, 0);
        const averageFixedPrice =
          fixedQuantity > 0
            ? roundCurrencyValue(weightedPriceSum / fixedQuantity)
            : null;

        let fixationStatus = "Pendente";
        if (fixedQuantity > 0 && fixedQuantity >= totalContractQuantity - 0.001) {
          fixationStatus = "Fixado";
        } else if (fixedQuantity > 0) {
          fixationStatus = "Parcial";
        }

        let commissionSellerContractValue =
          contract.commission_seller_contract_value;
        let commissionBuyerContractValue =
          contract.commission_buyer_contract_value;

        // Comissão percentual só pode ser calculada depois que existe total_contract_value.
        if (contract.type_commission_seller === "Percentual" && contract.commission_seller) {
          commissionSellerContractValue = roundCurrencyValue(
            calcCommissionBySack(
              fixedQuantity,
              contract.type_quantity,
              contract.commission_seller,
              "Percentual",
              "",
              undefined,
              totalContractValue
            )
          );
        }

        if (contract.type_commission_buyer === "Percentual" && contract.commission_buyer) {
          commissionBuyerContractValue = roundCurrencyValue(
            calcCommissionBySack(
              fixedQuantity,
              contract.type_quantity,
              contract.commission_buyer,
              "Percentual",
              "",
              undefined,
              totalContractValue
            )
          );
        }

        let commissionContract: number | null = contract.commission_contract;
        if (
          commissionSellerContractValue !== null &&
          commissionSellerContractValue !== undefined &&
          commissionBuyerContractValue !== null &&
          commissionBuyerContractValue !== undefined
        ) {
          commissionContract = null;
        } else if (
          commissionSellerContractValue !== null &&
          commissionSellerContractValue !== undefined
        ) {
          commissionContract = commissionSellerContractValue;
        } else if (
          commissionBuyerContractValue !== null &&
          commissionBuyerContractValue !== undefined
        ) {
          commissionContract = commissionBuyerContractValue;
        }

        contract.fixed_quantity = fixedQuantity;
        contract.total_contract_value = totalContractValue;
        contract.average_fixed_price = averageFixedPrice;
        contract.price = averageFixedPrice;
        contract.fixation_status = fixationStatus;
        contract.commission_contract = commissionContract;
        contract.commission_seller_contract_value = commissionSellerContractValue;
        contract.commission_buyer_contract_value = commissionBuyerContractValue;

        const updatedContract = await fixationContractRepo.save(contract);

        return { contract: updatedContract, item: newItem };
      });

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  };

  // Envia o "Aditivo Contratual" de uma fixação por e-mail, usando os e-mails
  // salvos no contrato PAI (list_email_seller/list_email_buyer) — a fixação em
  // si não tem lista de e-mails própria.
  sendFixationEmail = async (req: Request, res: Response): Promise<Response> => {
    const { id, itemId } = req.params;
    const { sender, list_email_seller, list_email_buyer } = req.body;

    try {
      const contract = await grainFixationContractRepository.findOneBy({
        id,
        type_contract: "AF",
      });
      if (!contract) {
        return res
          .status(404)
          .json({ message: "Contrato a fixar não encontrado." });
      }

      const item = await grainContractFixationItemRepository.findOneBy({
        id: itemId,
        fixation_contract_id: id,
      });
      if (!item) {
        return res.status(404).json({ message: "Fixação não encontrada." });
      }

      // Permite sobrescrever, no momento do envio, as listas de e-mail salvas
      // no contrato pai (mesmo comportamento do fluxo MI, onde o Step de envio
      // deixa editar os destinatários antes de disparar).
      const emailsSeller: string[] =
        list_email_seller?.length ? list_email_seller : contract.list_email_seller;
      const emailsBuyer: string[] =
        list_email_buyer?.length ? list_email_buyer : contract.list_email_buyer;

      if (!emailsSeller?.length || !emailsBuyer?.length) {
        return res.status(400).json({
          message:
            "Contrato pai não possui e-mails de vendedor/comprador cadastrados.",
        });
      }

      const templateData = {
        seller: contract.seller,
        buyer: contract.buyer,
        number_contract: item.number_contract,
        parent_number_contract: contract.number_contract,
        contract_emission_date: contract.contract_emission_date,
        name_product: contract.name_product,
        crop: contract.crop,
        type_quantity: contract.type_quantity,
        number_external_contract_buyer: contract.number_external_contract_buyer,
        number_external_contract_seller: contract.number_external_contract_seller,
        quantity: item.quantity,
        fixation_date: item.fixation_date,
        reference_month: item.reference_month,
        cbot_code: item.cbot_code,
        cbot_value: item.cbot_value,
        premium: item.premium,
        conversion_factor: item.conversion_factor,
        fobbings: item.fobbings,
        ppe_usd: item.ppe_usd,
        price_usd_per_saca: item.price_usd_per_saca,
        price: item.price,
        exchange_rate: item.exchange_rate,
        exchange_rate_date: item.exchange_rate_date,
      };

      // Documento é o mesmo para as duas partes (não há cláusula de
      // comissão específica de vendedor/comprador no Aditivo), então um
      // único PDF é gerado e reaproveitado nos dois envios.
      const pdfBuffer = await PdfGeneratorNew({
        data: templateData,
        typeContract: "Vendedor",
        template: "contratoAditivoTemplate",
      });

      // Mesma regra de mesa/remetente/BCC do envio de contratos MI
      // (EmailController), duplicada aqui de propósito para manter o fluxo
      // de fixação isolado do fluxo de contratos original.
      const sigla = contract.number_contract.split(".")[0].toUpperCase();
      const group1 = ["S", "T", "SG", "CN"];
      const group2 = ["O", "OC", "OA", "SB", "EP"];
      const group3 = ["F"];

      const isLocal = process.env.BLOCK_SENDER_EMAIL_LOCAL === "true";

      let signatureFileName = "";
      let signatureEmailImage = "";
      let smtpUser = process.env.SMTP_USER!;
      let smtpPass = process.env.SMTP_PASS!;
      let bccEmails: string[] = [];

      if (group1.includes(sigla)) {
        signatureFileName = "assinatura_execucao_mi.png";
        signatureEmailImage = signatureEmailImageSoy;
        smtpUser = process.env.SMTP_SOY_USER!;
        smtpPass = process.env.SMTP_SOY_PASS!;
        bccEmails = isLocal
          ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
          : [
              "exec-mi@aryoleofar.com.br",
              "evandro@aryoleofar.com.br",
              "gilberto@aryoleofar.com.br",
              "talita@aryoleofar.com.br",
              "elcio@aryoleofar.com.br",
            ];
      } else if (group2.includes(sigla)) {
        signatureFileName = "assinatura_oleo.png";
        signatureEmailImage = signatureEmailImageOil;
        smtpUser = process.env.SMTP_OIL_USER!;
        smtpPass = process.env.SMTP_OIL_PASS!;
        bccEmails = isLocal
          ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
          : [
              "ary@aryoleofar.com.br",
              "beto@aryoleofar.com.br",
              "nilo@aryoleofar.com.br",
              "renan@aryoleofar.com.br",
              "gustavo@aryoleofar.com.br",
            ];
      } else if (group3.includes(sigla)) {
        signatureFileName = "assinatura_oleo.png";
        signatureEmailImage = signatureEmailImageOil;
        smtpUser = process.env.SMTP_OIL_USER!;
        smtpPass = process.env.SMTP_OIL_PASS!;
        bccEmails = isLocal
          ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
          : [
              "ary@aryoleofar.com.br, mauro@aryoleofar.com.br, joseph@aryoleofar.com.br",
            ];
      }

      const nameSeller = (contract.seller as any)?.nickname
        ? (contract.seller as any).nickname
        : (contract.seller as any)?.name;
      const nameBuyer = (contract.buyer as any)?.nickname
        ? (contract.buyer as any).nickname
        : (contract.buyer as any)?.name;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const subject = `Fixação ${item.number_contract} - Aditivo ao contrato ${contract.number_contract} - ${nameSeller} (X) ${nameBuyer}`;
      const buildHtml = (partyName: string) => `
        <div style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;">
          <div style="margin-left: 20px;">
            <p>Para ${partyName}</p>
            <p>Segue anexo o Aditivo Contratual referente à fixação ${item.number_contract}, do contrato ${contract.number_contract}.<p>
            <p>Solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve possível.</p>

            <p>Agradecemos e nos colocamos à disposição.</p>
            <br/>

            <p style="margin-bottom: 4px;">Saudações,</p>
          </div>
          <img src="cid:assinaturaemail" alt="Assinatura" style="max-width: 200px; height: auto; display: block;" />
          <br/>

          <div style="padding-left: 10px;">
            <small style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;">Este aditivo foi criado e enviado via sistema, pedimos a gentileza que confirme o recebimento.</small>
          </div>
        </div>`;

      const attachments = [
        {
          filename: `aditivo_fixacao_${item.number_contract}.pdf`,
          content: pdfBuffer,
        },
        {
          filename: signatureFileName,
          path: signatureEmailImage,
          cid: "assinaturaemail",
        },
        {
          filename: `folha_de_rosto_${item.number_contract}.txt`,
          content: folhaDeRostoBuffer,
        },
      ];

      await transporter.sendMail({
        from: smtpUser,
        to: emailsSeller,
        bcc: [
          "'Aditivo Enviado do Sistema - Vendedor' <suportearyoleofar@gmail.com>",
          ...bccEmails,
        ],
        subject,
        text: `Segue o aditivo de fixação ${item.number_contract} em anexo.`,
        html: buildHtml(nameSeller),
        attachments,
      });

      await transporter.sendMail({
        from: smtpUser,
        to: emailsBuyer,
        bcc: [
          "'Aditivo Enviado do Sistema - Comprador' <suportearyoleofar@gmail.com>",
          ...bccEmails,
        ],
        subject,
        text: `Segue o aditivo de fixação ${item.number_contract} em anexo.`,
        html: buildHtml(nameBuyer),
        attachments,
      });

      item.email_sent = true;
      item.email_sent_at = new Date();
      await grainContractFixationItemRepository.save(item);

      await EmailLogRepository.save({
        email_sender: sender,
        number_contract: item.number_contract,
        sent_at: new Date(),
      });

      return res.status(200).json({ message: "E-mails enviados com sucesso!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
