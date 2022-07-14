import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Message } from 'discord.js';
import { SongService } from '../../entities/song/song.service';

@ApplyOptions<CommandOptions>({
	aliases: [
		'r',
		'remove',
		'delete',
		'apagar',
		'trash'
	],
	description: ';remove / ;r - Removes songs to the database.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const id = await args.pick('number');
		if (id != null) {
			const song = await SongService.find(id);
			if (song != undefined) {
				const res = await SongService.remove(song);
				return send(message, { content: `Removido - ${res.description}` });
			}
			return send(message, { content: 'Id não encontrado' });
		}
		return send(message, { content: 'Id inválido manuh' });
	}
}
