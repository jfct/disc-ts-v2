import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { GenreService } from '../../entities/genre/genre.service';
import { Genre } from '../../models/genre.model';

@ApplyOptions<CommandOptions>({
	description: 'Adds a genre in the DB.',
	generateDashLessAliases: true
})
export class addGenre extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		const guildIds = process.env.MAIN_GUILD ? [process.env.MAIN_GUILD] : [];

		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((command) =>
						command
							.setName('genre')
							.setDescription('Nome para o novo genre')
							.addStringOption((option) => option.setName('genre').setDescription('Insere o nome do novo genero'))
					),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite, guildIds }
		);
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		// Checking if the message author is a bot.
		if (interaction.user.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!interaction.guild) return false;

		const subcommand = interaction.options.getSubcommand(true);

		if (subcommand === 'genre') {
			return await this.registerGenre(interaction);
		}
		return interaction.reply({ ephemeral: true, content: 'Sub comando inválido!' });
	}

	private async registerGenre(interaction: Command.ChatInputInteraction) {
		const genre = new Genre();
		genre.description = interaction.options.getString('genre', true);
		await GenreService.create(genre);

		return interaction.reply({ content: 'Novo genre registado!', ephemeral: true });
	}
}
