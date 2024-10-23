import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1694720577496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("users");

    // Verifica se a tabela já existe antes de criá-la
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "users",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "name",
              type: "varchar",
            },
            {
              name: "email",
              type: "varchar",
              isUnique: true,
            },
            {
              name: "password",
              type: "varchar",
            },
            {
              name: "permissions_id",
              type: "uuid",
              isNullable: true,
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
          foreignKeys: [
            {
              name: "fk_user_permissions",
              columnNames: ["permissions_id"],
              referencedTableName: "permissions",
              referencedColumnNames: ["id"],
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("users");
    // Verifica se a tabela existe antes de tentar removê-la
    if (hasTable) {
      await queryRunner.dropTable("users");
    }
  }
}
