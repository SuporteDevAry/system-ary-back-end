import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPdfMetadataToFixationItems1785533408739
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    const columns: TableColumn[] = [
      new TableColumn({
        name: "pdf_file_name",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "pdf_file_size_kb",
        type: "decimal",
        isNullable: true,
      }),
      new TableColumn({
        name: "pdf_pages",
        type: "int",
        isNullable: true,
      }),
    ];

    for (const column of columns) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contract_fixation_items",
        column.name
      );
      if (!hasColumn) {
        await queryRunner.addColumn("grain_contract_fixation_items", column);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    for (const columnName of ["pdf_file_name", "pdf_file_size_kb", "pdf_pages"]) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contract_fixation_items",
        columnName
      );
      if (hasColumn) {
        await queryRunner.dropColumn("grain_contract_fixation_items", columnName);
      }
    }
  }
}
