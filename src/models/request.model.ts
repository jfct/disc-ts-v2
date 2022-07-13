import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GenericEntity } from './base.model';
import { Song } from './song.model';
import { User } from './user.model';

@Entity()
export class Request extends GenericEntity {
	@Column('boolean', { default: false })
	done: boolean;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@OneToOne(() => Song)
	@JoinColumn()
	song: Song;
}
