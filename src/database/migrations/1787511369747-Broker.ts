import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Broker1787511369747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("broker");

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "broker",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "mesa",
              type: "varchar",
            },
            {
              name: "broker",
              type: "varchar",
            },
            {
              name: "product",
              type: "varchar",
            },
            {
              name: "broker_name",
              type: "varchar",
            },
            {
              name: "broker_nick",
              type: "varchar",
            },
            {
              name: "broker_abbrev",
              type: "varchar",
            },
            {
              name: "company_name",
              type: "varchar",
            },
            {
              name: "cnpj_cpf",
              type: "varchar",
            },
            {
              name: "bank_number",
              type: "varchar",
            },
            {
              name: "bank_name",
              type: "varchar",
            },
            {
              name: "ag_number",
              type: "varchar",
            },
            {
              name: "account_number",
              type: "varchar",
            },
            {
              name: "date_ini",
              type: "varchar",
            },
            {
              name: "date_fin",
              type: "varchar",
            },
            {
              name: "commision",
              type: "decimal",
            },
            {
              name: "cctipo",
              type: "varchar",
            },
            {
              name: "ccdesconto",
              type: "decimal",
            },
            {
              name: "sca",
              type: "varchar",
            },
            {
              name: "aj_prolab",
              type: "decimal",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("broker");

    if (hasTable) {
      await queryRunner.dropTable("broker");
    }
  }
}
