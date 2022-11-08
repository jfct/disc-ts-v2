import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { VoiceChannel } from 'discord.js';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'Leaves the voice channel'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		// Checking if the message author is a bot.
		if (interaction.user.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!interaction.guild) return false;

		const guild = await interaction.guild?.fetch();
		const member = await guild?.members.fetch(interaction.user.id);
		const voiceChannel = member?.voice.channel;

		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			await Voice.leave(voiceChannel);
		}

		return interaction.reply({ ephemeral: false, content: 'Xau ai' });
	}
}
