import { GrainContract } from "../entities/GrainContracts";
import { AppDataSource } from "../../database/data-source";
import { ProductTable } from "../entities/ProductsTable";

export const grainContractRepository =
  AppDataSource.getRepository(GrainContract);

const productTableRepository = AppDataSource.getRepository(ProductTable);

export const generateNumberContract = async (
  data: Partial<GrainContract>
): Promise<string> => {
  const { product, number_broker } = data;
  const currentYear = new Date().getFullYear().toString().slice(-2); // Pega os dois últimos dígitos do ano

  if (!product) {
    throw new Error("Produto não informado.");
  }

  // Buscar a mesa que contenha esse produto
  const productTable = await productTableRepository
    .createQueryBuilder("table")
    .where(":product = ANY(table.product_types)", { product })
    .getOne();

  if (!productTable) {
    throw new Error(`Produto ${product} não pertence a nenhuma mesa.`);
  }

  const productsInGroup = productTable.product_types;

  // Só iremos remover essa regra das siglas, caso o cliente aceite a sugestão da reunião do dia 09/04/2025
  const listProducts = ["O", "OC", "OA", "SB", "EP"];
  const validProducts = listProducts.includes(product);
  const siglaProduct = validProducts ? "O" : product;

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
    const numberContract = `${siglaProduct}.${number_broker}-${formattedIncrement}/${currentYear}`;

    return numberContract;
  } catch (error) {
    console.error("Erro ao gerar o número do contrato:", error);
    throw new Error("Erro ao gerar o número do contrato.");
  }
};
