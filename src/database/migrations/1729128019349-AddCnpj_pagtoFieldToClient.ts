import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCnpjPagtoFieldToClient1729128019349
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "client",
      new TableColumn({
        name: "cnpj_pagto",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("client", "cnpj_pagto");
  }
}
