import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { MessageEmbed } from 'discord.js';
import playdl from 'play-dl';
import { client } from '..';
import { RequestService } from '../entities/request/request.service';
import { SongService } from '../entities/song/song.service';
import { Genre } from '../models/genre.model';
import { Song } from '../models/song.model';

export class EmbedComponents {
	static async songEditEmbed(song: Song) {
		const info = await playdl.video_info(song.url);
		const thumbnail = info.video_details.thumbnails[0].url;

		return new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${song.description}`)
			.setURL(song.url)
			.setDescription(`Editing.... ${song.description}`)
			.setThumbnail(thumbnail)
			.setTimestamp();
	}

	// Returns embed with request info
	static async buildVideo(author: string, url: string): Promise<MessageEmbed> {
		const info = await playdl.video_info(url);
		const details = info.video_details.description ?? ' ';
		const description = details.substring(0, 150);

		return new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${info.video_details.title}`)
			.setURL(url)
			.setDescription(`${info.video_details.title} \n\n ${description}`)
			.setThumbnail(info.video_details.thumbnails[0].url)
			.addField('Pedido por: ', `${author}`)
			.setTimestamp();
	}

	// Returns a paginatedmessage embed with the request list
	static async queue(guildId: string): Promise<PaginatedMessage> {
		const list = await RequestService.getRequestList(guildId);
		let idx = 0;
		let page = 1;

		const paginatedMessage = new PaginatedMessage({
			template: new MessageEmbed()
				// Be sure to add a space so this is offset from the page numbers!
				.setFooter({ text: ' bot queue' })
		});

		// If no songs found
		if (list.length <= 0) {
			paginatedMessage.addPageBuilder((builder) =>
				builder //
					.setContent('Lista vazia manuh')
					.setEmbeds([new MessageEmbed().setTimestamp()])
			);
		}
		while (idx < list.length) {
			paginatedMessage.addPageEmbed((embed) =>
				embed //
					.setDescription(
						list
							.slice(idx, idx + 5)
							.map((req) => {
								idx++;
								return `${idx}. ${req.title}`;
							})
							.join('\n')
					)
					.setTitle(`Page ${page}`)
			);
			page++;
			idx += 5;
		}

		// Remove custom entry by sapphire
		paginatedMessage.actions.delete('@sapphire/paginated-messages.goToPage');

		return paginatedMessage;
	}

	// Returns a paginatedmessage embed with a song list
	static async songList(guildId: string, genres?: Genre[]): Promise<PaginatedMessage> {
		const list = await SongService.getList(guildId, genres);
		let idx = 0;
		let page = 1;

		const paginatedMessage = new PaginatedMessage({
			template: new MessageEmbed()
				// Be sure to add a space so this is offset from the page numbers!
				.setFooter({ text: ' song list' })
		});

		// If no songs found
		if (list.length <= 0) {
			paginatedMessage.addPageBuilder((builder) =>
				builder //
					.setContent('Lista vazia manuh')
					.setEmbeds([new MessageEmbed().setTimestamp()])
			);
		}
		while (idx < list.length) {
			paginatedMessage.addPageEmbed((embed) =>
				embed //
					.setDescription(
						list
							.slice(idx, idx + 15)
							.map((song) => {
								return `ID[${song.id}] ${song.description}\n\`\`${song.genres.map((genre) => genre.description).join('``  ``')}\`\``;
							})
							.join('\n')
					)
					.setTitle(`Page ${page}`)
			);

			idx += 15;
			page++;
		}

		// Remove custom entry by sapphire
		paginatedMessage.actions.delete('@sapphire/paginated-messages.goToPage');

		return paginatedMessage;
	}

	static async listCommands(): Promise<MessageEmbed> {
		const commandList = client.stores.get('commands');
		const commands = {};

		commandList.forEach((command, name) => {
			const key = command.fullCategory[0];

			if (commands.hasOwnProperty(key)) {
				commands[key].push({
					name: name,
					text: `\n**${name}**: ${command.description}`
				});
			} else {
				commands[key] = [
					{
						name: name,
						text: `\n**${name}**\n ${command.description}`
					}
				];
			}
		});

		const embed = new MessageEmbed() //
			.setColor('#0099ff')
			.setTitle('Comandos')
			.setAuthor({
				name: 'Super Mantij',
				iconURL: 'https://i.imgur.com/DFXOPFd.png'
			})
			.setTimestamp();

		for (const category in commands) {
			let content = '';
			// Sort commands inside a category
			const sortedCommands = commands[category].sort((a, b) => (a.name > b.name ? 1 : -1));

			sortedCommands.forEach((item) => {
				content += item.text;
			});

			embed.addField(`**${category}**`, `\n${content}`, false);
		}

		return embed;
	}
}
