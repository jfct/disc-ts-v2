import { Column, Entity } from 'typeorm';
import { GenericEntity } from './base.model';

@Entity()
export class Genre extends GenericEntity {
	@Column()
	description: string;
}
