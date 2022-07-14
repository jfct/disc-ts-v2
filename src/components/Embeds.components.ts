import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { MessageEmbed } from 'discord.js';
import ytdl from 'ytdl-core';
import { RequestService } from '../entities/request/request.service';

export class EmbedComponents {
	// Returns embed with request info
	static async buildVideo(author: string, url: string): Promise<MessageEmbed> {
		const info = await ytdl.getInfo(url);

		return new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(info.videoDetails.title)
			.setURL(url)
			.setDescription(`${info.videoDetails.title} \n\n ${info.videoDetails.description}`)
			.setThumbnail(info.videoDetails.thumbnails[0].url)
			.addField('Pedido por: ', author)
			.setTimestamp();
	}

	static async queue(): Promise<PaginatedMessage> {
		const list = await RequestService.getRequestList();
		let idx = 0;
		let page = 1;

		const paginatedMessage = new PaginatedMessage({
			template: new MessageEmbed()
				// Be sure to add a space so this is offset from the page numbers!
				.setFooter({ text: ' bot queue' })
		});

		while (idx < list.length) {
			paginatedMessage.addPageEmbed((embed) =>
				embed //
					.setDescription(
						list
							.slice(idx, idx + 5)
							.map((req) => {
								return `${idx + 1}. ${req.title}`;
							})
							.join('\n')
					)
					.setTitle(`Page ${page}`)
			);
			idx += 5;
			page++;
		}

		return paginatedMessage;
	}
}
