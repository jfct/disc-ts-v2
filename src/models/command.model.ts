import { Column, Entity, ManyToOne } from 'typeorm';
import { GenericEntity } from './base.model';
import { User } from './user.model';

@Entity()
export class Command extends GenericEntity {
	@Column()
	command: string;

	@ManyToOne(() => User, (user) => user.commands)
	user: User;
}
