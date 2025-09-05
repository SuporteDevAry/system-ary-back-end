import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddReceiptFields1756778991841 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const columnsToAdd = [
        new TableColumn({
          name: "final_quantity",
          type: "decimal",
          isNullable: true,
        }),
        new TableColumn({
          name: "total_received",
          type: "decimal",
          isNullable: true,
        }),
        new TableColumn({
          name: "commission_contract",
          type: "decimal",
          isNullable: true,
        }),
        new TableColumn({
          name: "status_received",
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: "charge_date",
          type: "timestamp",
          isNullable: true,
        }),
        new TableColumn({
          name: "expected_receipt_date",
          type: "timestamp",
          isNullable: true,
        }),
      ];

      for (const column of columnsToAdd) {
        const hasColumn = await queryRunner.hasColumn(
          "grain_contracts",
          column.name
        );
        if (!hasColumn) {
          await queryRunner.addColumn("grain_contracts", column);
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const columnsToDrop = [
        "final_quantity",
        "total_received",
        "status_received",
        "charge_date",
        "expected_receipt_date",
      ];

      for (const columnName of columnsToDrop) {
        const hasColumn = await queryRunner.hasColumn(
          "grain_contracts",
          columnName
        );
        if (hasColumn) {
          await queryRunner.dropColumn("grain_contracts", columnName);
        }
      }
    }
  }
}
