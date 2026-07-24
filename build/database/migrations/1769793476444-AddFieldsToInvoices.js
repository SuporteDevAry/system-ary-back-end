"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFieldsToInvoices1769793476444 = void 0;
const typeorm_1 = require("typeorm");
class AddFieldsToInvoices1769793476444 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable)
            return;
        const hasStatus = await queryRunner.hasColumn("invoices", "status");
        if (!hasStatus) {
            await queryRunner.addColumn("invoices", new typeorm_1.TableColumn({
                name: "status",
                type: "varchar",
                isNullable: true,
            }));
        }
        const hasProtocolo = await queryRunner.hasColumn("invoices", "protocolo_lote");
        if (!hasProtocolo) {
            await queryRunner.addColumn("invoices", new typeorm_1.TableColumn({
                name: "protocolo_lote",
                type: "varchar",
                isNullable: true,
            }));
        }
        const hasUrl = await queryRunner.hasColumn("invoices", "url_danfse");
        if (!hasUrl) {
            await queryRunner.addColumn("invoices", new typeorm_1.TableColumn({
                name: "url_danfse",
                type: "text",
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable)
            return;
        const hasUrl = await queryRunner.hasColumn("invoices", "url_danfse");
        if (hasUrl) {
            await queryRunner.dropColumn("invoices", "url_danfse");
        }
        const hasProtocolo = await queryRunner.hasColumn("invoices", "protocolo_lote");
        if (hasProtocolo) {
            await queryRunner.dropColumn("invoices", "protocolo_lote");
        }
        const hasStatus = await queryRunner.hasColumn("invoices", "status");
        if (hasStatus) {
            await queryRunner.dropColumn("invoices", "status");
        }
    }
}
exports.AddFieldsToInvoices1769793476444 = AddFieldsToInvoices1769793476444;
//# sourceMappingURL=1769793476444-AddFieldsToInvoices.js.map