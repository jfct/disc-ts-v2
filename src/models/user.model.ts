import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Command } from './command.model';
import { Request } from './request.model';
import { Song } from './song.model';

@Entity()
export class User {
	@PrimaryColumn({ nullable: false })
	id: string;

	@OneToMany(() => Song, (song) => song.user)
	songs: Song[];

	@OneToMany(() => Request, (request) => request.user)
	requests: Request[];

	@OneToMany(() => Command, (command) => command.user)
	commands: Command[];
}
