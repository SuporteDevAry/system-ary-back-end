import { DataSource } from "typeorm";
import { ProductTable } from "../../app/entities/ProductsTable";


export async function seedProductTables(dataSource: DataSource) {
  const productTableRepository = dataSource.getRepository(ProductTable);

  const tables = [
    {
      name: "Soja",
      product_types: ["S", "T", "SG", "CN"],
    },
    {
      name: "Óleo",
      product_types: ["O", "OC", "OA", "SB", "EP"],
    },
    {
      name: "Farelo",
      product_types: ["F"],
    },
  ];

  for (const table of tables) {
    const exists = await productTableRepository.findOneBy({ name: table.name });
    if (!exists) {
      const newTable = productTableRepository.create(table);
      await productTableRepository.save(newTable);
    }
  }

  console.log("✅ Seed de product_tables finalizada com sucesso!");
}
