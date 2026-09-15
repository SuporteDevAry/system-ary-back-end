"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broker1787511369747 = void 0;
const typeorm_1 = require("typeorm");
class Broker1787511369747 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable("broker");
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: "broker",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "mesa",
                        type: "varchar",
                    },
                    {
                        name: "broker",
                        type: "varchar",
                    },
                    {
                        name: "product",
                        type: "varchar",
                    },
                    {
                        name: "broker_name",
                        type: "varchar",
                    },
                    {
                        name: "broker_nick",
                        type: "varchar",
                    },
                    {
                        name: "broker_abbrev",
                        type: "varchar",
                    },
                    {
                        name: "company_name",
                        type: "varchar",
                    },
                    {
                        name: "cnpj_cpf",
                        type: "varchar",
                    },
                    {
                        name: "bank_number",
                        type: "varchar",
                    },
                    {
                        name: "bank_name",
                        type: "varchar",
                    },
                    {
                        name: "ag_number",
                        type: "varchar",
                    },
                    {
                        name: "account_number",
                        type: "varchar",
                    },
                    {
                        name: "date_ini",
                        type: "varchar",
                    },
                    {
                        name: "date_fin",
                        type: "varchar",
                    },
                    {
                        name: "commision",
                        type: "decimal",
                    },
                    {
                        name: "cctipo",
                        type: "varchar",
                    },
                    {
                        name: "ccdesconto",
                        type: "decimal",
                    },
                    {
                        name: "sca",
                        type: "varchar",
                    },
                    {
                        name: "aj_prolab",
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
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable("broker");
        if (hasTable) {
            await queryRunner.dropTable("broker");
        }
    }
}
exports.Broker1787511369747 = Broker1787511369747;
//# sourceMappingURL=1787511369747-Broker.js.map