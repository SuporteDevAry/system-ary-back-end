import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Permissions1697084968105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("permissions");

    // Verifica se a tabela já existe antes de criá-la
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "permissions",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "rules",
              type: "text",
              isArray: true,
              default: "'{}'::text[]",
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
    const hasTable = await queryRunner.hasTable("permissions");
    // Verifica se a tabela existe antes de tentar removê-la
    if (hasTable) {
      await queryRunner.dropTable("permissions");
    }
  }
}
