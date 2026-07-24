"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products1754078917113 = void 0;
const typeorm_1 = require("typeorm");
class Products1754078917113 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("products");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "product_type",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "commission_seller",
                        type: "varchar",
                    },
                    {
                        name: "type_commission_seller",
                        type: "varchar",
                    },
                    {
                        name: "quality",
                        type: "text",
                    },
                    {
                        name: "observation",
                        type: "text",
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
        const hasTable = await queryRunner.hasTable("products");
        if (hasTable) {
            await queryRunner.dropTable("products");
        }
    }
}
exports.Products1754078917113 = Products1754078917113;
//# sourceMappingURL=1754078917113-products.js.map