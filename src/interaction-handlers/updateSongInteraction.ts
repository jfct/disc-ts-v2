import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { SelectMenuInteraction } from 'discord.js';
import { SongService } from '../entities/song/song.service';
import { errorCodes, errorMessage } from '../errors/errorMessages';

type parsedSongData = {
	genres: string[];
	songId: string;
};

export class updateSongInteraction extends InteractionHandler {
	public constructor(ctx: PieceContext) {
		super(ctx, { interactionHandlerType: InteractionHandlerTypes.SelectMenu });
	}
	public async run(interaction: SelectMenuInteraction, parsedData: parsedSongData) {
		// Check if message is not in DM channel
		if (!interaction.guildId) return false;

		// Convert id string to id of Genres to add to DB
		const genres = await SongService.updateGenres(parsedData.songId, parsedData.genres);

		return await interaction.update({
			content: `Alterados os generos!!\n\`\`${genres.map((genre) => genre?.description).join('`` ``')}\`\``,
			components: []
		});
	}

	public async parse(interaction: SelectMenuInteraction) {
		// Check for customId
		if (interaction.customId !== 'updateSongInteraction') return this.none();

		const embed = interaction.message.embeds[0];

		if (!embed?.url) {
			throw new Error(errorMessage[errorCodes.WHAT_THE_HELL]);
		} else {
			const parsedData: parsedSongData = {
				genres: interaction.values,
				songId: interaction.message.content
			};

			return this.some(parsedData);
		}
	}
}
