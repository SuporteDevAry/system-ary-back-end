import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTableId1755633180693 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "table_id"
      );
      if (!hasColumn) {
        await queryRunner.addColumn(
          "grain_contracts",
          new TableColumn({
            name: "table_id",
            type: "uuid",
            isNullable: true,
          })
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "table_id"
      );
      if (hasColumn) {
        await queryRunner.dropColumn("grain_contracts", "table_id");
      }
    }
  }
}
