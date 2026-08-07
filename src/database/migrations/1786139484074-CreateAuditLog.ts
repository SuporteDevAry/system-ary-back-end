import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuditLog1786139484074 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("audit_log");

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "audit_log",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "user_id",
              type: "uuid",
              isNullable: true,
            },
            {
              name: "user_email",
              type: "text",
            },
            {
              name: "user_name",
              type: "text",
            },
            {
              name: "action",
              type: "varchar",
            },
            {
              name: "entity_name",
              type: "varchar",
            },
            {
              name: "entity_id",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "before",
              type: "jsonb",
              isNullable: true,
            },
            {
              name: "after",
              type: "jsonb",
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
    const hasTable = await queryRunner.hasTable("audit_log");
    if (hasTable) {
      await queryRunner.dropTable("audit_log");
    }
  }
}
