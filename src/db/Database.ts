import { DataSource } from 'typeorm';
import { AppDataSource } from '..';

export class Database {
	db: DataSource;

	constructor(db: DataSource) {
		this.db = db;
	}

	static async build(): Promise<Database> {
		return new Database(AppDataSource);
	}

	async close(): Promise<void> {
		if (this?.db) {
			return this.db.close();
		}
	}
}
