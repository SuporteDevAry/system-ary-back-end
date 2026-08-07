import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const FK_NAME = "FK_grain_contract_fixation_items_grain_contracts";

const SHARED_COLUMNS = [
  "id", "number_broker", "seller", "buyer", "list_email_seller", "list_email_buyer",
  "product", "name_product", "crop", "quality", "type_quantity", "quantity", "quantity_kg",
  "quantity_bag", "type_currency", "price", "type_icms", "icms", "payment", "commission_seller",
  "commission_buyer", "type_pickup", "pickup", "pickup_location", "inspection", "observation",
  "number_contract", "owner_contract", "type_commission_seller", "type_commission_buyer",
  "total_contract_value", "status", "contract_emission_date", "destination",
  "complement_destination", "number_external_contract_buyer", "number_external_contract_seller",
  "day_exchange_rate", "payment_date", "farm_direct", "initial_pickup_date", "final_pickup_date",
  "internal_communication", "table_id", "final_quantity", "commission_contract",
  "commission_seller_contract_value", "commission_buyer_contract_value", "total_received",
  "status_received", "charge_date", "commission_receipt_date", "expected_receipt_date",
  "contract_emission_datetime", "type_commission_seller_currency",
  "commission_seller_exchange_rate", "type_commission_buyer_currency",
  "commission_buyer_exchange_rate", "fixation_status", "fixed_quantity", "average_fixed_price",
  "created_at", "updated_at",
];

