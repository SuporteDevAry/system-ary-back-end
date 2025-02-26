import { GrainContract } from "../entities/GrainContracts";
import { AppDataSource } from "../../database/data-source";

export const grainContractRepository =
  AppDataSource.getRepository(GrainContract);

type ProductGroup = keyof typeof productGroups;

// Definição dos grupos
const productGroups = {
  group1: ["S", "T", "SG", "CN"],
  group2: ["O", "F"],
} as const;

// Função para determinar a qual grupo um produto pertence
const getProductGroup = (product: string): ProductGroup | null => {
  for (const [group, products] of Object.entries(productGroups) as unknown as [
    ProductGroup,
    string[]
  ][]) {
    if (products.includes(product)) {
      return group; // Retorna "group1" ou "group2"
    }
  }
  return null; // Retorna null se não encontrar o grupo
};

export const generateNumberContract = async (
  data: Partial<GrainContract>
): Promise<string> => {
  const { product, number_broker } = data;
  const currentYear = new Date().getFullYear().toString().slice(-2); // Pega os dois últimos dígitos do ano

  if (!product) {
    throw new Error("Produto não informado.");
  }

  const productGroup = getProductGroup(product);
  if (!productGroup) {
    throw new Error(`Produto ${product} não pertence a nenhum grupo.`);
  }

  // Obtém os produtos do grupo correspondente
  const productsInGroup = productGroups[productGroup];

  // Query para pegar o último número do contrato baseado no grupo
  const query = `
      SELECT number_contract
      FROM grain_contracts
      WHERE product = ANY($1)  -- Passando o array de produtos
      AND number_contract LIKE $2
      ORDER BY created_at DESC
      LIMIT 1
  `;

  try {
    const result = await grainContractRepository.query(query, [
      productsInGroup, // Passamos o array diretamente
      `%.%-%/${currentYear}`, // Formatação para incluir o ano
    ]);

    let nextIncrement = 1; // Começa do 001 se não houver contratos anteriores

    if (result.length > 0) {
      const lastNumberContract = result[0].number_contract;

      // Ajustar regex para extrair o número incremental
      const match = lastNumberContract.match(/-(\d{3})\/\d{2}$/);

      if (match && match[1]) {
        nextIncrement = parseInt(match[1], 10) + 1; // Incrementa o número extraído
      }
    }

    // Formatar o número do contrato
    const formattedIncrement = nextIncrement.toString().padStart(3, "0");
    const numberContract = `${product}.${number_broker}-${formattedIncrement}/${currentYear}`;

    return numberContract;
  } catch (error) {
    console.error("Erro ao gerar o número do contrato:", error);
    throw new Error("Erro ao gerar o número do contrato.");
  }
};
