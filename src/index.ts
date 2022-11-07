import { AudioPlayer } from '@discordjs/voice';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import 'ffmpeg';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { RequestService } from './entities/request/request.service';
import { Radio } from './lib/Radio';
import './lib/setup';
import { Command } from './models/command.model';
import { Genre } from './models/genre.model';
import { Request } from './models/request.model';
import { Song } from './models/song.model';
import { User } from './models/user.model';

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

//DEBUGS;
// client.on('debug', console.log);
// client.on('error', console.error);
// client.on('warn', console.warn);

//export const voiceConnections: VoiceManagerGroup[] = [];
export const audioPlayers: AudioPlayer[] = [];
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

process.on('exit', async () => {
	console.log('\nGracefully shutting down client...');
	client.destroy();
});

process.on('SIGINT', function () {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	// some other closing procedures go here
	process.exit(1);
});

// ###################

// ################### Global vars

export const nrRandomSongsToAdd = 3;

// ###################

const main = async () => {
	try {
		// Initialize Client (sapphire)
		client.logger.info('Logging in');
		await client.login(process.env.DISCORD_TOKEN);
		client.logger.info('logged in');

		// Initialize DB connection
		await AppDataSource.initialize()
			.then(() => {
				//const db: Database = Database.build();
				//await db.close();
			})
			.catch((err) => {
				console.log('DB Init error! => ', err);
			});

		console.log('Clear old requests');
		await RequestService.cleanAllRequests();
		console.log('Cleared!');

		// "Clean commands"
		// const commands = await client.application?.commands.fetch();
		// commands?.each((command) => command.delete().then(console.log).catch(console.error));
	} catch (error) {
		console.log(error);
		client.destroy();
		process.exit(1);
	}
};

main();
