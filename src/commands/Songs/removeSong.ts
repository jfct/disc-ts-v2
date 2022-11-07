import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { SongService } from '../../entities/song/song.service';

@ApplyOptions<CommandOptions>({
	description: 'Removes songs to the database.'
})
export class removeSong extends Command {
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
							.setDescription('Song Id para apagar')
							.addStringOption((option) => option.setName('id').setDescription('Song id para remover'))
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
			return await this.removeSong(interaction);
		}
		return interaction.reply({ ephemeral: true, content: 'Sub comando inválido!' });
	}

	private async removeSong(interaction: Command.ChatInputInteraction) {
		const id = interaction.options.getString('id', true);

		const song = await SongService.find(parseInt(id));
		if (song != undefined) {
			const res = await SongService.remove(song);
			return interaction.reply({ ephemeral: true, content: `Removido - ${res.description}` });
		}
		return interaction.reply({ ephemeral: true, content: 'Id não encontrado' });
	}
}
