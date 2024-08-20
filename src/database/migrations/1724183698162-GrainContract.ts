import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class GrainContract1724183698162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "grain_contracts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "number_broker",
            type: "varchar",
          },
          {
            name: "seller",
            type: "varchar",
          },
          {
            name: "buyer",
            type: "varchar",
          },
          {
            name: "list_email_seller",
            type: "varchar",
          },
          {
            name: "list_email_buyer",
            type: "varchar",
          },
          {
            name: "product",
            type: "varchar",
          },
          {
            name: "name_product",
            type: "varchar",
          },
          {
            name: "crop",
            type: "varchar",
          },
          {
            name: "quality",
            type: "varchar",
          },
          {
            name: "quantity",
            type: "decimal",
          },
          {
            name: "quantity_kg",
            type: "decimal",
          },
          {
            name: "quantity_bag",
            type: "decimal",
          },
          {
            name: "type_currency",
            type: "varchar",
          },
          {
            name: "price",
            type: "decimal",
          },
          {
            name: "type_icms",
            type: "varchar",
          },
          {
            name: "icms",
            type: "varchar",
          },
          {
            name: "payment",
            type: "varchar",
          },
          {
            name: "commission_seller",
            type: "decimal",
          },
          {
            name: "commission_buyer",
            type: "decimal",
          },
          {
            name: "type_pickup",
            type: "varchar",
          },
          {
            name: "pickup",
            type: "varchar",
          },
          {
            name: "pickup_location",
            type: "varchar",
          },
          {
            name: "inspection",
            type: "varchar",
          },
          {
            name: "observation",
            type: "varchar",
          },
          {
            name: "number_contract",
            type: "varchar",
          },
          {
            name: "owner_broker",
            type: "varchar",
          },
          {
            name: "contract_value",
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("grain_contracts");
  }
}
