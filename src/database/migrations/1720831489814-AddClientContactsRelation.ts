import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddClientContactsRelation1720831489814
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("contact");

    // Verifica se a tabela já existe antes de criá-la
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "contact",
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
              name: "sector",
              type: "varchar",
            },
            {
              name: "telephone",
              type: "varchar",
            },
            {
              name: "cellphone",
              type: "varchar",
            },
            {
              name: "code_client",
              type: "int",
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
              name: "fk_contact_client",
              columnNames: ["code_client"],
              referencedTableName: "client",
              referencedColumnNames: ["code_client"],
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("contact");
    // Verifica se a tabela existe antes de tentar removê-la
    if (hasTable) {
      await queryRunner.dropTable("contact");
    }
  }
}
