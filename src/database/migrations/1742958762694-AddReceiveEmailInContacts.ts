import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddReceiveEmailInContacts1742958762694
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("contact");

    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn("contact", "receive_email");

      if (!hasColumn) {
        await queryRunner.addColumn(
          "contact",
          new TableColumn({
            name: "receive_email",
            type: "varchar",
          })
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("contact");

    if (hasTable) {
      const hasColumn = await queryRunner.hasColumn("contact", "receive_email");

      if (hasColumn) {
        await queryRunner.dropColumn("contact", "receive_email");
      }
    }
  }
}
