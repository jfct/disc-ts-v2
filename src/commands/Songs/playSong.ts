import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Message, VoiceChannel } from 'discord.js';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'play song'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const voiceChannel = message.member?.voice.channel;

		this.container.logger.debug(voiceChannel instanceof VoiceChannel);
		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			const url = 'https://www.youtube.com/watch?v=rUWxSEwctFU';

			this.container.logger.debug('!!!!!!');
			return await Voice.playUrl(voiceChannel, url);
			//const channel = await message.guild.channels.fetch(process.env.SONG_CHANNEL);

			// If there's no channel defined
			// return send(message, errorMessage[errorCodes.NO_CHANNEL_DEFINED]);
		}
		// If it's not the correct type
		return send(message, errorMessage[errorCodes.NOT_IN_VOICE]);
	}
}
