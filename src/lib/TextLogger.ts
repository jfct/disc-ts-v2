import { MessageCommand } from '@sapphire/framework';
import { CommandInteraction, Message } from 'discord.js';
import fs from 'fs';
import * as path from 'path';

export class TextLogger {
	static write(interaction: CommandInteraction, commandName: string) {
		// Log command
		fs.appendFile(
			`${path.resolve('./')}/logs/appCommand.txt`,
			`[${new Date()}][${interaction.guild?.shardId ?? 0}][${commandName}] | [User] ${interaction.user.username} | ${
				interaction.guild ? `${interaction.guild.name}[${interaction.guild.id}]` : 'Direct'
			}\n`,
			function (err) {
				if (err) return console.log(err);
			}
		);
	}

	static writeRegular(command: MessageCommand, message: Message) {
		fs.appendFile(
			`${path.resolve('./')}/logs/appCommand.txt`,
			`[${new Date()}][${command.name}][${message.author.username}] - ${message.content} - \n`,
			function (err) {
				if (err) return console.log(err);
			}
		);
	}

	static writeRegularError(content: string) {
		fs.appendFile(`${path.resolve('./')}/logs/appCommand.txt`, `[${new Date()}][ERROR] - ${content}\n`, function (err) {
			if (err) return console.log(err);
		});
	}
}
