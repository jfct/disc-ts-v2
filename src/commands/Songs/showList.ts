import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import { EmbedComponents } from '../../components/Embeds.components';

@ApplyOptions<CommandOptions>({
	description: 'Shows all songs of the database.'
})
export class showList extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			guildIds: [`${process.env.TEST_GUILD}`]
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		// Checking if the message author is a bot.
		if (interaction.user.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!interaction.guild) return false;

		const paginatedMessage = await EmbedComponents.songList(interaction.guild.id);
		return paginatedMessage.run(interaction, interaction.user);
	}
}
