import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddClientNew1720832053181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("client");

    // Verifica se a tabela já existe antes de criá-la
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "client",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "code_client",
              type: "int",
            },
            {
              name: "nickname",
              type: "varchar",
            },
            {
              name: "name",
              type: "varchar",
            },
            {
              name: "address",
              type: "varchar",
            },
            {
              name: "number",
              type: "varchar",
            },
            {
              name: "complement",
              type: "varchar",
            },
            {
              name: "district",
              type: "varchar",
            },
            {
              name: "city",
              type: "varchar",
            },
            {
              name: "state",
              type: "varchar",
            },
            {
              name: "zip_code",
              type: "varchar",
            },
            {
              name: "kind",
              type: "varchar",
            },
            {
              name: "cnpj_cpf",
              type: "varchar",
            },
            {
              name: "ins_est",
              type: "varchar",
            },
            {
              name: "ins_mun",
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
              name: "situation",
              type: "varchar",
            },
            {
              name: "account",
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
          uniques: [
            // Correção do nome para `uniqueConstraints`
            {
              name: "UQ_client_code_client", // Nome da constraint
              columnNames: ["code_client"], // Colunas que têm a restrição única
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("client");
    // Verifica se a tabela existe antes de tentar removê-la
    if (hasTable) {
      await queryRunner.dropTable("client");
    }
  }
}
