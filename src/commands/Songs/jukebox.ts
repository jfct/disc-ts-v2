import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Message, VoiceChannel } from 'discord.js';
import { SelectMenuComponents } from '../..//components/SelectMenu.components';
import { errorCodes, errorMessage } from '../../errors/errorMessages';

@ApplyOptions<CommandOptions>({
	aliases: [
		'radio',
		'random'
	],
	description: 'A command that gets songs from the DB.',
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
			const genreList = await SelectMenuComponents.genreListMenu('startRadioInteraction');

			return send(message, {
				content: 'A começar jukebox, escolhe os estilos ...',
				components: [genreList]
			});
		}
		// If it's not the correct type
		return send(message, errorMessage[errorCodes.NOT_IN_VOICE]);
	}
}
