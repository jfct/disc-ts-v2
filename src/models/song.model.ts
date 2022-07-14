import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
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

	// @Column({ type: 'uuid' })
	// genreId: string;

	@ManyToMany(() => Genre, { cascade: true, onDelete: 'CASCADE' })
	@JoinTable()
	genres: Genre[];

	@ManyToOne(() => User, (user) => user.songs)
	user: number | undefined;
}
