import { Column, Entity, ManyToOne } from 'typeorm';
import { GenericEntity } from './base.model';
import { Genre } from './genre.model';
import { User } from './user.model';

@Entity()
export class Song extends GenericEntity {
	@Column()
	url: string;

	@Column()
	description: string;

	@Column({ type: 'uuid' })
	userId: string;

	@Column({ type: 'uuid' })
	genreId: string;

	@ManyToOne(() => Genre, (genre) => genre.songs)
	genre: Genre | undefined;

	@ManyToOne(() => User, (user) => user.songs)
	user: number | undefined;
}
