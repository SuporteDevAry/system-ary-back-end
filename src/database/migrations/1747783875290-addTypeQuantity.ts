import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTypeQuantity1747783875290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "type_quantity"
      );
      if (!hasColumn) {
        await queryRunner.addColumn(
          "grain_contracts",
          new TableColumn({
            name: "type_quantity",
            type: "varchar",
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
        "type_quantity"
      );
      if (hasColumn) {
        await queryRunner.dropColumn("grain_contracts", "type_quantity");
      }
    }
  }
}
