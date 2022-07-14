import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { EmbedComponents } from '../../components/Embeds.components';

@ApplyOptions<CommandOptions>({
	description: 'Show available commands',
	aliases: [
		'showcommands',
		'commands',
		'listcommands'
	]
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return reply(message, { embeds: [await EmbedComponents.listCommands()] });
	}
}
