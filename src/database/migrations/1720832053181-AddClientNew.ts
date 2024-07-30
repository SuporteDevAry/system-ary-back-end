import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddClientNew1720832053181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("client");
  }
}
