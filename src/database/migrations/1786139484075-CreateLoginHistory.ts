import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateLoginHistory1786139484075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("login_history");

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "login_history",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "user_id",
              type: "uuid",
            },
            {
              name: "email",
              type: "text",
            },
            {
              name: "name",
              type: "text",
            },
            {
              name: "ip_address",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "now()",
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("login_history");
    if (hasTable) {
      await queryRunner.dropTable("login_history");
    }
  }
}
