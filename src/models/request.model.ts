import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from './base.model';
import { User } from './user.model';

@Entity()
export class Request extends GenericEntity {
	@Column('boolean', { default: false })
	done: boolean;

	@Column()
	channelRequested: string;

	@Column()
	guildRequested: string;

	@Column()
	url: string;

	@Column()
	title: string;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;
}
