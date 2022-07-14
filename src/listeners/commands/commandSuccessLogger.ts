import type { ListenerOptions, MessageCommandSuccessPayload, PieceContext } from '@sapphire/framework';
import { Command, Events, Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { cyan } from 'colorette';
import type { Guild, User } from 'discord.js';
import { UserService } from '../../entities/user/user.service';

export class UserEvent extends Listener<typeof Events.MessageCommandSuccess> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			event: Events.MessageCommandSuccess
		});
	}

	public async run({ message, command }: MessageCommandSuccessPayload) {
		const shard = this.shard(message.guild?.shardId ?? 0);
		const commandName = this.command(command);
		const author = this.author(message.author);
		const sentAt = message.guild ? this.guild(message.guild) : this.direct();

		// Check if author is signed in db
		const user = await UserService.findOne(message.author.id);

		// If user doesn't exist yet, create
		if (!Boolean(user)) {
			console.log(`Creating user.... ${message.author.username}`);

			await UserService.create({
				id: message.author.id
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
