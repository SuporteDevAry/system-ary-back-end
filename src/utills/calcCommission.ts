// src/utils/calcCommission.ts
export function calcCommission(contract: any): number {
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
    typeof commission === "string" ? commission.replace(",", ".") : commission
  );

  // Calcula a comissão
  const commissionValue =
    typeCommission === "Percentual"
      ? (total * commissionNumber) / 100
      : commissionNumber; // Surgirá a mudança que a comissao pode ser valor por saca, hoje é só valor cheio.

  return commissionValue;
}
