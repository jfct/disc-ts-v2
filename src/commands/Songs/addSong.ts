import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { EmbedComponents } from '../../components/Embeds.components';
import { SelectMenuComponents } from '../../components/SelectMenu.components';
import { SongService } from '../../entities/song/song.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { matchYoutubeUrl } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	description: 'Adds a song to the database.',
	generateDashLessAliases: true
})
export class addSong extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		console.log('registered', [`${process.env.TEST_GUILD}`]);
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((command) =>
						command
							.setName('url')
							.setDescription('Adicionar musica BD')
							.addStringOption((option) => option.setName('url').setDescription('URL'))
					),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		// Checking if the message author is a bot.
		if (interaction.user.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!interaction.guild) return false;

		const subcommand = interaction.options.getSubcommand(true);

		if (subcommand === 'url') {
			return await this.registerSong(interaction);
		}
		return interaction.reply({ ephemeral: true, content: 'Sub comando inválido!' });
	}

	private async registerSong(interaction: Command.ChatInputInteraction) {
		const hyperlink = interaction.options.getString('url', true);

		// Check if any hyperlinks grabbed or if it's a youtube link
		if (matchYoutubeUrl(hyperlink)) {
			const link = hyperlink.toString();

			// Check if the song doesn't exist in the playlist yet
			if (await SongService.checkSongExists(link)) {
				return interaction.reply({ ephemeral: true, content: 'Já está adicionada manuh' });
			}

			const embed = await EmbedComponents.buildVideo(interaction.user.username, link);
			const genreList = await SelectMenuComponents.genreListMenu('addSongInteraction');

			return interaction.reply({
				ephemeral: true,
				content: 'A adicionar musica, escolhe os estilos ...',
				components: [genreList],
				embeds: [embed]
			});
		}
		return this.returnBadURL(interaction);
	}

	private returnBadURL(interaction: Command.ChatInputInteraction) {
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.BAD_URL] });
	}
}
