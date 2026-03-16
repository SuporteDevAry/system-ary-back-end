import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCommissionCurrencyFields1769793476443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const columnsToAdd = [
        new TableColumn({
          name: "type_commission_seller_currency",
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: "commission_seller_exchange_rate",
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: "type_commission_buyer_currency",
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: "commission_buyer_exchange_rate",
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: "commission_seller_contract_value",
          type: "decimal",
          isNullable: true,
        }),
        new TableColumn({
          name: "commission_buyer_contract_value",
          type: "decimal",
          isNullable: true,
        }),
      ];

      for (const column of columnsToAdd) {
        const hasColumn = await queryRunner.hasColumn(
          "grain_contracts",
          column.name,
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
        "type_commission_seller_currency",
        "commission_seller_exchange_rate",
        "type_commission_buyer_currency",
        "commission_buyer_exchange_rate",
        "commission_seller_contract_value",
        "commission_buyer_contract_value",
      ];

      for (const columnName of columnsToDrop) {
        const hasColumn = await queryRunner.hasColumn(
          "grain_contracts",
          columnName,
        );
        if (hasColumn) {
          await queryRunner.dropColumn("grain_contracts", columnName);
        }
      }
    }
  }
}
