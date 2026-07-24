"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications1716314850943 = void 0;
const typeorm_1 = require("typeorm");
class Notifications1716314850943 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("notifications");
        // Verifica se a tabela já existe antes de criá-la
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "notifications",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "user",
                        type: "varchar",
                    },
                    {
                        name: "read",
                        type: "boolean",
                        default: false, // Valor padrão para 'read'
                    },
                    {
                        name: "content",
                        type: "varchar",
                    },
                    {
                        name: "type",
                        type: "varchar",
                    },
                    {
                        name: "isLoading",
                        type: "boolean",
                        default: false, // Valor padrão para 'isLoading'
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
        const hasTable = await queryRunner.hasTable("notifications");
        // Verifica se a tabela existe antes de tentar removê-la
        if (hasTable) {
            await queryRunner.dropTable("notifications");
        }
    }
}
exports.Notifications1716314850943 = Notifications1716314850943;
//# sourceMappingURL=1716314850943-Notifications.js.map