import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { GenreService } from '../../entities/genre/genre.service';

@ApplyOptions<CommandOptions>({
	description: 'Lists all the genres in the DB.'
})
export class listGenres extends Command {
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

		const genreList = await GenreService.findAll();
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Generos de musica:')
			.setDescription(
				genreList
					.map((genre, index) => {
						return `${index + 1}. **${genre.description}** (id: ${genre.id})\n\n`;
					})
					.join('\n')
			)
			.setTimestamp();

		return interaction.reply({ ephemeral: true, embeds: [embed] });
	}
}
