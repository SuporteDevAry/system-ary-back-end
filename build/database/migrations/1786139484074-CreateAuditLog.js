"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuditLog1786139484074 = void 0;
const typeorm_1 = require("typeorm");
class CreateAuditLog1786139484074 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("audit_log");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "audit_log",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "user_email",
                        type: "text",
                    },
                    {
                        name: "user_name",
                        type: "text",
                    },
                    {
                        name: "action",
                        type: "varchar",
                    },
                    {
                        name: "entity_name",
                        type: "varchar",
                    },
                    {
                        name: "entity_id",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "before",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "after",
                        type: "jsonb",
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
        const hasTable = await queryRunner.hasTable("audit_log");
        if (hasTable) {
            await queryRunner.dropTable("audit_log");
        }
    }
}
exports.CreateAuditLog1786139484074 = CreateAuditLog1786139484074;
//# sourceMappingURL=1786139484074-CreateAuditLog.js.map