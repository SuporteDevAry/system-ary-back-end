import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Products1754078917113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("products");

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "products",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "product_type",
              type: "varchar",
              isUnique: true,
            },
            {
              name: "name",
              type: "varchar",
            },
            {
              name: "commission_seller",
              type: "varchar",
            },
            {
              name: "type_commission_seller",
              type: "varchar",
            },
            {
              name: "quality",
              type: "text",
            },
            {
              name: "observation",
              type: "text",
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
    const hasTable = await queryRunner.hasTable("products");

    if (hasTable) {
      await queryRunner.dropTable("products");
    }
  }
}
