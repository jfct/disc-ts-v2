import { AudioPlayerStatus } from '@discordjs/voice';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Message, VoiceChannel } from 'discord.js';
import { EmbedComponents } from '../../components/Embeds.components';
import { RequestService } from '../../entities/request/request.service';
import { errorCodes, errorMessage } from '../../errors/errorMessages';
import { matchYoutubeUrl } from '../../lib/utils';
import { Voice } from '../../lib/Voice';
import { Request } from '../../models/request.model';
import { User } from '../../models/user.model';

@ApplyOptions<CommandOptions>({
	description: ';play <url> / ;p <url> - Plays a song / adds to queue, if bot playing (;p shortcut)',
	aliases: [
		'p',
		'play',
		'playmusic'
	]
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		// Checking if the message author is a bot.
		if (message.author.bot) return false;
		// Checking if the message was sent in a DM channel.
		if (!message.guild) return false;

		const voiceChannel = message.member?.voice.channel;

		// If user is in voiceChannel
		if (Boolean(voiceChannel) && voiceChannel instanceof VoiceChannel) {
			try {
				// Gets first hyperlink in message
				const hyperlink = await args.pick('hyperlink');

				// Check if any hyperlinks grabbed or if it's a youtube link
				if (Boolean(hyperlink) && matchYoutubeUrl(hyperlink.toString())) {
					const link = hyperlink.toString();
					// Delete message with command
					await message.delete();
					const embed = await EmbedComponents.buildVideo(message.author.username, link.toString());
					const state = await Voice.getState(voiceChannel);

					// Check if the song doesn't exist in the playlist yet
					if (state === AudioPlayerStatus.Playing) {
						const user: User = new User();
						user.id = message.author.id;

						const req: Request = new Request();
						req.url = link;
						req.user = user;
						req.guildRequested = `${message.guildId}`;
						req.channelRequested = message.channelId;
						req.title = `${embed.title}`;

						await RequestService.create(req);
						return send(message, { content: 'Adicionado manuh', embeds: [embed] });
					}

					// Adds the music to play
					await Voice.playUrl(voiceChannel, link);

					return send(message, {
						content: 'A adicionar musica',
						embeds: [embed]
					});
				}
				return this.returnBadURL(message);
			} catch (err) {
				this.container.logger.warn('Bad URL on command');
				return this.returnBadURL(message);
			}
		}
		// If it's not the correct type
		return send(message, errorMessage[errorCodes.NOT_IN_VOICE]);
	}
	private returnBadURL(message: Message<boolean>) {
		return reply(message, { content: errorMessage[errorCodes.BAD_URL] });
	}
}
