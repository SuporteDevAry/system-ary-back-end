import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToInvoices1769793476444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("invoices");
    if (!hasTable) return;

    const hasStatus = await queryRunner.hasColumn("invoices", "status");
    if (!hasStatus) {
      await queryRunner.addColumn(
        "invoices",
        new TableColumn({
          name: "status",
          type: "varchar",
          isNullable: true,
        }),
      );
    }

    const hasProtocolo = await queryRunner.hasColumn(
      "invoices",
      "protocolo_lote",
    );
    if (!hasProtocolo) {
      await queryRunner.addColumn(
        "invoices",
        new TableColumn({
          name: "protocolo_lote",
          type: "varchar",
          isNullable: true,
        }),
      );
    }

    const hasUrl = await queryRunner.hasColumn("invoices", "url_danfse");
    if (!hasUrl) {
      await queryRunner.addColumn(
        "invoices",
        new TableColumn({
          name: "url_danfse",
          type: "text",
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("invoices");
    if (!hasTable) return;

    const hasUrl = await queryRunner.hasColumn("invoices", "url_danfse");
    if (hasUrl) {
      await queryRunner.dropColumn("invoices", "url_danfse");
    }

    const hasProtocolo = await queryRunner.hasColumn(
      "invoices",
      "protocolo_lote",
    );
    if (hasProtocolo) {
      await queryRunner.dropColumn("invoices", "protocolo_lote");
    }

    const hasStatus = await queryRunner.hasColumn("invoices", "status");
    if (hasStatus) {
      await queryRunner.dropColumn("invoices", "status");
    }
  }
}
