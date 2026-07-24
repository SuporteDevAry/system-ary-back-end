"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReceiveEmailInContacts1742958762694 = void 0;
const typeorm_1 = require("typeorm");
class AddReceiveEmailInContacts1742958762694 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("contact");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("contact", "receive_email");
            if (!hasColumn) {
                await queryRunner.addColumn("contact", new typeorm_1.TableColumn({
                    name: "receive_email",
                    type: "varchar",
                }));
            }
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("contact");
        if (hasTable) {
            const hasColumn = await queryRunner.hasColumn("contact", "receive_email");
            if (hasColumn) {
                await queryRunner.dropColumn("contact", "receive_email");
            }
        }
    }
}
exports.AddReceiveEmailInContacts1742958762694 = AddReceiveEmailInContacts1742958762694;
//# sourceMappingURL=1742958762694-AddReceiveEmailInContacts.js.map