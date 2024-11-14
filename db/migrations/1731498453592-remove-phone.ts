import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePhone1731498453592 implements MigrationInterface {
    name = 'RemovePhone1731498453592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

}
