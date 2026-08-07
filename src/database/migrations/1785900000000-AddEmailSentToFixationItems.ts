import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEmailSentToFixationItems1785900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    const columns: TableColumn[] = [
      new TableColumn({
        name: "email_sent",
        type: "boolean",
        default: false,
      }),
      new TableColumn({
        name: "email_sent_at",
        type: "timestamp",
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

    for (const columnName of ["email_sent", "email_sent_at"]) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contract_fixation_items",
        columnName
      );
      if (hasColumn) {
        await queryRunner.dropColumn(
          "grain_contract_fixation_items",
          columnName
        );
      }
    }
  }
}
