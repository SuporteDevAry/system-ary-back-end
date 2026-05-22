import { grainContractRepository } from "./GrainContractRepository";

export async function updateContractCommissionReceiptDate(
  number_contract: string,
  commission_receipt_date: string,
) {
  // Busca o contrato pelo número
  const contract = await grainContractRepository.findOneBy({ number_contract });
  if (!contract) return;

  // Atualiza a data de recebimento da comissão
  contract.commission_receipt_date = commission_receipt_date;
  await grainContractRepository.save(contract);
}
