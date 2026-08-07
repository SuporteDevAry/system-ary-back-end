import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCbotFieldsToFixationItems1785885079646
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    const columns: TableColumn[] = [
      new TableColumn({
        name: "exchange_rate_date",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "reference_month",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "cbot_code",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "cbot_value",
        type: "decimal",
        isNullable: true,
      }),
      new TableColumn({
        name: "premium",
        type: "decimal",
        isNullable: true,
      }),
      new TableColumn({
        name: "conversion_factor",
        type: "decimal",
        isNullable: true,
      }),
      new TableColumn({
        name: "fobbings",
        type: "decimal",
        isNullable: true,
      }),
      new TableColumn({
        name: "ppe_usd",
        type: "decimal",
        isNullable: true,
      }),
      new TableColumn({
        name: "price_usd_per_saca",
        type: "decimal",
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

    // item_value passa a ser sempre calculado (nunca digitado), mas mantém
    // nullable por segurança/idempotência de schema.
    await queryRunner.query(
      `ALTER TABLE grain_contract_fixation_items ALTER COLUMN item_value DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    for (const columnName of [
      "exchange_rate_date",
      "reference_month",
      "cbot_code",
      "cbot_value",
      "premium",
      "conversion_factor",
      "fobbings",
      "ppe_usd",
      "price_usd_per_saca",
    ]) {
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
