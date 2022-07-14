import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';
import { EmbedComponents } from '../../components/Embeds.components';

@ApplyOptions<CommandOptions>({
	aliases: [
		'showAll',
		'showSongs',
		'songList',
		'list',
		'songlist'
	],
	description: ';list / ;songlist - Shows all songs of the database.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild || !message.guildId) return false;

		// TODO: Show list with genres

		const paginatedMessage = await EmbedComponents.songList(message.guildId);
		return paginatedMessage.run(message, message.author);
	}
}
