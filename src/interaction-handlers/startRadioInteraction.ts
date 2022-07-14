import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { SelectMenuInteraction } from 'discord.js';
import { RadioManager } from '..';
import { RadioModes } from '../lib/Radio';

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
		RadioManager.changeGenres(interaction.values);
		RadioManager.changeMode(RadioModes.RADIO);
		await RadioManager.addSongs(10, interaction.message.id);

		await interaction.update({
			content: `Iniciado modo rádio!! :poop:`,
			components: []
		});
	}

	public async parse(interaction: SelectMenuInteraction) {
		// Check for customId
		if (interaction.customId !== 'startRadioInteraction') return this.none();
		return this.some();
	}
}
