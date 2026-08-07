import { grainContractRepository } from "./GrainContractRepository";

export async function updateContractPaymentDate(
  number_contract: string,
  receipt_date: string,
) {
  // Busca o contrato pelo número (só contratos "MI" recebem cobrança/faturamento hoje)
  const contract = await grainContractRepository.findOneBy({
    number_contract,
    type_contract: "MI",
  });
  if (!contract) return;

  // Atualiza a data de pagamento
  contract.payment_date = receipt_date;
  await grainContractRepository.save(contract);
}
