"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommissionCurrencyFields1769793476443 = void 0;
const typeorm_1 = require("typeorm");
class AddCommissionCurrencyFields1769793476443 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const columnsToAdd = [
                new typeorm_1.TableColumn({
                    name: "type_commission_seller_currency",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "commission_seller_exchange_rate",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "type_commission_buyer_currency",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "commission_buyer_exchange_rate",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "commission_seller_contract_value",
                    type: "decimal",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "commission_buyer_contract_value",
                    type: "decimal",
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
                "type_commission_seller_currency",
                "commission_seller_exchange_rate",
                "type_commission_buyer_currency",
                "commission_buyer_exchange_rate",
                "commission_seller_contract_value",
                "commission_buyer_contract_value",
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
exports.AddCommissionCurrencyFields1769793476443 = AddCommissionCurrencyFields1769793476443;
//# sourceMappingURL=1769793476443-AddCommissionCurrencyFields.js.map