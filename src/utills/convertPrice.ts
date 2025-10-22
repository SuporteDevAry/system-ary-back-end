export function convertPrice(
  price: number | string,
  typeCurrency: string,
  dayExchangeRate?: number | string
): number {
  const priceNumber = Number(price);

  if (typeCurrency === "Dólar" && dayExchangeRate) {
    return Number((priceNumber * Number(dayExchangeRate)).toFixed(2));
  }

  return priceNumber;
}
