import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddXmlFieldToInvoices1769793476445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("invoices");
    if (!hasTable) return;

    const hasXml = await queryRunner.hasColumn("invoices", "xml_nfse");
    if (!hasXml) {
      await queryRunner.addColumn(
        "invoices",
        new TableColumn({
          name: "xml_nfse",
          type: "text",
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("invoices");
    if (!hasTable) return;

    const hasXml = await queryRunner.hasColumn("invoices", "xml_nfse");
    if (hasXml) {
      await queryRunner.dropColumn("invoices", "xml_nfse");
    }
  }
}
