import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddReformaTributariaFieldsToInvoices1780968445477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable("invoices");
        if (!hasTable) return;

        const columns = [
            { name: "ibs_value", type: "numeric" },
            { name: "cbs_value", type: "numeric" },
            { name: "cod_pais", type: "varchar" },
            { name: "ins_est", type: "varchar" },
            { name: "owner_record", type: "varchar" },
            { name: "owner_send", type: "varchar" },
            { name: "code_verif", type: "varchar" },
            { name: "liquidada", type: "varchar" },
            { name: "receipt_date", type: "varchar" },
            { name: "recibo_date", type: "varchar" },
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
            "recibo_date",
            "receipt_date",
            "liquidada",
            "code_verif",
            "owner_send",
            "owner_record",
            "ins_est",
            "cod_pais",
            "cbs_value",
            "ibs_value",
        ];

        for (const column of columns) {
            const hasColumn = await queryRunner.hasColumn("invoices", column);
            if (hasColumn) {
                await queryRunner.dropColumn("invoices", column);
            }
        }

    }

}
