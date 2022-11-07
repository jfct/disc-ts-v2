import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { VoiceChannel } from 'discord.js';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'Resume song.'
})
export class resume extends Command {
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

		const guild = await interaction.guild?.fetch();
		const member = await guild?.members.fetch(interaction.user.id);
		const voiceChannel = member?.voice.channel;

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			await Voice.resume(voiceChannel);
			return interaction.reply({ ephemeral: true, content: 'A resumir...' });
		}
		// If it's not the correct type
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.NOT_IN_VOICE] });
	}
}
