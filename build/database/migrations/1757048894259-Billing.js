"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Billing1757048894259 = void 0;
const typeorm_1 = require("typeorm");
class Billing1757048894259 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("billings");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "billings",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "number_contract",
                        type: "varchar",
                    },
                    {
                        name: "product_name",
                        type: "varchar",
                    },
                    {
                        name: "number_broker",
                        type: "varchar",
                    },
                    {
                        name: "year",
                        type: "varchar",
                    },
                    {
                        name: "receipt_date",
                        type: "varchar",
                    },
                    {
                        name: "internal_receipt_number",
                        type: "varchar",
                    },
                    {
                        name: "rps_number",
                        type: "varchar",
                    },
                    {
                        name: "nfs_number",
                        type: "varchar",
                    },
                    {
                        name: "total_service_value",
                        type: "decimal",
                    },
                    {
                        name: "irrf_value",
                        type: "decimal",
                    },
                    {
                        name: "adjustment_value",
                        type: "decimal",
                    },
                    {
                        name: "liquid_value",
                        type: "decimal",
                    },
                    {
                        name: "liquid_contract",
                        type: "varchar",
                    },
                    {
                        name: "expected_receipt_date",
                        type: "varchar",
                    },
                    {
                        name: "liquid_contract_date",
                        type: "varchar",
                    },
                    {
                        name: "owner_record",
                        type: "varchar",
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
        const hasTable = await queryRunner.hasTable("billings");
        if (hasTable) {
            await queryRunner.dropTable("billings");
        }
    }
}
exports.Billing1757048894259 = Billing1757048894259;
//# sourceMappingURL=1757048894259-Billing.js.map