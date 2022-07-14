import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultGenreValues1657718100585 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO genre (description) VALUES ('Funk');`);
		await queryRunner.query(`INSERT INTO genre (description) VALUES ('Troll');`);
		await queryRunner.query(`INSERT INTO genre (description) VALUES ('Eurobeat');`);
		await queryRunner.query(`INSERT INTO genre (description) VALUES ('Chill');`);
		await queryRunner.query(`INSERT INTO genre (description) VALUES ('Tuga');`);
		await queryRunner.query(`INSERT INTO genre (description) VALUES ('Geral');`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DELETE FROM genre`);
	}
}
