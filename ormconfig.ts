import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
	type: 'sqlite',
	database: 'discord.db',
	logging: true,
	synchronize: true,
	name: 'default',
	entities: ['src/**/**.model{.ts,.js}'],
	subscribers: ['src/subscriber/**/*{.ts,.js}'],
	migrations: ['src/migrations/**/*{.ts,.js}'],
	migrationsTableName: 'migrations'
});
