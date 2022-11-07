import { CommandInteraction } from 'discord.js';
import fs from 'fs';
import * as path from 'path';

export class TextLogger {
	static write(interaction: CommandInteraction, commandName: string) {
		// Log command
		fs.appendFile(
			`${path.resolve('./')}/logs/appCommand.txt`,
			`${interaction.guild?.shardId ?? 0} - [Command] ${commandName} | [User] ${interaction.user.username} | ${
				interaction.guild ? `${interaction.guild.name}[${interaction.guild.id}]` : 'Direct'
			}\n`,
			function (err) {
				if (err) return console.log(err);
			}
		);
	}

	static writeRegular(content: string, user: string) {
		fs.appendFile(`${path.resolve('./')}/logs/appCommand.txt`, `[Message Command] - ${content} - ${user}\n`, function (err) {
			if (err) return console.log(err);
		});
	}

	static writeRegularError(content: string) {
		fs.appendFile(`${path.resolve('./')}/logs/appCommand.txt`, `[ERROR] - ${content}\n`, function (err) {
			if (err) return console.log(err);
		});
	}
}
