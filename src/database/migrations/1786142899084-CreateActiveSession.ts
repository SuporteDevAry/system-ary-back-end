import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateActiveSession1786142899084 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("active_session");

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "active_session",
          columns: [
            {
              name: "user_id",
              type: "uuid",
              isPrimary: true,
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
              name: "last_seen_at",
              type: "timestamp",
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("active_session");
    if (hasTable) {
      await queryRunner.dropTable("active_session");
    }
  }
}
