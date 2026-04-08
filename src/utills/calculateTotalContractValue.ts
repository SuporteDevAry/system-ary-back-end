import { convertPrice } from "./convertPrice";

export function calculateTotalContractValue(
  product: string,
  quantity: number | string,
  price: number | string,
  typeCurrency?: string,
  dayExchangeRate?: number | string,
  typeQuantity?: string,
): number {
  const isToneladaMetrica = (value?: string): boolean => {
    if (!value) return false;
    const quantityType = value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return (
      quantityType === "tm" ||
      quantityType === "toneladas" ||
      quantityType === "tonelada" ||
      quantityType === "toneladas metricas"
    );
  };

  const normalizeNumber = (
    value: number | string,
    preferDecimalDot: boolean,
    options?: { isQuantity?: boolean; typeQuantity?: string },
  ): number => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : Number.NaN;
    }

    const raw = String(value).trim();
    if (!raw) {
      return Number.NaN;
    }

    if (options?.isQuantity && isToneladaMetrica(options.typeQuantity)) {
      const hasComma = raw.includes(",");
      const hasDot = raw.includes(".");

      if (hasComma && !hasDot) {
        return Number(raw.replace(/\./g, "").replace(",", "."));
      }

      if (hasDot && !hasComma) {
        const parts = raw.split(".");

        // Mais de um ponto segue o formato brasileiro com separador de milhar.
        if (parts.length > 2) {
          return Number(raw.replace(/\./g, ""));
        }

        // Um unico ponto vindo do banco para TM representa casas decimais.
        // Ex.: "983.281" = 983 toneladas e 281 kg.
        return Number(raw);
      }
    }

    if (raw.includes(",")) {
      return Number(raw.replace(/\./g, "").replace(",", "."));
    }

    if (raw.includes(".")) {
      return preferDecimalDot ? Number(raw) : Number(raw.replace(/\./g, ""));
    }

    return Number(raw);
  };

  // Quantidade usa ponto como separador de milhares
  const quantityNumber = normalizeNumber(quantity, false, {
    isQuantity: true,
    typeQuantity,
  });
  // Preco usa ponto como separador decimal
  const priceNumber = normalizeNumber(price, true);

  const normalizedExchangeRate =
    dayExchangeRate !== undefined && dayExchangeRate !== null
      ? normalizeNumber(dayExchangeRate, true)
      : undefined;

  // Converte o preço se for em Dólar
  const convertedPrice = convertPrice(
    priceNumber,
    typeCurrency,
    normalizedExchangeRate,
  );

  // Determina o divisor baseado no tipo de quantidade
  // Kg (quilos) = divide por 60 (sacas)
  // Tm (toneladas métricas) = divide por 1 (não divide)
  let divisor = 60; // padrão: quilos
  if (typeQuantity) {
    const quantityType = typeQuantity
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (
      quantityType === "tm" ||
      quantityType === "toneladas" ||
      quantityType === "tonelada" ||
      quantityType === "toneladas metricas"
    ) {
      divisor = 1;
    }
  }

  // Calcula o valor total:
  // Kg = (Quantity/60) * price
  // Tm = (Quantity/1) * price
  const totalContractValue = (quantityNumber / divisor) * convertedPrice;

  return totalContractValue;
}
