import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateContatos1710886127461 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "contatos",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "cli_codigo",
                        type: "varchar",
                    },
                    {
                        name: "sequencia",
                        type: "varchar",
                    },
                    {
                        name: "nome",
                        type: "varchar",
                    },
                    {
                        name: "cargo",
                        type: "varchar",
                    }, {
                        name: "complemento",
                        type: "varchar",
                    }, {
                        name: "email",
                        type: "varchar",
                    }, {
                        name: "telefone",
                        type: "varchar",
                    }, {
                        name: "celular",
                        type: "varchar",
                    }, {
                        name: "recebe_email",
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("contatos");
    }

}
