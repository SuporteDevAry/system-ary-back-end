"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTableId1755633180693 = void 0;
const typeorm_1 = require("typeorm");
class AddTableId1755633180693 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "table_id");
            if (!hasColumn) {
                await queryRunner.addColumn("grain_contracts", new typeorm_1.TableColumn({
                    name: "table_id",
                    type: "uuid",
                    isNullable: true,
                }));
            }
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "table_id");
            if (hasColumn) {
                await queryRunner.dropColumn("grain_contracts", "table_id");
            }
        }
    }
}
exports.AddTableId1755633180693 = AddTableId1755633180693;
//# sourceMappingURL=1755633180693-AddTableId.js.map