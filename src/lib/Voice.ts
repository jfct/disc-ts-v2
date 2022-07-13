import {
	AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus
} from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import { voiceConnections } from '..';
import { VoiceManager, VoiceManagerGroup } from '../types/voice.types';

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

		console.log('\nAQUI =>>>>>>', voiceConnection.voice);

		if (voiceConnection?.voice?.player) {
			console.log('returna o mesmo voice player');
			return voiceConnection.voice.player;
		}

		const player = createAudioPlayer();

		voiceConnection.voice.player = player;

		player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
			console.log('oldState => ', oldState);
			console.log('newState => ', newState);
		});

		player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
			console.log('oldState iDLE => ', oldState);
			console.log('newState => ', newState);

			Voice.playFunk(channel);
		});

		return player;
	}

	static async playFunk(channel: VoiceChannel) {
		const arr = [
			'https://www.youtube.com/watch?v=Qpx9k9icfn0',
			'https://www.youtube.com/watch?v=COyoezo3Xw4',
			'https://www.youtube.com/watch?v=0okmuq4P83o'
		];

		const mus = arr[Math.floor(Math.random() * (arr.length - 1 + 1) + 1) - 1];

		await Voice.playUrl(channel, mus);
	}

	static async playUrl(voiceChannel: VoiceChannel, url: string) {
		console.log('url => ', url);

		const newVoice = await Voice.createConnection(voiceChannel);
		const player = await Voice.createPlayer(voiceChannel);
		const info = await ytdl.getInfo(url);

		const title = info.videoDetails.title;
		const musicLength = info.videoDetails.lengthSeconds;
		const channelName = info.videoDetails.ownerChannelName;

		console.log(info);

		const stream = ytdl(url, { filter: 'audioonly' });
		const resource = createAudioResource(stream);

		// console.log('RES => ', resource);

		// if (!(player.state.status === AudioPlayerStatus.Playing)) {
		// 	player.play(resource);
		// 	newVoice.connection.subscribe(player);
		// }

		// if (newVoice.player?.state === AudioPlayerPlayingState) {
		// 	console.log('Playing...');
		// }
		// newVoice.player?.state === player.play(resource);
	}

	// static playSound(audioName, type) {
	// 	const appDir = path.dirname(__filename);
	// 	const audioPath = appDir + '\\resources\\' + type + '\\' + audioName;
	// 	const resource = createAudioResource(audioPath);
	// 	global.player.play(resource);
	// }

	// static playRandomSound(folder) {
	// 	const appDir = path.dirname(__filename);
	// 	const audioPath = appDir + '\\resources\\' + folder;
	// 	const file = Voice.getRandomSound(folder);
	// 	const resource = createAudioResource(audioPath + '\\' + file);
	// 	global.player.play(resource);
	// }

	static async stop(channel: VoiceChannel) {
		const voiceConnection = await Voice.getVoiceConnection(channel);

		if (voiceConnection?.voice?.player) {
			return true;
		} else {
			return voiceConnection?.voice.player?.stop();
		}
	}

	static getState() {
		return global.player.AudioPlayerState;
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
