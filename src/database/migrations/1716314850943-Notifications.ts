import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Notifications1716314850943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        new Table({
            name: "notifications",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "user",
                    type: "varchar",
                },
                {
                    name: "read",
                    type: "boolean",
                },
                {
                    name: "content",
                    type: "varchar",
                },
                {
                    name: "type",
                    type: "varchar",
                }, {
                    name: "isLoading",
                    type: "boolean",
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notifications");
    }

}
