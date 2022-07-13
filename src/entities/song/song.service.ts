import { AppDataSource } from '../..';
import { Song } from '../../models/song.model';
import { SongCreationDto } from './song.dto';

export class SongService {
	static async create(data: SongCreationDto) {
		return await AppDataSource.manager
			.createQueryBuilder()
			.insert()
			.into(Song)
			.values([{ ...data }])
			.execute();
	}

	static async createMultiple(data: SongCreationDto[]) {
		return await AppDataSource.manager.createQueryBuilder().insert().into(Song).values(data).execute();
	}
}
