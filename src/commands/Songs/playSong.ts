import { AudioPlayerStatus } from '@discordjs/voice';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { VoiceChannel } from 'discord.js';
import { EmbedComponents } from '../../components/Embeds.components';
import { RequestService } from '../../entities/request/request.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { matchYoutubeUrl } from '../../lib/utils';
import { Voice } from '../../lib/Voice';
import { Request } from '../../models/request.model';
import { User } from '../../models/user.model';

@ApplyOptions<CommandOptions>({
	description: 'Plays a song / adds to queue, if bot playing (;p shortcut)'
})
export class playSong extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((command) =>
						command
							.setName('url')
							.setDescription('Play/Adicionar a lista')
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

		const guild = await interaction.guild?.fetch();
		const member = await guild?.members.fetch(interaction.user.id);
		const voiceChannel = member?.voice.channel;

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			const subcommand = interaction.options.getSubcommand(true);

			if (subcommand === 'url') {
				return await this.playSong(interaction, voiceChannel);
			}
			return interaction.reply({ ephemeral: true, content: 'Sub comando inválido!' });
		}
		// If it's not the correct type
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.NOT_IN_VOICE] });
	}

	private async playSong(interaction: Command.ChatInputInteraction, voiceChannel: VoiceChannel) {
		const link = interaction.options.getString('url', true);

		// Check if any hyperlinks grabbed or if it's a youtube link
		if (Boolean(link) && matchYoutubeUrl(link)) {
			const embed = await EmbedComponents.buildVideo(interaction.user.username, link);
			const state = await Voice.getState(voiceChannel);

			// Check if the song doesn't exist in the playlist yet
			if (state === AudioPlayerStatus.Playing) {
				const user: User = new User();
				user.id = interaction.user.id;

				const req: Request = new Request();
				req.url = link;
				req.user = user;
				req.guildRequested = `${interaction.guildId}`;
				req.channelRequested = interaction.channelId;
				req.title = `${embed.title}`;

				await RequestService.create(req);
				return interaction.reply({ ephemeral: true, content: 'Adicionado manuh', embeds: [embed] });
			}

			// Adds the music to play
			await Voice.playUrl(voiceChannel, link);

			return interaction.reply({ ephemeral: true, content: 'A adicionar musica', embeds: [embed] });
		}
		return this.returnBadURL(interaction);
	}

	private returnBadURL(interaction: Command.ChatInputInteraction) {
		return interaction.reply({ ephemeral: true, content: errorMessage[errorCodes.BAD_URL] });
	}
}
