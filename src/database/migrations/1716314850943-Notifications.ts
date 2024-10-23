import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Notifications1716314850943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("notifications");

    // Verifica se a tabela já existe antes de criá-la
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "notifications",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "user",
              type: "varchar",
            },
            {
              name: "read",
              type: "boolean",
              default: false, // Valor padrão para 'read'
            },
            {
              name: "content",
              type: "varchar",
            },
            {
              name: "type",
              type: "varchar",
            },
            {
              name: "isLoading",
              type: "boolean",
              default: false, // Valor padrão para 'isLoading'
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
    const hasTable = await queryRunner.hasTable("notifications");
    // Verifica se a tabela existe antes de tentar removê-la
    if (hasTable) {
      await queryRunner.dropTable("notifications");
    }
  }
}
