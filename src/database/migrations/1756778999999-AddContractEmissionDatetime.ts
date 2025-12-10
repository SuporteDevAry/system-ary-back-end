import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddContractEmissionDatetime1756778999999
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");
    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "contract_emission_datetime"
      );
      if (!hasColumn) {
        await queryRunner.addColumn(
          "grain_contracts",
          new TableColumn({
            name: "contract_emission_datetime",
            type: "timestamp",
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
        "contract_emission_datetime"
      );
      if (hasColumn) {
        await queryRunner.dropColumn(
          "grain_contracts",
          "contract_emission_datetime"
        );
      }
    }
  }
}
