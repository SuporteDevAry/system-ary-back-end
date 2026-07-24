"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProductTables = void 0;
const ProductsTable_1 = require("../../app/entities/ProductsTable");
async function seedProductTables(dataSource) {
    const productTableRepository = dataSource.getRepository(ProductsTable_1.ProductTable);
    const tables = [
        {
            name: "GRÃOS",
            product_types: ["S", "T", "SG", "CN"],
        },
        {
            name: "ÓLEO",
            product_types: ["O", "OC", "OA", "SB", "EP"],
        },
        {
            name: "FARELO",
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
exports.seedProductTables = seedProductTables;
//# sourceMappingURL=SeedProductsTables.js.map