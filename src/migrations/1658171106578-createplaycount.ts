import { MigrationInterface, QueryRunner } from 'typeorm';

export class createplaycount1658171106578 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE song ADD playCount INTEGER DEFAULT 0 NOT NULL;`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`BEGIN TRANSACTION;`);
		await queryRunner.query(`CREATE TEMPORARY TABLE t1_backup(id,created_at,updated_at,url,description,guildId,userId);`);
		await queryRunner.query(`INSERT INTO t1_backup SELECT id,created_at,updated_at,url,description,guildId,userId FROM song;`);
		await queryRunner.query(`DROP TABLE song;`);
		await queryRunner.query(`CREATE TABLE song(id,created_at,updated_at,url,description,guildId,userId);`);
		await queryRunner.query(`INSERT INTO song SELECT * FROM t1_backup;`);
		await queryRunner.query(`DROP TABLE t1_backup;`);
		await queryRunner.query(`COMMIT`);
	}
}
