"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLogs1733888615818 = void 0;
const typeorm_1 = require("typeorm");
class EmailLogs1733888615818 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("email_logs");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "email_logs",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "email_sender",
                        type: "varchar",
                    },
                    {
                        name: "number_contract",
                        type: "varchar",
                    },
                    {
                        name: "sent_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("email_logs");
        if (hasTable) {
            await queryRunner.dropTable("email_logs");
        }
    }
}
exports.EmailLogs1733888615818 = EmailLogs1733888615818;
//# sourceMappingURL=1733888615818-EmailLogs.js.map