import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { GenreService } from '../../entities/genre/genre.service';

@ApplyOptions<CommandOptions>({
	aliases: [
		'tipos',
		'genres'
	],
	description: ';genres / ;tipos - Adds a genre in the DB.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const genreList = await GenreService.findAll();
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Generos de musica:')
			.setDescription(
				genreList
					.map((genre, index) => {
						return `${index + 1}. **${genre.description}** (id: ${genre.id})\n\n`;
					})
					.join('\n')
			)
			.setTimestamp();

		return reply(message, { embeds: [embed] });
	}
}
