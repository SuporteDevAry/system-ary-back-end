"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTypeQuantity1747783875290 = void 0;
const typeorm_1 = require("typeorm");
class AddTypeQuantity1747783875290 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "type_quantity");
            if (!hasColumn) {
                await queryRunner.addColumn("grain_contracts", new typeorm_1.TableColumn({
                    name: "type_quantity",
                    type: "varchar",
                    isNullable: true,
                }));
            }
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "type_quantity");
            if (hasColumn) {
                await queryRunner.dropColumn("grain_contracts", "type_quantity");
            }
        }
    }
}
exports.AddTypeQuantity1747783875290 = AddTypeQuantity1747783875290;
//# sourceMappingURL=1747783875290-addTypeQuantity.js.map