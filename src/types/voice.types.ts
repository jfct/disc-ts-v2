import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';

export interface VoiceManager {
	channel: VoiceChannel;
	connection: VoiceConnection;
	player?: AudioPlayer;
}

export interface VoiceManagerGroup {
	guildId: string;
	voice: VoiceManager;
}
