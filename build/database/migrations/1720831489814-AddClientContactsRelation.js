"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddClientContactsRelation1720831489814 = void 0;
const typeorm_1 = require("typeorm");
class AddClientContactsRelation1720831489814 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("contact");
        // Verifica se a tabela já existe antes de criá-la
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "contact",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "sector",
                        type: "varchar",
                    },
                    {
                        name: "telephone",
                        type: "varchar",
                    },
                    {
                        name: "cellphone",
                        type: "varchar",
                    },
                    {
                        name: "code_client",
                        type: "int",
                        isNullable: true,
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
                foreignKeys: [
                    {
                        name: "fk_contact_client",
                        columnNames: ["code_client"],
                        referencedTableName: "client",
                        referencedColumnNames: ["code_client"],
                    },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("contact");
        // Verifica se a tabela existe antes de tentar removê-la
        if (hasTable) {
            await queryRunner.dropTable("contact");
        }
    }
}
exports.AddClientContactsRelation1720831489814 = AddClientContactsRelation1720831489814;
//# sourceMappingURL=1720831489814-AddClientContactsRelation.js.map