export function convertPrice(
  price: number | string,
  typeCurrency?: string,
  dayExchangeRate?: number | string,
): number {
  const priceNumber = Number(price);

  if (typeCurrency === "Dólar" && dayExchangeRate) {
    const normalizeRate = (value: number | string): number => {
      const raw = String(value).trim();
      if (!raw) {
        return Number.NaN;
      }

      if (raw.includes(",")) {
        return Number(raw.replace(/\./g, "").replace(",", "."));
      }

      if (raw.includes(".")) {
        return Number(raw);
      }

      return Number(raw);
    };

    const rateNumber = normalizeRate(dayExchangeRate);

    return Number((priceNumber * rateNumber).toFixed(2));
  }

  return priceNumber;
}
