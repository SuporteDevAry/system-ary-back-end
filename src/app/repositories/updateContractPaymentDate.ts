import { grainContractRepository } from "./GrainContractRepository";

export async function updateContractPaymentDate(
  number_contract: string,
  receipt_date: string,
) {
  // Busca o contrato pelo número
  const contract = await grainContractRepository.findOneBy({ number_contract });
  if (!contract) return;

  // Atualiza a data de pagamento
  contract.payment_date = receipt_date;
  await grainContractRepository.save(contract);
}
