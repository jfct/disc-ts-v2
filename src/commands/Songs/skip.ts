import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { VoiceChannel } from 'discord.js';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'Skips songs.'
})
export class skip extends Command {
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

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			await interaction.reply({
				ephemeral: true,
				content: 'A skippar...'
			});
			await Voice.stop(voiceChannel);
			//await Voice.playNextRequest(voiceChannel);
			return true;
		}
		// If it's not the correct type
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.NOT_IN_VOICE] });
	}
}
