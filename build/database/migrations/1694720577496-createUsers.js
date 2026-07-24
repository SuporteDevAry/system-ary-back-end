"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsers1694720577496 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsers1694720577496 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("users");
        // Verifica se a tabela já existe antes de criá-la
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                    },
                    {
                        name: "permissions_id",
                        type: "uuid",
                        isNullable: true,
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
                foreignKeys: [
                    {
                        name: "fk_user_permissions",
                        columnNames: ["permissions_id"],
                        referencedTableName: "permissions",
                        referencedColumnNames: ["id"],
                    },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("users");
        // Verifica se a tabela existe antes de tentar removê-la
        if (hasTable) {
            await queryRunner.dropTable("users");
        }
    }
}
exports.CreateUsers1694720577496 = CreateUsers1694720577496;
//# sourceMappingURL=1694720577496-createUsers.js.map