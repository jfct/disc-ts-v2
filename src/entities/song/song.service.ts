import { AppDataSource } from '../..';
import { Genre } from '../../models/genre.model';
import { Song } from '../../models/song.model';

export class SongService {
	static async create(data: Song) {
		const songRepo = AppDataSource.getRepository(Song);
		return songRepo.save(data);
	}

	static async remove(data: Song): Promise<Song> {
		const songRepo = AppDataSource.getRepository(Song);
		return songRepo.remove(data);
	}

	static async find(id: number) {
		const songRepo = AppDataSource.getRepository(Song);
		return songRepo.findOne({
			where: { id }
		});
	}

	static async getList(guildId: string, genres?: Genre[]): Promise<Song[]> {
		const requestRepo = AppDataSource.getRepository(Song);

		return await requestRepo.find({
			where: {
				guildId,
				genres
			},
			order: {
				created_at: 'ASC'
			},
			relations: {
				user: true,
				genres: true
			},
			take: 20
		});
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
