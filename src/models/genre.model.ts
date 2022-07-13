import { Column, Entity, OneToMany } from 'typeorm';
import { GenericEntity } from './base.model';
import { Song } from './song.model';

@Entity()
export class Genre extends GenericEntity {
	@Column()
	description: string;

	@OneToMany(() => Song, (song) => song.genre)
	songs: Song[];
}
