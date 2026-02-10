import { convertPrice } from "./convertPrice";

export function calculateTotalContractValue(
  product: string,
  quantity: number | string,
  price: number | string,
  typeCurrency?: string,
  dayExchangeRate?: number | string,
  typeQuantity?: string,
): number {
  const normalizeNumber = (
    value: number | string,
    preferDecimalDot: boolean,
  ): number => {
    const raw = String(value).trim();
    if (!raw) {
      return Number.NaN;
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
  const quantityNumber = normalizeNumber(quantity, false);
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
    const quantityType = typeQuantity.toLowerCase();
    if (
      quantityType === "tm" ||
      quantityType === "toneladas" ||
      quantityType === "tonelada" ||
      quantityType === "toneladas métricas"
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
