import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeContractEmissionDate1764895713589
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");

    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "contract_emission_date"
      );

      if (hasColumn) {
        await queryRunner.query(`
          ALTER TABLE grain_contracts
          ALTER COLUMN contract_emission_date TYPE TIMESTAMP
          USING contract_emission_date::timestamp;
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("grain_contracts");

    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn(
        "grain_contracts",
        "contract_emission_date"
      );

      if (hasColumn) {
        await queryRunner.query(`
          ALTER TABLE grain_contracts
          ALTER COLUMN contract_emission_date TYPE VARCHAR;
        `);
      }
    }
  }
}
