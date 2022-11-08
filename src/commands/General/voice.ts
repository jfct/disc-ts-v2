import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, VoiceChannel } from 'discord.js';
import fs from 'fs';
import * as path from 'path';
import { client } from '../..';
import { Voice } from '../../lib/Voice';

@ApplyOptions<CommandOptions>({
	description: 'voice'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		const prefix = client.options.defaultPrefix as string;

		const args = message.content.trim().split(/ +/g);
		//const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix

		// Get voice channel id from member who sends the message
		const voiceChannelId = message?.member?.voice?.channelId ?? '';
		const embed = new MessageEmbed()
			.setTitle('Lista de comandos de som do Super Mantij')
			.setDescription('**Utilizar p.ex: "!voice zorlak 5cm"**')
			.setTimestamp(new Date());
		let fromPath;
		let mp3array;
		let folderRead = 0;
		let totalFolders = 0;

		if (args[1].toLowerCase() === 'list') {
			fs.readdir(`${path.resolve('./')}/src/resources/mp3`, function (err, files) {
				if (err) {
					console.error('Could not list the directory.', err);
					process.exit(1);
				}
				// Determine the total number os folders to a variable to help with the async operations
				totalFolders = files.length;

				// Reading folders
				files.forEach(function (file, index) {
					//fromPath = path.join('././resources/mp3', file);
					fromPath = `${path.resolve('./')}/src/resources/mp3/${file}/`;

					fs.stat(fromPath, function (error, stat) {
						// Checking directories, true
						if (stat.isDirectory()) {
							// Reading files inside directories
							fs.readdir(`${path.resolve('./')}/src/resources/mp3/${file}/`, function (err, files) {
								mp3array = [];
								files.forEach(function (file, index) {
									mp3array.push(file.replace(/.mp3/g, ''));
								});

								embed.addField(file, mp3array.join(' '), true);

								folderRead++;

								if (folderRead == totalFolders) {
									message.channel.send({ embeds: [embed] });
								}
							});
						}
					});
				});
			});
		} else {
			//for (var channel of message.channel.guild.channels) {
			//if(channel[1] instanceof Discord.VoiceChannel && channel[1].id === voiceChannelId){
			const helper = args;

			message.client.channels.fetch(voiceChannelId).then((channel) => {
				if (args.length > 1 && channel !== null) {
					const voiceLine = `${path.resolve('./')}/src/resources/mp3/${helper[1]}/${helper[2]}.mp3`;

					Voice.playVoice(channel as VoiceChannel, voiceLine);
				}
			});
		}
	}
}
