import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { EmbedComponents } from '../../components/Embeds.components';

@ApplyOptions<CommandOptions>({
	description: 'Shows the current queue.'
})
export class queue extends Command {
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

		const paginatedMessage = await EmbedComponents.queue(interaction.guild.id);
		return paginatedMessage.run(interaction, interaction.user);
	}
}
