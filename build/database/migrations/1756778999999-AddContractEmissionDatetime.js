"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddContractEmissionDatetime1756778999999 = void 0;
const typeorm_1 = require("typeorm");
class AddContractEmissionDatetime1756778999999 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "contract_emission_datetime");
            if (!hasColumn) {
                await queryRunner.addColumn("grain_contracts", new typeorm_1.TableColumn({
                    name: "contract_emission_datetime",
                    type: "timestamp",
                    isNullable: true,
                }));
            }
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("grain_contracts");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("grain_contracts", "contract_emission_datetime");
            if (hasColumn) {
                await queryRunner.dropColumn("grain_contracts", "contract_emission_datetime");
            }
        }
    }
}
exports.AddContractEmissionDatetime1756778999999 = AddContractEmissionDatetime1756778999999;
//# sourceMappingURL=1756778999999-AddContractEmissionDatetime.js.map