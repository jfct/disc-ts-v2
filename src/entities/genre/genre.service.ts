import { AppDataSource } from '../..';
import { Genre } from '../../models/genre.model';
import { GenreCreationDto } from './genre.dto';

export class GenreService {
	static async create(data: GenreCreationDto) {
		return await AppDataSource.manager
			.createQueryBuilder()
			.insert()
			.into(Genre)
			.values([{ ...data }])
			.execute();
	}

	static async findAll() {
		const genreRepo = AppDataSource.getRepository(Genre);

		return await genreRepo.find({ cache: true, relations: { songs: false } });
	}
}
