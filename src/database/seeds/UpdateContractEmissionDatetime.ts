import { DataSource } from "typeorm";
import { GrainContract } from "../../app/entities/GrainContracts";

export async function updateContractEmissionDatetime(
  dataSource: DataSource
): Promise<void> {
  const grainContractRepository = dataSource.getRepository(GrainContract);

  try {
    console.log("Iniciando atualização de contract_emission_datetime...");

    // Busca todos os contratos que têm contract_emission_date mas faltam contract_emission_datetime
    const contracts = await grainContractRepository.find({
      where: { contract_emission_date: null },
    });

    console.log(`Encontrados ${contracts.length} contratos para atualizar...`);

    let updated = 0;
    let skipped = 0;

    for (const contract of contracts) {
      try {
        // Se já tem contract_emission_datetime, pula
        if (contract.contract_emission_datetime) {
          skipped++;
          continue;
        }

        // Se não tem contract_emission_date, não consegue processar
        if (!contract.contract_emission_date) {
          console.warn(
            `Contrato ${contract.id} não possui contract_emission_date`
          );
          skipped++;
          continue;
        }

        // Parse da data de emissão (formato DD/MM/YYYY)
        const dateStr = contract.contract_emission_date;
        const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        let dateIso = "";

        if (match) {
          // Converte para YYYY-MM-DD
          dateIso = `${match[3]}-${match[2]}-${match[1]}`;
        } else {
          // Tenta usar como está
          dateIso = dateStr;
        }

        // Pega a hora do created_at
        const createdAt = new Date(contract.created_at);
        const hourStr = createdAt.getHours().toString().padStart(2, "0");
        const minStr = createdAt.getMinutes().toString().padStart(2, "0");
        const secStr = createdAt.getSeconds().toString().padStart(2, "0");
        const msStr = createdAt.getMilliseconds().toString().padStart(3, "0");

        // Monta o datetime
        const datetimeStr = `${dateIso}T${hourStr}:${minStr}:${secStr}.${msStr}`;
        contract.contract_emission_datetime = new Date(datetimeStr);

        // Salva
        await grainContractRepository.save(contract);
        updated++;

        if (updated % 100 === 0) {
          console.log(`Atualizados ${updated} contratos...`);
        }
      } catch (error) {
        console.error(
          `Erro ao atualizar contrato ${contract.id}:`,
          error.message
        );
        skipped++;
      }
    }

    console.log(`
✅ Atualização concluída!
   - Atualizados: ${updated}
   - Pulados: ${skipped}
   - Total processado: ${updated + skipped}
    `);
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    throw error;
  }
}
