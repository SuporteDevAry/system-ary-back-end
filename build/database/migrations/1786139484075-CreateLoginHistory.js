"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLoginHistory1786139484075 = void 0;
const typeorm_1 = require("typeorm");
class CreateLoginHistory1786139484075 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("login_history");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "login_history",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "email",
                        type: "text",
                    },
                    {
                        name: "name",
                        type: "text",
                    },
                    {
                        name: "ip_address",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("login_history");
        if (hasTable) {
            await queryRunner.dropTable("login_history");
        }
    }
}
exports.CreateLoginHistory1786139484075 = CreateLoginHistory1786139484075;
//# sourceMappingURL=1786139484075-CreateLoginHistory.js.map