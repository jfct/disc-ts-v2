import { LogLevel, SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Radio } from './lib/Radio';
import './lib/setup';
import { Command } from './models/command.model';
import { Genre } from './models/genre.model';
import { Request } from './models/request.model';
import { Song } from './models/song.model';
import { User } from './models/user.model';
import { VoiceManagerGroup } from './types/voice.types';

// ################### State managers

export const client = new SapphireClient({
	defaultPrefix: ';',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	loadMessageCommandListeners: true,
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	]
});

export const voiceConnections: VoiceManagerGroup[] = [];
export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: path.join(process.cwd(), 'discord.db'),
	synchronize: true,
	entities: [
		Command,
		Genre,
		Request,
		Song,
		User
	],
	logging: 'all'
});

export const RadioManager = new Radio();

// ###################

// ################### Process events

process.on('exit', () => {
	console.log('\nGracefully shutting down client');
	client.destroy();
});

process.on('SIGINT', function () {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	// some other closing procedures go here
	process.exit(0);
});

// ###################

const main = async () => {
	try {
		// Initialize Client (sapphire)
		client.logger.info('Logging in');
		await client.login(process.env.DISCORD_TOKEN);
		client.logger.info('logged in');

		// Initialize DB connection
		AppDataSource.initialize()
			.then(() => {
				//const db: Database = Database.build();
				//await db.close();
			})
			.catch((err) => {
				console.log('DB Init error! => ', err);
			});
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
