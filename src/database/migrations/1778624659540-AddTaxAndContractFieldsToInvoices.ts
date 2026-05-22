import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTaxAndContractFieldsToInvoices1778624659540 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable) return;

        const columns = [
            { name: "pis_value", type: "decimal" },
            { name: "cofins_value", type: "decimal" },
            { name: "csll_value", type: "decimal" },
            { name: "iss_value", type: "decimal" },
            { name: "number_contract", type: "varchar" },
            { name: "exportacao", type: "varchar" },
        ];

        for (const column of columns) {
            const hasColumn = await queryRunner.hasColumn("invoices", column.name);
            if (!hasColumn) {
                await queryRunner.addColumn(
                    "invoices",
                    new TableColumn({
                        name: column.name,
                        type: column.type,
                        isNullable: true,
                    }),
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable) return;

        const columns = [
            "exportacao",
            "number_contract",
            "iss_value",
            "csll_value",
            "cofins_value",
            "pis_value",
        ];

        for (const column of columns) {
            const hasColumn = await queryRunner.hasColumn("invoices", column);
            if (hasColumn) {
                await queryRunner.dropColumn("invoices", column);
            }
        }
    }

}
