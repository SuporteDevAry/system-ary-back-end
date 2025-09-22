import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Invoices1757045893213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("invoices");
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "invoices",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "rps_number",
              type: "varchar",
            },
            {
              name: "rps_emission_date",
              type: "varchar",
            },
            {
              name: "nfs_number",
              type: "varchar",
            },
            {
              name: "nfs_emission_date",
              type: "varchar",
            },
            {
              name: "service_code",
              type: "varchar",
            },
            {
              name: "aliquot",
              type: "decimal",
            },
            {
              name: "cpf_cnpj",
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
              name: "email",
              type: "varchar",
            },
            {
              name: "service_discrim",
              type: "text",
            },
            {
              name: "service_value",
              type: "decimal",
            },
            {
              name: "name_adjust1",
              type: "varchar",
            },
            {
              name: "value_adjust1",
              type: "decimal",
            },
            {
              name: "name_adjust2",
              type: "varchar",
            },
            {
              name: "value_adjust2",
              type: "decimal",
            },
            {
              name: "deduction_value",
              type: "decimal",
            },
            {
              name: "irrf_value",
              type: "decimal",
            },
            {
              name: "service_liquid_value",
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
    const hasTable = await queryRunner.hasTable("invoices");
    if (hasTable) {
      await queryRunner.dropTable("invoices");
    }
  }
}
