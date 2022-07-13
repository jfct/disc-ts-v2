import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Message, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import ytdl from 'ytdl-core';
import { GenreService } from '../../entities/genre/genre.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { matchYoutubeUrl } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	aliases: [
		'addsong',
		'add'
	],
	description: 'A command that adds songs to the playlist.',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const genreList = await GenreService.findAll();
		const rowBuilder = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId('addSongInteraction')
				.setPlaceholder('Nada')
				.setMinValues(1)
				.setMaxValues(genreList.length)
				.addOptions(
					genreList.map((genre) => ({
						label: genre.description,
						value: String(genre.id)
					}))
				)
		);

		// Gets first hyperlink in message
		const link = await args.pick('hyperlink');

		// Check if any hyperlinks grabbed or if it's a youtube link
		if (Boolean(link) && matchYoutubeUrl(link.toString())) {
			// Delete message with command
			await message.delete();

			const embed = await this.buildEmbed(message.author.username, link.toString());

			// build
			return send(message, {
				content: 'A adicionar musica, escolhe os estilos ...',
				components: [rowBuilder],
				embeds: [embed]
			});
		} else {
			return reply(message, { content: errorMessage[errorCodes.BAD_URL] });
		}
	}

	async buildEmbed(author, url) {
		const info = await ytdl.getInfo(url);
		return (
			new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(info.videoDetails.title)
				.setURL(url)
				//.setAuthor({ name: info.videoDetails.title, iconURL: info.thumbnail_url, url: url })
				.setDescription(`${info.videoDetails.title} \n\n ${info.videoDetails.description}`)
				.setThumbnail(info.videoDetails.thumbnails[0].url)
				.addField('Pedido por: ', author)
				.setTimestamp()
		);
		//			.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
	}
}
