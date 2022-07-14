import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Message } from 'discord.js';
import { GenreService } from '../../entities/genre/genre.service';
import { Genre } from '../../models/genre.model';

@ApplyOptions<CommandOptions>({
	aliases: [
		'newGenre',
		'addcategory'
	],
	description: ';addgenre <nome_genero> - Adds a genre in the DB.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const genre = new Genre();
		const name = await args.pick('string');
		genre.description = name;

		await GenreService.create(genre);

		return reply(message, { content: `Genre ${name} adicionado! :poop:` });
	}
}
