import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCommissionReceitpDate1775849143332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");

    if (!hasTable) {
      return;
    }

    const hasColumn = await queryRunner.hasColumn(
      "grain_contracts",
      "commission_receipt_date",
    );

    if (!hasColumn) {
      await queryRunner.addColumn(
        "grain_contracts",
        new TableColumn({
          name: "commission_receipt_date",
          type: "varchar",
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");

    if (!hasTable) {
      return;
    }

    const hasColumn = await queryRunner.hasColumn(
      "grain_contracts",
      "commission_receipt_date",
    );

    if (hasColumn) {
      await queryRunner.dropColumn(
        "grain_contracts",
        "commission_receipt_date",
      );
    }
  }
}
