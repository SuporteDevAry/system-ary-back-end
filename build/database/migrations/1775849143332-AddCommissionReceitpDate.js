"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommissionReceitpDate1775849143332 = void 0;
const typeorm_1 = require("typeorm");
class AddCommissionReceitpDate1775849143332 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (!hasTable) {
            return;
        }
        const hasColumn = await queryRunner.hasColumn("grain_contracts", "commission_receipt_date");
        if (!hasColumn) {
            await queryRunner.addColumn("grain_contracts", new typeorm_1.TableColumn({
                name: "commission_receipt_date",
                type: "varchar",
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (!hasTable) {
            return;
        }
        const hasColumn = await queryRunner.hasColumn("grain_contracts", "commission_receipt_date");
        if (hasColumn) {
            await queryRunner.dropColumn("grain_contracts", "commission_receipt_date");
        }
    }
}
exports.AddCommissionReceitpDate1775849143332 = AddCommissionReceitpDate1775849143332;
//# sourceMappingURL=1775849143332-AddCommissionReceitpDate.js.map