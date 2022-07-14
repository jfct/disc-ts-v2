import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Message } from 'discord.js';
import { EmbedComponents } from '../../components/Embeds.components';
import { SelectMenuComponents } from '../../components/SelectMenu.components';
import { SongService } from '../../entities/song/song.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { matchYoutubeUrl } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	aliases: [
		'addsongs',
		'adddb',
		'adddatabase',
		'save'
	],
	description: 'A command that adds songs to the database.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		try {
			// Gets first hyperlink in message
			const hyperlink = await args.pick('hyperlink');

			// Check if any hyperlinks grabbed or if it's a youtube link
			if (Boolean(hyperlink) && matchYoutubeUrl(hyperlink.toString())) {
				const link = hyperlink.toString();
				// Delete message with command
				await message.delete();

				// Check if the song doesn't exist in the playlist yet
				if (await SongService.checkSongExists(link)) {
					return send(message, { content: 'Já está adicionada manuh' });
				}

				const embed = await EmbedComponents.buildVideo(message.author.username, link);
				const genreList = await SelectMenuComponents.genreListMenu('addSongInteraction');

				return send(message, {
					content: 'A adicionar musica, escolhe os estilos ...',
					components: [genreList],
					embeds: [embed]
				});
			}
			return this.returnBadURL(message);
		} catch (err) {
			this.container.logger.warn('Bad URL on command');
			return this.returnBadURL(message);
		}
	}

	private returnBadURL(message: Message<boolean>) {
		return reply(message, { content: errorMessage[errorCodes.BAD_URL] });
	}
}
