"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddXmlFieldToInvoices1769793476445 = void 0;
const typeorm_1 = require("typeorm");
class AddXmlFieldToInvoices1769793476445 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable)
            return;
        const hasXml = await queryRunner.hasColumn("invoices", "xml_nfse");
        if (!hasXml) {
            await queryRunner.addColumn("invoices", new typeorm_1.TableColumn({
                name: "xml_nfse",
                type: "text",
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable)
            return;
        const hasXml = await queryRunner.hasColumn("invoices", "xml_nfse");
        if (hasXml) {
            await queryRunner.dropColumn("invoices", "xml_nfse");
        }
    }
}
exports.AddXmlFieldToInvoices1769793476445 = AddXmlFieldToInvoices1769793476445;
//# sourceMappingURL=1769793476445-AddXmlFieldToInvoices.js.map