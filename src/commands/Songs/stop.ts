import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Message, VoiceChannel } from 'discord.js';
import { RadioManager } from '../..';
import { RequestService } from '../../entities/request/request.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'A command that pauses songs.',
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
			await Voice.stop(voiceChannel);
			await RequestService.markAllDone();
			RadioManager.stop();

			return reply(message, { content: 'Bot parado, queue limpa!' });
		}
		// If it's not the correct type
		return send(message, errorMessage[errorCodes.NOT_IN_VOICE]);
	}
}
