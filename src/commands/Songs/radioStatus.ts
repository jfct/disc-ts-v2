import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { RadioManager } from '../..';
import { GenreService } from '../../entities/genre/genre.service';

@ApplyOptions<CommandOptions>({
	description: 'Shows the status of the radio.'
})
export class radioStatus extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		const guildIds = process.env.MAIN_GUILD ? [process.env.MAIN_GUILD] : [];

		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		// Checking if the message author is a bot.
		if (interaction.user.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!interaction.guild) return false;

		const isRadio = RadioManager.currentMode();

		if (isRadio) {
			const genres = RadioManager.currentGenres();
			const genreNames = await GenreService.getGenreNames(genres);
			return interaction.reply({ content: `Está em modo Rádio\n\`\`${genreNames.map((genre) => genre?.description).join('``  ``')}\`\`` });
		}
		return interaction.reply({ ephemeral: true, content: 'Não está em modo Rádio.' });
	}
}
