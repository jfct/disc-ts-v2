import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';
import { EmbedComponents } from '../../components/Embeds.components';

@ApplyOptions<CommandOptions>({
	aliases: [
		'q',
		'check',
		'listSongs',
		'songList'
	],
	description: ';queue / ;q - Shows the current queue.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild || !message.guildId) return false;

		const paginatedMessage = await EmbedComponents.queue(message.guildId);
		return paginatedMessage.run(message, message.author);
	}
}
