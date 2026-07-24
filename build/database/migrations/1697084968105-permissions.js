"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions1697084968105 = void 0;
const typeorm_1 = require("typeorm");
class Permissions1697084968105 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("permissions");
        // Verifica se a tabela já existe antes de criá-la
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "permissions",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "rules",
                        type: "text",
                        isArray: true,
                        default: "'{}'::text[]",
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
        const hasTable = await queryRunner.hasTable("permissions");
        // Verifica se a tabela existe antes de tentar removê-la
        if (hasTable) {
            await queryRunner.dropTable("permissions");
        }
    }
}
exports.Permissions1697084968105 = Permissions1697084968105;
//# sourceMappingURL=1697084968105-permissions.js.map