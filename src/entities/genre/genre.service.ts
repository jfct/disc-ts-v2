import { AppDataSource } from '../..';
import { Genre } from '../../models/genre.model';

export class GenreService {
	static async create(data: Genre) {
		return await AppDataSource.manager
			.createQueryBuilder()
			.insert()
			.into(Genre)
			.values([{ ...data }])
			.execute();
	}

	static async findOne(id: number) {
		const genreRepo = AppDataSource.getRepository(Genre);

		return await genreRepo.findOne({
			where: {
				id
			}
		});
	}

	static async findAll() {
		const genreRepo = AppDataSource.getRepository(Genre);

		return await genreRepo.find({ cache: true });
	}

	// Returns an array of Genre[] from an array of strings
	static async getGenreArray(genreIds: string[]) {
		return genreIds.map((genre) => {
			const newGenre = new Genre();
			newGenre.id = parseInt(genre);
			return newGenre;
		});
	}

	// Returns a list of genre names according to the array of ids he got
	static async getGenreNames(genreIds: string[]) {
		const list = await this.findAll();

		return genreIds.map((genre) => list.find((item) => item.id.toString() == genre));
	}

	static async remove(genreId: number) {
		const genreRepo = AppDataSource.getRepository(Genre);

		return await genreRepo.delete({
			id: genreId
		});
	}
}
