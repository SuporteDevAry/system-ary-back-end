import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddAccountFieldToClient1727823800099 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "client",
            new TableColumn({
                name: "account",
                type: "text",
                isArray: true,
                default: "'{}'::text[]",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("client", "account");
    }

}
