export function calcCommission(contract: any): number {
  // Prioridade 1: Verificar se há comissão de vendedor calculada por saca
  if (
    contract.commission_seller_contract_value !== null &&
    contract.commission_seller_contract_value !== undefined
  ) {
    return Number(contract.commission_seller_contract_value);
  }

  // Prioridade 2: Verificar se há comissão de comprador calculada por saca
  if (
    contract.commission_buyer_contract_value !== null &&
    contract.commission_buyer_contract_value !== undefined
  ) {
    return Number(contract.commission_buyer_contract_value);
  }

  // Fallback: Cálculo padrão usando a comissão percentual/fixa antiga
  // Converte o valor total em número
  const totalValue =
    typeof contract.total_contract_value === "string"
      ? Number(contract.total_contract_value.replace(/[,]/g, "."))
      : Number(contract.total_contract_value);

  const total = Number(totalValue);

  // Decide qual comissão usar: seller tem prioridade, senão buyer
  const commission =
    contract.commission_seller || contract.commission_buyer || 0;

  const typeCommission =
    contract.type_commission_seller || contract.type_commission_buyer || "";

  const commissionNumber = Number(
    typeof commission === "string" ? commission.replace(",", ".") : commission,
  );

  // Calcula a comissão
  const commissionValue =
    typeCommission === "Percentual"
      ? (total * commissionNumber) / 100
      : commissionNumber;

  return commissionValue;
}
