"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Taxes1756780745306 = void 0;
const typeorm_1 = require("typeorm");
class Taxes1756780745306 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("taxes");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "taxes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "code",
                        type: "varchar",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "value",
                        type: "decimal",
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
        const hasTable = await queryRunner.hasTable("taxes");
        if (hasTable) {
            await queryRunner.dropTable("taxes");
        }
    }
}
exports.Taxes1756780745306 = Taxes1756780745306;
//# sourceMappingURL=1756780745306-Taxes.js.map