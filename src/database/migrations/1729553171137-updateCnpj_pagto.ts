import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCnpjPagto1729553171137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.changeColumn(
      "client",
      "cnpj_pagto",
      new TableColumn({
        name: "cnpj_pagto",
        type: "text", 
        isNullable: true, 
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
   
    await queryRunner.changeColumn(
      "client",
      "cnpj_pagto",
      new TableColumn({
        name: "cnpj_pagto",
        type: "varchar", 
        isNullable: true, 
      })
    );
  }
}
