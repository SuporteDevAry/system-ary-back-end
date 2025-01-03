import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class EmailLogs1733888615818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("email_logs");

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "email_logs",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "email_sender",
              type: "varchar",
            },
            {
              name: "number_contract",
              type: "varchar",
            },
            {
              name: "sent_at",
              type: "timestamp",
              default: "now()",
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("email_logs");
    if (hasTable) {
      await queryRunner.dropTable("email_logs");
    }
  }
}
