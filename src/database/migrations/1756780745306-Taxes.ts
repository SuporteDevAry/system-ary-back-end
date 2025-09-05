import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Taxes1756780745306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("taxes");
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "taxes",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "code",
              type: "varchar",
            },
            {
              name: "name",
              type: "varchar",
            },
            {
              name: "value",
              type: "decimal",
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "now()",
            },
            {
              name: "updated_at",
              type: "timestamp",
              default: "now()",
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("taxes");
    if (hasTable) {
      await queryRunner.dropTable("taxes");
    }
  }
}
