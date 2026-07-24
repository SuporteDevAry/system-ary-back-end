"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReceiptFields1756778991841 = void 0;
const typeorm_1 = require("typeorm");
class AddReceiptFields1756778991841 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const columnsToAdd = [
                new typeorm_1.TableColumn({
                    name: "final_quantity",
                    type: "decimal",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "total_received",
                    type: "decimal",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "commission_contract",
                    type: "decimal",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "status_received",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "charge_date",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "expected_receipt_date",
                    type: "varchar",
                    isNullable: true,
                }),
            ];
            for (const column of columnsToAdd) {
                const hasColumn = await queryRunner.hasColumn("grain_contracts", column.name);
                if (!hasColumn) {
                    await queryRunner.addColumn("grain_contracts", column);
                }
            }
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const columnsToDrop = [
                "final_quantity",
                "total_received",
                "status_received",
                "charge_date",
                "expected_receipt_date",
            ];
            for (const columnName of columnsToDrop) {
                const hasColumn = await queryRunner.hasColumn("grain_contracts", columnName);
                if (hasColumn) {
                    await queryRunner.dropColumn("grain_contracts", columnName);
                }
            }
        }
    }
}
exports.AddReceiptFields1756778991841 = AddReceiptFields1756778991841;
//# sourceMappingURL=1756778991841-AddReceiptFields.js.map