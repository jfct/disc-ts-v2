import { Column, Entity, ManyToMany } from 'typeorm';
import { GenericEntity } from './base.model';
import { Song } from './song.model';

@Entity()
export class Genre extends GenericEntity {
	@Column()
	description: string;

	@ManyToMany(() => Song, { cascade: true, onDelete: 'CASCADE' })
	songs: Song[];
}
