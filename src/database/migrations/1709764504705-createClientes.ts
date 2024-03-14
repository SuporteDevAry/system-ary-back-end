import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateClientes1709764504705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "clientes",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "cli_codigo",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "nome",
            type: "varchar",
          },
          {
            name: "endereco",
            type: "varchar",
          },
          {
            name: "numero",
            type: "varchar",
          },
          {
            name: "complemento",
            type: "varchar",
          },
          {
            name: "bairro",
            type: "varchar",
          },
          {
            name: "cidade",
            type: "varchar",
          },
          {
            name: "uf",
            type: "varchar",
          },
          {
            name: "cep",
            type: "varchar",
          },
          {
            name: "natureza",
            type: "varchar",
          },
          {
            name: "cnpj",
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
            name: "email",
            type: "varchar",
          },
          {
            name: "telefone",
            type: "varchar",
          },
          {
            name: "celular",
            type: "varchar",
          },
          {
            name: "situacao",
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
    await queryRunner.dropTable("clientes");
  }
}
