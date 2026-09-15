"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActiveSession1786142899084 = void 0;
const typeorm_1 = require("typeorm");
class CreateActiveSession1786142899084 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("active_session");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "active_session",
                columns: [
                    {
                        name: "user_id",
                        type: "uuid",
                        isPrimary: true,
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
                        name: "last_seen_at",
                        type: "timestamp",
                    },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("active_session");
        if (hasTable) {
            await queryRunner.dropTable("active_session");
        }
    }
}
exports.CreateActiveSession1786142899084 = CreateActiveSession1786142899084;
//# sourceMappingURL=1786142899084-CreateActiveSession.js.map