import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { SelectMenuInteraction, VoiceChannel } from 'discord.js';
import { RadioManager } from '..';
import { RequestService } from '../entities/request/request.service';
import { errorCodes, errorMessage } from '../errors/errorMessages';

type parsedGenreData = {
	title: string;
	genres: string[];
	url: string;
	discordId: string;
};

export class updateRadioInteraction extends InteractionHandler {
	public constructor(ctx: PieceContext) {
		super(ctx, { interactionHandlerType: InteractionHandlerTypes.SelectMenu });
	}
	public async run(interaction: SelectMenuInteraction, parsedData: parsedGenreData) {
		// Checking if the message was sent in a DM channel.
		if (!interaction.guild) return false;

		// Convert id string to id of Genres to add to DB
		RadioManager.changeGenres(interaction.values);
		RequestService.markAllDone(interaction.guild.id);

		if (interaction.guildId === null) {
			return interaction.update({ content: errorMessage[errorCodes.WHAT_THE_HELL] });
		}
		await RadioManager.addSongs(10, interaction.guildId, interaction.channelId);

		// Get the voice channel where the user is in
		const member = await interaction.guild?.members.search({ query: interaction.user.username });
		const channel = member?.get(interaction.user.id)?.voice.channel;

		if (channel !== undefined) {
			if (await RadioManager.start(channel as VoiceChannel, interaction.channelId)) {
				return interaction.update({
					content: `Generos alterados!! :poop:`,
					components: []
				});
			} else {
				return interaction.update({
					content: `Não há sons! :monkey:`,
					components: []
				});
			}
		}
		return interaction.update({ content: errorMessage[errorCodes.NOT_IN_VOICE] });
	}

	public async parse(interaction: SelectMenuInteraction) {
		// Check for customId
		if (interaction.customId !== 'updateRadioInteraction') return this.none();
		return this.some();
	}
}
