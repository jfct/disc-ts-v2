import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { GenreService } from '../entities/genre/genre.service';

export class SelectMenuComponents {
	static async genreListMenu(customId: string): Promise<MessageActionRow> {
		const genreList = await GenreService.findAll();

		return new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(customId)
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
	}
}
