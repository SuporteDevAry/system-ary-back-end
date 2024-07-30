import { MigrationInterface, QueryRunner, TableUnique } from "typeorm";

export class AddUniqueConstraintToCodeClient1721239748864
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      "client",
      new TableUnique({
        columnNames: ["code_client"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint("client", "UQ_client_code_client");
  }
}
