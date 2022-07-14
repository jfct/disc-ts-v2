import {
	AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus
} from '@discordjs/voice';
import { TextChannel, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import { client, RadioManager, voiceConnections } from '..';
import { EmbedComponents } from '../components/Embeds.components';
import { RequestService } from '../entities/request/request.service';
import { VoiceManager, VoiceManagerGroup } from '../types/voice.types';
import { RadioModes } from './Radio';

export class Voice {
	static async getVoiceConnection(channel: VoiceChannel): Promise<VoiceManagerGroup | undefined> {
		return voiceConnections.find((element) => element.guildId === channel.guildId);
	}

	static async createConnection(channel: VoiceChannel): Promise<VoiceManager> {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		// If there's a connection open on the same server return the same connection
		if (voiceConnection?.voice) {
			return voiceConnection.voice;
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator
		});
		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

			// Create a new group
			const voiceManagerGroup: VoiceManagerGroup = {
				guildId: channel.guildId,
				voice: {
					connection,
					channel
				}
			};

			// Save on global
			voiceConnections.push(voiceManagerGroup);

			// Return the voiceManager
			return voiceManagerGroup.voice;
		} catch (error) {
			connection.destroy();
			throw error;
		}
	}

	static async createPlayer(channel: VoiceChannel): Promise<AudioPlayer> {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		if (voiceConnection === undefined) {
			throw new Error();
		}

		if (voiceConnection?.voice?.player) {
			return voiceConnection.voice.player;
		}

		const player = createAudioPlayer();

		voiceConnection.voice.player = player;

		player.on(AudioPlayerStatus.Idle, async (oldState, newState) => {
			// console.log('oldState iDLE => ', oldState);
			// console.log('newState => ', newState);

			// CHECK FOR LIST
			const requests = await RequestService.getRequestList();

			// If in radio mode, add more
			if (RadioManager.currentMode() == RadioModes.RADIO && requests.length < 10) {
				RadioManager.addSongs(10, `${process.env.SONG_CHANNEL}`);
			}

			if (requests.length > 0 && requests[0]?.url != null) {
				await RequestService.markDone(requests[0].id);
				const userId = requests[0].user.id;
				const url = requests[0].url;
				const user = client.users.cache.get(userId);
				const username = user?.username ?? '';
				const embed = await EmbedComponents.buildVideo(username, url);
				const textChannel = client.channels.cache.get(requests[0].channelRequested);

				// If requested in text channel (?never)
				if (textChannel instanceof TextChannel) {
					textChannel?.send({ content: 'Now playing:', embeds: [embed] });
				}

				this.playUrl(channel, requests[0].url);
			}
		});

		player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
			// console.log('oldState => ', oldState);
			// console.log('newState => ', newState);
		});

		return player;
	}

	static async playUrl(voiceChannel: VoiceChannel, url: string) {
		console.log('Playing url => ', url);

		const newVoice = await Voice.createConnection(voiceChannel);
		const player = await Voice.createPlayer(voiceChannel);

		const stream = ytdl(url, { filter: 'audioonly' });
		const resource = createAudioResource(stream);

		// If not paused/playing can add
		if ([
				AudioPlayerStatus.Playing,
				AudioPlayerStatus.Paused
			].indexOf(player.state.status) == -1) {
			player.play(resource);
			newVoice.connection.subscribe(player);
		}
	}

	// Returns false if no player
	static async pause(channel: VoiceChannel) {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		if (voiceConnection?.voice?.player) {
			return voiceConnection?.voice.player?.pause();
		} else {
			return false;
		}
	}

	// Returns false if no player
	static async stop(channel: VoiceChannel) {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		if (voiceConnection?.voice?.player) {
			return voiceConnection?.voice.player?.stop();
		} else {
			return false;
		}
	}

	// Returns false if no player
	static async resume(channel: VoiceChannel) {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		if (voiceConnection?.voice?.player) {
			return voiceConnection?.voice.player?.unpause();
		} else {
			return false;
		}
	}

	// Returns false if no player active
	static async getState(channel: VoiceChannel): Promise<AudioPlayerStatus | boolean> {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		if (voiceConnection?.voice.player) {
			return voiceConnection.voice.player.state.status;
		} else {
			return false;
		}
	}

	// static getRandomSound(folder) {
	// 	const appDir = path.dirname(__filename);
	// 	const audioPath = appDir + '\\resources\\' + folder;
	// 	const list: any[] = [];

	// 	fs.readdirSync(audioPath).forEach((file) => {
	// 		list.push(file);
	// 	});

	// 	return pickRandom(list);
	// }
}
