import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Billing1757048894259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("billings");
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "billings",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "number_contract",
              type: "varchar",
            },
            {
              name: "product_name",
              type: "varchar",
            },
            {
              name: "number_broker",
              type: "varchar",
            },
            {
              name: "year",
              type: "varchar",
            },
            {
              name: "receipt_date",
              type: "varchar",
            },

            {
              name: "internal_receipt_number",
              type: "varchar",
            },
            {
              name: "rps_number",
              type: "varchar",
            },
            {
              name: "nfs_number",
              type: "varchar",
            },
            {
              name: "total_service_value",
              type: "decimal",
            },
            {
              name: "irrf_value",
              type: "decimal",
            },

            {
              name: "adjustment_value",
              type: "decimal",
            },

            {
              name: "liquid_value",
              type: "decimal",
            },
            {
              name: "liquid_contract",
              type: "varchar",
            },

            {
              name: "expected_receipt_date",
              type: "varchar",
            },

            {
              name: "liquid_contract_date",
              type: "varchar",
            },

            {
              name: "owner_record",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("billings");
    if (hasTable) {
      await queryRunner.dropTable("billings");
    }
  }
}
