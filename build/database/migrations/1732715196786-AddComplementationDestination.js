"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddComplementationDestination1732715196786 = void 0;
const typeorm_1 = require("typeorm");
class AddComplementationDestination1732715196786 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "complement_destination");
            if (!hasColumn) {
                await queryRunner.addColumn("grain_contracts", new typeorm_1.TableColumn({
                    name: "complement_destination",
                    type: "varchar",
                    isNullable: true,
                }));
            }
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "complement_destination");
            if (hasColumn) {
                await queryRunner.dropColumn("grain_contracts", "complement_destination");
            }
        }
    }
}
exports.AddComplementationDestination1732715196786 = AddComplementationDestination1732715196786;
//# sourceMappingURL=1732715196786-AddComplementationDestination.js.map