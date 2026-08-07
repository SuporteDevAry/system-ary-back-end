import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGrainFixationContracts1785526225471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasFixationContractsTable = await queryRunner.hasTable(
      "grain_fixation_contracts"
    );

    if (!hasFixationContractsTable) {
      await queryRunner.createTable(
        new Table({
          name: "grain_fixation_contracts",
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "number_broker", type: "varchar" },
            {
              name: "seller",
              type: "jsonb",
              isNullable: true,
              default: "'[]'::jsonb",
            },
            {
              name: "buyer",
              type: "jsonb",
              isNullable: true,
              default: "'[]'::jsonb",
            },
            {
              name: "list_email_seller",
              type: "jsonb",
              isNullable: true,
              default: "'[]'::jsonb",
            },
            {
              name: "list_email_buyer",
              type: "jsonb",
              isNullable: true,
              default: "'[]'::jsonb",
            },
            { name: "product", type: "varchar" },
            { name: "name_product", type: "varchar" },
            { name: "crop", type: "varchar" },
            { name: "quality", type: "varchar" },
            { name: "type_quantity", type: "varchar", isNullable: true },
            { name: "quantity", type: "decimal" },
            { name: "quantity_kg", type: "decimal" },
            { name: "quantity_bag", type: "decimal" },
            { name: "type_currency", type: "varchar", isNullable: true },
            { name: "price", type: "decimal", isNullable: true },
            { name: "type_icms", type: "varchar" },
            { name: "icms", type: "varchar" },
            { name: "payment", type: "varchar" },
            { name: "commission_seller", type: "varchar", isNullable: true },
            { name: "commission_buyer", type: "varchar", isNullable: true },
            { name: "type_pickup", type: "varchar" },
            { name: "pickup", type: "varchar" },
            { name: "pickup_location", type: "varchar" },
            { name: "inspection", type: "varchar" },
            { name: "observation", type: "varchar", isNullable: true },
            { name: "number_contract", type: "varchar" },
            { name: "owner_contract", type: "varchar" },
            {
              name: "type_commission_seller",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "type_commission_buyer",
              type: "varchar",
              isNullable: true,
            },
            { name: "total_contract_value", type: "decimal", isNullable: true },
            { name: "status", type: "jsonb", isNullable: true },
            {
              name: "contract_emission_date",
              type: "varchar",
              isNullable: true,
            },
            { name: "destination", type: "varchar", isNullable: true },
            {
              name: "complement_destination",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "number_external_contract_buyer",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "number_external_contract_seller",
              type: "varchar",
              isNullable: true,
            },
            { name: "day_exchange_rate", type: "varchar", isNullable: true },
            { name: "payment_date", type: "varchar", isNullable: true },
            { name: "farm_direct", type: "varchar", isNullable: true },
            { name: "initial_pickup_date", type: "varchar", isNullable: true },
            { name: "final_pickup_date", type: "varchar", isNullable: true },
            {
              name: "internal_communication",
              type: "varchar",
              isNullable: true,
            },
            { name: "table_id", type: "uuid", isNullable: true },
            { name: "final_quantity", type: "decimal", isNullable: true },
            { name: "commission_contract", type: "decimal", isNullable: true },
            {
              name: "commission_seller_contract_value",
              type: "decimal",
              isNullable: true,
            },
            {
              name: "commission_buyer_contract_value",
              type: "decimal",
              isNullable: true,
            },
            { name: "total_received", type: "decimal", isNullable: true },
            { name: "status_received", type: "varchar", isNullable: true },
            { name: "charge_date", type: "varchar", isNullable: true },
            {
              name: "commission_receipt_date",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "expected_receipt_date",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "contract_emission_datetime",
              type: "timestamp",
              isNullable: true,
            },
            {
              name: "type_commission_seller_currency",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "commission_seller_exchange_rate",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "type_commission_buyer_currency",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "commission_buyer_exchange_rate",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "fixation_status",
              type: "varchar",
              default: "'Pendente'",
            },
            { name: "fixed_quantity", type: "decimal", default: 0 },
            {
              name: "average_fixed_price",
              type: "decimal",
              isNullable: true,
            },
            { name: "created_at", type: "timestamp", default: "now()" },
            { name: "updated_at", type: "timestamp", default: "now()" },
          ],
        })
      );
    }

    const hasFixationItemsTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );

    if (!hasFixationItemsTable) {
      await queryRunner.createTable(
        new Table({
          name: "grain_contract_fixation_items",
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "fixation_contract_id", type: "uuid" },
            { name: "quantity", type: "decimal" },
            { name: "price", type: "decimal" },
            { name: "type_currency", type: "varchar" },
            { name: "exchange_rate", type: "varchar", isNullable: true },
            { name: "fixation_date", type: "varchar" },
            { name: "item_value", type: "decimal", isNullable: true },
            { name: "created_by_name", type: "varchar", isNullable: true },
            { name: "created_by_email", type: "varchar", isNullable: true },
            { name: "created_at", type: "timestamp", default: "now()" },
          ],
          foreignKeys: [
            {
              columnNames: ["fixation_contract_id"],
              referencedTableName: "grain_fixation_contracts",
              referencedColumnNames: ["id"],
              onDelete: "CASCADE",
            },
          ],
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasFixationItemsTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );
    if (hasFixationItemsTable) {
      await queryRunner.dropTable("grain_contract_fixation_items");
    }

    const hasFixationContractsTable = await queryRunner.hasTable(
      "grain_fixation_contracts"
    );
    if (hasFixationContractsTable) {
      await queryRunner.dropTable("grain_fixation_contracts");
    }
  }
}
