import { ChatInputCommandSuccessPayload, Command, Events, Listener, ListenerOptions, LogLevel, PieceContext } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { cyan } from 'colorette';
import type { Guild, User } from 'discord.js';
import { UserService } from '../../entities/user/user.service';

export class AppCommandListener extends Listener<typeof Events.ChatInputCommandSuccess> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			event: Events.ChatInputCommandSuccess
		});
	}

	public async run({ interaction, command }: ChatInputCommandSuccessPayload) {
		const shard = this.shard(interaction.guild?.shardId ?? 0);
		const commandName = this.command(command);
		const author = this.author(interaction.user);
		const sentAt = interaction.guild ? this.guild(interaction.guild) : this.direct();

		// Check if author is signed in db
		const user = await UserService.findOne(interaction.user.id);

		// If user doesn't exist yet, create
		if (!Boolean(user)) {
			console.log(`Creating user.... ${interaction.user.username}`);

			await UserService.create({
				id: interaction.user.id
			});
		}

		this.container.logger.debug(`${shard} - ${commandName} ${author} ${sentAt}`);
	}

	public onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}

	private shard(id: number) {
		return `[${cyan(id.toString())}]`;
	}

	private command(command: Command) {
		return cyan(command.name);
	}

	private author(author: User) {
		return `${author.username}[${cyan(author.id)}]`;
	}

	private direct() {
		return cyan('Direct Messages');
	}

	private guild(guild: Guild) {
		return `${guild.name}[${cyan(guild.id)}]`;
	}
}
