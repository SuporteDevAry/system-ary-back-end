"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsTable1754444551923 = void 0;
const typeorm_1 = require("typeorm");
class ProductsTable1754444551923 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("product_tables");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "product_tables",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "product_types",
                        type: "text",
                        isArray: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("product_tables");
        if (hasTable) {
            await queryRunner.dropTable("product_tables");
        }
    }
}
exports.ProductsTable1754444551923 = ProductsTable1754444551923;
//# sourceMappingURL=1754444551923-productsTable.js.map