import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { SelectMenuInteraction } from 'discord.js';
import { SongCreationDto } from '../entities/song/song.dto';
import { SongService } from '../entities/song/song.service';
import { UserService } from '../entities/user/user.service';

// @ApplyOptions<InteractionHandlerOptions>({
// 	interactionHandlerType: InteractionHandlerTypes.MessageComponent,
// 	name: 'addSongInteraction'
// })
export class addSongInteraction extends InteractionHandler {
	public constructor(ctx: PieceContext) {
		super(ctx, { interactionHandlerType: InteractionHandlerTypes.SelectMenu });
	}
	public async run(interaction: SelectMenuInteraction, parsedData: parsedGenreData) {
		const user = await UserService.findOne(parsedData.discordId);

		if (user === null) {
			throw Error('NO USER ID');
		} else {
			const values = parsedData.genres.map((id): SongCreationDto => {
				return {
					// Gets the title to use as description
					description: parsedData.title,
					url: parsedData.url,
					genreId: id,
					userId: user.id.toString()
				};
			});
			SongService.createMultiple(values);

			await interaction.update({
				content: `Adicionado!!!`,
				components: []
			});
		}
	}

	public async parse(interaction: SelectMenuInteraction) {
		// Check for customId
		if (interaction.customId !== 'addSongInteraction') return this.none();

		const embed = interaction.message.embeds[0];
		const parsedData: parsedGenreData = {
			title: `${embed.title}`,
			genres: interaction.values,
			url: interaction.message.content,
			discordId: interaction.user.id
		};
		return this.some(parsedData);
	}
}

type parsedGenreData = {
	title: string;
	genres: string[];
	url: string;
	discordId: string;
};
