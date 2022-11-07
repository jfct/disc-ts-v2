import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { GenreService } from '../../entities/genre/genre.service';

@ApplyOptions<CommandOptions>({
	description: 'Adds a genre in the DB.',
	generateDashLessAliases: true
})
export class removeGenre extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		const guildIds = process.env.MAIN_GUILD ? [process.env.MAIN_GUILD] : [];

		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((command) =>
						command
							.setName('id')
							.setDescription('Id para remover')
							.addStringOption((option) => option.setName('id').setDescription('Insere o id do genre para remover'))
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

		if (subcommand === 'id') {
			return await this.removeGenre(interaction);
		}
		return interaction.reply({ ephemeral: true, content: 'Sub comando inválido!' });
	}

	private async removeGenre(interaction: Command.ChatInputInteraction) {
		const id = parseInt(interaction.options.getString('id', true));
		const genre = await GenreService.findOne(id);
		const res = await GenreService.remove(id);
		const affected = res?.affected ?? 0;

		if (res !== null && affected > 0) {
			return interaction.reply({ content: `Genero \`\`${genre?.description}\`\`  removido!` });
		}
		return interaction.reply({ ephemeral: true, content: 'Esse id não existe' });
	}
}
