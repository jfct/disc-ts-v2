import {
	AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
	NoSubscriberBehavior,
	VoiceConnection,
	VoiceConnectionStatus
} from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';
import play from 'play-dl';
import { audioPlayers, client, nrRandomSongsToAdd, RadioManager } from '..';
import { EmbedComponents } from '../components/Embeds.components';
import { RequestService } from '../entities/request/request.service';
import { RadioModes } from './Radio';
import path = require('path');

export class Voice {
	static async getVC(guildId: string): Promise<VoiceConnection | undefined> {
		return getVoiceConnection(guildId);
	}

	static async createCon(channel: VoiceChannel): Promise<VoiceConnection> {
		const voiceConnection = await Voice.getVC(channel.guildId);

		// If there's a connection open on the same server return the same connection
		if (voiceConnection) {
			return voiceConnection;
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			selfMute: false,
			selfDeaf: false,
			adapterCreator: channel.guild.voiceAdapterCreator,
			debug: true
		});

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 30_00);
			connection.once('error', console.error);
			return connection;
		} catch (error) {
			connection.destroy();
			throw error;
		}
	}

	static async createPlayer(channel: VoiceChannel): Promise<AudioPlayer> {
		if (audioPlayers[channel.guildId]) {
			return audioPlayers[channel.guildId];
		}

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play
			}
		});

		player.on(AudioPlayerStatus.Idle, async () => {
			if (!this.playNextRequest(channel)) {
				// If no requests, just pause
				// TODO: Remove?
				player.pause();
			}
		});

		// player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
		// 	// console.log('oldState => ', oldState);
		// 	// console.log('newState => ', newState);
		// });

		audioPlayers[channel.guildId] = player;

		return player;
	}

	static async playNextRequest(channel: VoiceChannel) {
		const voiceConnection = await this.getVC(channel.guildId);

		if (voiceConnection === undefined) {
			// TODO:
			// FIXME:
			throw new Error('playNextRequest error, voiceConnection undefined');
		}

		// CHECK FOR LIST
		const requests = await RequestService.getRequestList(channel.guildId);

		// If in radio mode, add more
		if (RadioManager.currentMode() == RadioModes.RADIO && requests.length < 2) {
			RadioManager.addSongs(nrRandomSongsToAdd, channel.guildId, RadioManager.currentTextChannel());
		}

		if (requests.length > 0 && requests[0]?.url != null) {
			await RequestService.markDone(requests[0].id);
			const userId = requests[0].user?.id ?? null;
			const url = requests[0].url;
			const user = client.users.cache.get(userId);
			// TODO: Fix
			let username;
			if (user === null) {
				username = 'Radio';
			} else {
				username = user?.username ?? '---';
			}
			const embed = await EmbedComponents.buildVideo(username, url);
			const guild = await client.guilds.fetch(channel.guildId);
			const textChannel = await guild.channels.fetch(requests[0].channelRequested);

			// If requested in text channel (?never)
			if (textChannel !== null && textChannel.isText()) {
				textChannel?.send({ content: 'Now playing:', embeds: [embed] });
			}

			return this.playUrl(channel, requests[0].url);
		} else {
			return false;
		}
	}

	static async playUrl(voiceChannel: VoiceChannel, url: string) {
		let connection = await this.getVC(voiceChannel.guildId);

		if (connection === undefined) {
			connection = await Voice.createCon(voiceChannel);
		}

		const player = await Voice.createPlayer(voiceChannel);

		console.log('Playing url => ', url);
		const dload = await play.stream(url);
		const resource = createAudioResource(dload.stream, {
			inputType: dload.type
		});

		// If not paused/playing can add
		if ([
				AudioPlayerStatus.Playing,
				AudioPlayerStatus.Paused
			].indexOf(player.state.status) == -1) {
			player.play(resource);
			connection.subscribe(player);
		}
		return true;
	}

	static async playVoice(voiceChannel: VoiceChannel, voiceLineUrl: string) {
		let connection = await this.getVC(voiceChannel.guildId);

		if (connection === undefined) {
			connection = await Voice.createCon(voiceChannel);
		}

		const player = await Voice.createPlayer(voiceChannel);

		console.log('Playing voice => ', voiceLineUrl);
		const resource = createAudioResource(voiceLineUrl);

		// If not paused/playing can add
		if ([
				AudioPlayerStatus.Playing,
				AudioPlayerStatus.Paused
			].indexOf(player.state.status) == -1) {
			player.play(resource);
			connection.subscribe(player);
		}
		return true;
	}

	/**
	 * Leaves the voice channel
	 */
	static async join(voiceChannel: VoiceChannel) {
		const connection = await this.getVC(voiceChannel.guildId);

		if (connection === undefined) {
			return Voice.createCon(voiceChannel);
		}

		if (connection.joinConfig.channelId != voiceChannel.id) {
			connection.destroy();
			console.log('connectin');
			return Voice.createCon(voiceChannel);
		}

		return connection;
	}

	/**
	 * Leaves the voice channel
	 */
	static async leave(voiceChannel: VoiceChannel) {
		const connection = await this.getVC(voiceChannel.guildId);
		return connection?.destroy();
	}

	// Returns false if no player
	static async pause(channel: VoiceChannel) {
		const player: AudioPlayer = audioPlayers[channel.guildId];

		if (player) {
			return player.pause();
		} else {
			return false;
		}
	}

	// Returns false if no player
	static async stop(channel: VoiceChannel) {
		const player: AudioPlayer = audioPlayers[channel.guildId];

		if (player) {
			return player.stop();
		} else {
			return false;
		}
	}

	// Returns false if no player
	static async resume(channel: VoiceChannel) {
		const player: AudioPlayer = audioPlayers[channel.guildId];

		if (player) {
			return player.unpause();
		} else {
			return false;
		}
	}

	// Returns false if no player active
	static async getState(channel: VoiceChannel): Promise<AudioPlayerStatus | boolean> {
		const player: AudioPlayer = audioPlayers[channel.guildId];

		if (player) {
			return player.state.status;
		} else {
			return false;
		}
	}
}
