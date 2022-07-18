import { TextChannel, VoiceChannel } from 'discord.js';
import { client } from '..';
import { EmbedComponents } from '../components/Embeds.components';
import { RequestService } from '../entities/request/request.service';
import { SongService } from '../entities/song/song.service';
import { Request } from '../models/request.model';
import { Voice } from './Voice';

export enum RadioModes {
	REGULAR = 0,
	RADIO = 1
}

export class Radio {
	protected textChannel: string;
	protected currentState: RadioModes;
	protected radioGenres: string[];

	constructor() {
		this.currentState = RadioModes.REGULAR;
		this.radioGenres = [];
	}

	currentMode() {
		return this.currentState;
	}

	currentGenres() {
		return this.radioGenres;
	}

	currentTextChannel() {
		return this.textChannel;
	}

	changeGenres(genres: string[]) {
		this.radioGenres = genres;
		return this.radioGenres;
	}

	changeMode(mode: RadioModes) {
		this.currentState = mode;
		return this.currentState;
	}

	async start(voiceChannel: VoiceChannel, textChannelId: string): Promise<boolean> {
		if (this.currentState !== RadioModes.RADIO) return false;

		// Get requests
		const list = await RequestService.getRequestList(voiceChannel.guildId);
		if (list.length <= 0) {
			return false;
		}
		await Voice.playUrl(voiceChannel, list[0].url);

		// Send message to textChannel
		const textChannel = (await client.channels.cache.get(textChannelId)) as TextChannel;
		const embed = await EmbedComponents.buildVideo('Radio', list[0].url);
		textChannel.send({ content: 'Now playing...', embeds: [embed] });

		return true;
	}

	stop() {
		this.currentState = RadioModes.REGULAR;
		this.radioGenres = [];

		return this.currentState;
	}

	async addSongs(nr: number, guildId: string, channelId: string) {
		const songs = await SongService.getRandom(nr, this.radioGenres);

		// Add playcount to each song
		await SongService.addPlayCountBulk(songs.map((value) => value.id.toString()));

		// Adds the 10 random songs
		return await RequestService.createBulk(
			songs.map((song) => {
				const req: Request = new Request();

				req.guildRequested = guildId;
				req.channelRequested = channelId;
				req.url = song.url;
				req.title = song.description;

				return req;
			})
		);
	}
}
