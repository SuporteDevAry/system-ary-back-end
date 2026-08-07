import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNumberContractToFixationItems1785532036916
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      "grain_contract_fixation_items",
      "number_contract"
    );
    if (!hasColumn) {
      await queryRunner.addColumn(
        "grain_contract_fixation_items",
        new TableColumn({
          name: "number_contract",
          type: "varchar",
          isNullable: true,
        })
      );

      // Backfill de linhas pré-existentes (se houver) com um número derivado
      // do contrato pai + índice sequencial, antes de tornar a coluna única.
      await queryRunner.query(`
        WITH numbered AS (
          SELECT id, fixation_contract_id,
                 ROW_NUMBER() OVER (PARTITION BY fixation_contract_id ORDER BY created_at) AS seq
          FROM grain_contract_fixation_items
          WHERE number_contract IS NULL
        )
        UPDATE grain_contract_fixation_items AS items
        SET number_contract = gfc.number_contract || '-' || LPAD(numbered.seq::text, 2, '0')
        FROM numbered
        JOIN grain_fixation_contracts gfc ON gfc.id = numbered.fixation_contract_id
        WHERE items.id = numbered.id
      `);

      await queryRunner.query(`
        ALTER TABLE grain_contract_fixation_items
        ALTER COLUMN number_contract SET NOT NULL
      `);

      await queryRunner.query(`
        ALTER TABLE grain_contract_fixation_items
        ADD CONSTRAINT UQ_grain_contract_fixation_items_number_contract UNIQUE (number_contract)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      "grain_contract_fixation_items",
      "number_contract"
    );
    if (hasColumn) {
      await queryRunner.dropColumn(
        "grain_contract_fixation_items",
        "number_contract"
      );
    }
  }
}
