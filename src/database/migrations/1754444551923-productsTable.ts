import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ProductsTable1754444551923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("product_tables");
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: "product_tables",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "name",
              type: "varchar",
              isUnique: true,
            },
            {
              name: "product_types",
              type: "text",
              isArray: true,
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
    const hasTable = await queryRunner.hasTable("product_tables");
    if (hasTable) {
      await queryRunner.dropTable("product_tables");
    }
  }
}
