import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import { VoiceChannel } from 'discord.js';
import { RadioManager } from '../..';
import { RequestService } from '../../entities/request/request.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'STOPS songs.'
})
export class stop extends Command {
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

		const guild = await interaction.guild?.fetch();
		const member = await guild?.members.fetch(interaction.user.id);
		const voiceChannel = member?.voice.channel;

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			await Voice.stop(voiceChannel);
			await RequestService.markAllDone(interaction.guild.id);
			RadioManager.stop();

			return interaction.reply({ ephemeral: true, content: 'Bot parado, queue limpa!' });
		}
		// If it's not the correct type
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.NOT_IN_VOICE] });
	}
}
