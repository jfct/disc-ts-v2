import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import { VoiceChannel } from 'discord.js';
import { RadioManager } from '../..';
import { SelectMenuComponents } from '../../components/SelectMenu.components';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { RadioModes } from '../../lib/Radio';

@ApplyOptions<CommandOptions>({
	aliases: [
		'jukebox',
		'random'
	],
	description: 'Gets songs from the DB and keeps playing them on loop.',
	generateDashLessAliases: true
})
export class Radio extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			guildIds: [`${process.env.TEST_GUILD}`]
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const guild = await interaction.guild?.fetch();
		const member = await guild?.members.fetch(interaction.user.id);
		const voiceChannel = member?.voice.channel;

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			let genreList;
			let content;

			if (RadioManager.currentMode() === RadioModes.RADIO) {
				// Give option to update the genres
				genreList = await SelectMenuComponents.genreListMenu('updateRadioInteraction');
				content = 'Escolhe os novos estilos ...';
			} else {
				genreList = await SelectMenuComponents.genreListMenu('startRadioInteraction');
				content = 'A começar jukebox, escolhe os estilos ...';
			}

			return interaction.reply({
				ephemeral: true,
				content,
				components: [genreList]
			});
		}
		// If it's not the correct type
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.NOT_IN_VOICE] });
	}
}
