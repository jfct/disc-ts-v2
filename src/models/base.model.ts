import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class GenericEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'integer' })
	public created_at: number;

	@UpdateDateColumn({ type: 'integer' })
	public updated_at: number;
}
