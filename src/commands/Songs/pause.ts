import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Message, VoiceChannel } from 'discord.js';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: ';pause - Pauses songs.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const voiceChannel = message.member?.voice.channel;

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			await Voice.pause(voiceChannel);
			return reply(message, { content: 'Bot pausado...' });
		}
		// If it's not the correct type
		return send(message, errorMessage[errorCodes.NOT_IN_VOICE]);
	}
}
