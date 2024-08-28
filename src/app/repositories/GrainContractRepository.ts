import { GrainContract } from "../entities/GrainContracts";
import { AppDataSource } from "../../database/data-source";

export const grainContractRepository =
  AppDataSource.getRepository(GrainContract);

export const generateNumberContract = async (
  data: Partial<GrainContract>
): Promise<string> => {
  const { product, number_broker } = data;
  const currentYear = new Date().getFullYear().toString().slice(-2); // Últimos dois dígitos do ano atual

  // Consulta SQL para obter o último número de contrato do ano atual
  const query = `
      SELECT number_contract
      FROM grain_contracts
      WHERE number_contract LIKE '%-%/${currentYear}'
      ORDER BY created_at DESC
      LIMIT 1
    `;

  try {
    const result = await grainContractRepository.query(query);

    let nextIncrement = 1; // Valor inicial de incremento

    if (result.length > 0) {
      const lastNumberContract = result[0].number_contract;

      // Extrai o número entre '-' e '/' do último número de contrato usando regex
      const match = lastNumberContract.match(/-(\d{2})\//);

      if (match && match[1]) {
        nextIncrement = parseInt(match[1], 10) + 1; // Incrementa o número extraído
      }
    }

    const formattedIncrement = nextIncrement.toString().padStart(2, "0"); // Formata com zero à esquerda
    const numberContract = `${product}.${number_broker}-${formattedIncrement}/${currentYear}`; // Novo número de contrato

    return numberContract; // Retorna o número do contrato gerado
  } catch (error) {
    console.error("Erro ao gerar o número do contrato:", error);
    throw new Error("Erro ao gerar o número do contrato.");
  }
};
