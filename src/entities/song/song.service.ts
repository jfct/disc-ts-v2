import { AppDataSource } from '../..';
import { Song } from '../../models/song.model';

export class SongService {
	static async create(data: Song) {
		const songRepo = AppDataSource.getRepository(Song);
		return songRepo.save(data);
	}

	static async checkSongExists(url: string): Promise<boolean> {
		const songRepo = AppDataSource.getRepository(Song);

		return Boolean(
			await songRepo.findOne({
				where: {
					url
				},
				cache: true,
				relations: { genres: false }
			})
		);
	}

	// get a random number of songs
	static async getRandom(nr: number, genres?: string[]): Promise<Song[]> {
		const songRepo = AppDataSource.getRepository(Song);

		return songRepo
			.createQueryBuilder('song')
			.select(['distinct song.id, song.url, song.description'])
			.where('song_genres.genreId IN (:...ids)', { ids: genres })
			.leftJoin('song.genres', 'genres')
			.orderBy('RANDOM()')
			.take(nr)
			.execute();
	}
}
