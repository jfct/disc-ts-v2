import { Column, Entity, OneToMany } from 'typeorm';
import { GenericEntity } from './base.model';
import { Command } from './command.model';
import { Request } from './request.model';
import { Song } from './song.model';

@Entity()
export class User extends GenericEntity {
	@Column()
	discordId: string;

	@OneToMany(() => Song, (song) => song.user)
	songs: Song[];

	@OneToMany(() => Request, (request) => request.user)
	requests: Request[];

	@OneToMany(() => Command, (command) => command.user)
	commands: Command[];
}
