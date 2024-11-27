import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddComplementationDestination1732715196786
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "complement_destination"
      );
      if (!hasColumn) {
        await queryRunner.addColumn(
          "grain_contracts",
          new TableColumn({
            name: "complement_destination",
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
        "complement_destination"
      );
      if (hasColumn) {
        await queryRunner.dropColumn(
          "grain_contracts",
          "complement_destination"
        );
      }
    }
  }
}
