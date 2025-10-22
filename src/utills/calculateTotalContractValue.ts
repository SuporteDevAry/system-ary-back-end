export function calculateTotalContractValue(
  product: string,
  quantity: number | string,
  price: number | string
): number {
  const validProducts = ["O", "F", "OC", "OA", "SB", "EP"];
  const quantityNumber = Number(quantity);
  const priceNumber = Number(price);

  const quantityTon = validProducts.includes(product)
    ? quantityNumber / 1
    : quantityNumber / 1000;

  const totalContractValue = validProducts.includes(product)
    ? quantityTon * priceNumber
    : (quantityNumber / 60) * priceNumber;

  return totalContractValue;
}
