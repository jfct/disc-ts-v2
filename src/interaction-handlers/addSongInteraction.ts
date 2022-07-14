import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { SelectMenuInteraction } from 'discord.js';
import { GenreService } from '../entities/genre/genre.service';
import { SongService } from '../entities/song/song.service';
import { errorCodes, errorMessage } from '../errors/errorMessages';
import { Song } from '../models/song.model';

type parsedGenreData = {
	title: string;
	genres: string[];
	url: string;
	discordId: string;
};

export class addSongInteraction extends InteractionHandler {
	public constructor(ctx: PieceContext) {
		super(ctx, { interactionHandlerType: InteractionHandlerTypes.SelectMenu });
	}
	public async run(interaction: SelectMenuInteraction, parsedData: parsedGenreData) {
		// Convert id string to id of Genres to add to DB
		const genres = await GenreService.getGenreArray(parsedData.genres);

		const song = new Song();
		song.url = parsedData.url;
		song.userId = parsedData.discordId;
		song.genres = genres;
		song.description = parsedData.title;

		await SongService.create(song);

		await interaction.update({
			content: `Adicionado!!!`,
			components: []
		});
	}

	public async parse(interaction: SelectMenuInteraction) {
		// Check for customId
		if (interaction.customId !== 'addSongInteraction') return this.none();

		const embed = interaction.message.embeds[0];

		if (!embed?.url) {
			throw new Error(errorMessage[errorCodes.WHAT_THE_HELL]);
		} else {
			const parsedData: parsedGenreData = {
				title: `${embed.title}`,
				genres: interaction.values,
				url: embed.url,
				discordId: interaction.user.id
			};

			return this.some(parsedData);
		}
	}
}