export class MergeFixationContractsIntoGrainContracts1785542112697
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasGrainContracts = await queryRunner.hasTable("grain_contracts");
    if (!hasGrainContracts) return;

    // 1) type_contract: discriminador "MI" (fluxo original) vs "AF".
    const hasTypeContract = await queryRunner.hasColumn(
      "grain_contracts",
      "type_contract"
    );
    if (!hasTypeContract) {
      await queryRunner.addColumn(
        "grain_contracts",
        new TableColumn({
          name: "type_contract",
          type: "varchar",
          default: "'MI'",
          isNullable: false,
        })
      );
    }

    // 2) price/total_contract_value/type_currency passam a ser opcionais
    // (contrato "AF" nasce sem preço, e a moeda de referência é opcional).
    await queryRunner.query(
      `ALTER TABLE grain_contracts ALTER COLUMN price DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE grain_contracts ALTER COLUMN total_contract_value DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE grain_contracts ALTER COLUMN type_currency DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE grain_contracts ALTER COLUMN type_commission_seller DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE grain_contracts ALTER COLUMN type_commission_buyer DROP NOT NULL`
    );

    // 3) Campos do ciclo de fixação, migrados de GrainFixationContract.
    for (const column of [
      new TableColumn({ name: "fixation_status", type: "varchar", isNullable: true }),
      new TableColumn({ name: "fixed_quantity", type: "decimal", isNullable: true }),
      new TableColumn({ name: "average_fixed_price", type: "decimal", isNullable: true }),
    ]) {
      const hasColumn = await queryRunner.hasColumn("grain_contracts", column.name);
      if (!hasColumn) {
        await queryRunner.addColumn("grain_contracts", column);
      }
    }

    // 4) Migra as linhas reais de grain_fixation_contracts (se a tabela ainda
    // existir) preservando o id, marcando type_contract='AF'.
    const hasFixationContractsTable = await queryRunner.hasTable(
      "grain_fixation_contracts"
    );
    if (hasFixationContractsTable) {
      const columnList = SHARED_COLUMNS.join(", ");
      await queryRunner.query(`
        INSERT INTO grain_contracts (${columnList}, type_contract)
        SELECT ${columnList}, 'AF'
        FROM grain_fixation_contracts
        ON CONFLICT (id) DO NOTHING
      `);

      // 5) Reaponta a FK de grain_contract_fixation_items para grain_contracts.
      const hasFixationItemsTable = await queryRunner.hasTable(
        "grain_contract_fixation_items"
      );
      if (hasFixationItemsTable) {
        const oldForeignKeys = await queryRunner.query(`
          SELECT conname FROM pg_constraint
          WHERE conrelid = 'grain_contract_fixation_items'::regclass
          AND confrelid = 'grain_fixation_contracts'::regclass
        `);
        for (const row of oldForeignKeys) {
          await queryRunner.query(
            `ALTER TABLE grain_contract_fixation_items DROP CONSTRAINT "${row.conname}"`
          );
        }

        await queryRunner.query(`
          ALTER TABLE grain_contract_fixation_items
          ADD CONSTRAINT "${FK_NAME}"
          FOREIGN KEY (fixation_contract_id) REFERENCES grain_contracts(id) ON DELETE CASCADE
        `);
      }

      // 6) Remove a tabela antiga, agora redundante.
      await queryRunner.query(`DROP TABLE grain_fixation_contracts`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasGrainContracts = await queryRunner.hasTable("grain_contracts");
    if (!hasGrainContracts) return;

    const hasFixationItemsTable = await queryRunner.hasTable(
      "grain_contract_fixation_items"
    );

    // Recria grain_fixation_contracts e devolve as linhas "AF".
    const columnDefs = `
      id character varying PRIMARY KEY,
      number_broker character varying NOT NULL,
      seller jsonb DEFAULT '[]'::jsonb,
      buyer jsonb DEFAULT '[]'::jsonb,
      list_email_seller jsonb DEFAULT '[]'::jsonb,
      list_email_buyer jsonb DEFAULT '[]'::jsonb,
      product character varying NOT NULL,
      name_product character varying NOT NULL,
      crop character varying NOT NULL,
      quality character varying NOT NULL,
      type_quantity character varying,
      quantity numeric NOT NULL,
      quantity_kg numeric NOT NULL,
      quantity_bag numeric NOT NULL,
      type_currency character varying,
      price numeric,
      type_icms character varying NOT NULL,
      icms character varying NOT NULL,
      payment character varying NOT NULL,
      commission_seller character varying,
      commission_buyer character varying,
      type_pickup character varying NOT NULL,
      pickup character varying NOT NULL,
      pickup_location character varying NOT NULL,
      inspection character varying NOT NULL,
      observation character varying,
      number_contract character varying NOT NULL,
      owner_contract character varying NOT NULL,
      type_commission_seller character varying,
      type_commission_buyer character varying,
      total_contract_value numeric,
      status jsonb,
      contract_emission_date character varying,
      destination character varying,
      complement_destination character varying,
      number_external_contract_buyer character varying,
      number_external_contract_seller character varying,
      day_exchange_rate character varying,
      payment_date character varying,
      farm_direct character varying,
      initial_pickup_date character varying,
      final_pickup_date character varying,
      internal_communication character varying,
      table_id uuid,
      final_quantity numeric,
      commission_contract numeric,
      commission_seller_contract_value numeric,
      commission_buyer_contract_value numeric,
      total_received numeric,
      status_received character varying,
      charge_date character varying,
      commission_receipt_date character varying,
      expected_receipt_date character varying,
      contract_emission_datetime timestamp,
      type_commission_seller_currency character varying,
      commission_seller_exchange_rate character varying,
      type_commission_buyer_currency character varying,
      commission_buyer_exchange_rate character varying,
      fixation_status character varying NOT NULL DEFAULT 'Pendente',
      fixed_quantity numeric NOT NULL DEFAULT 0,
      average_fixed_price numeric,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    `;

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS grain_fixation_contracts (${columnDefs})`
    );

    const columnList = SHARED_COLUMNS.join(", ");
    await queryRunner.query(`
      INSERT INTO grain_fixation_contracts (${columnList})
      SELECT ${columnList}
      FROM grain_contracts
      WHERE type_contract = 'AF'
      ON CONFLICT (id) DO NOTHING
    `);

    if (hasFixationItemsTable) {
      const newForeignKeys = await queryRunner.query(`
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'grain_contract_fixation_items'::regclass
        AND conname = '${FK_NAME}'
      `);
      for (const row of newForeignKeys) {
        await queryRunner.query(
          `ALTER TABLE grain_contract_fixation_items DROP CONSTRAINT "${row.conname}"`
        );
      }

      await queryRunner.query(`
        ALTER TABLE grain_contract_fixation_items
        ADD CONSTRAINT "FK_668635b473e73249f9fb0c878b3"
        FOREIGN KEY (fixation_contract_id) REFERENCES grain_fixation_contracts(id) ON DELETE CASCADE
      `);
    }

    await queryRunner.query(
      `DELETE FROM grain_contracts WHERE type_contract = 'AF'`
    );
  }
}
