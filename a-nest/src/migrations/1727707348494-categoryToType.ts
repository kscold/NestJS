import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1727707348494 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "mentions" RENAME COLUMN "category" TO "type"',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "metnions" RENAME COLUMN "type" TO "category"',
        );
    }
}
