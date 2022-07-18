import { AppDataSource } from '../..';
import { Genre } from '../../models/genre.model';
import { Song } from '../../models/song.model';
import { GenreService } from '../genre/genre.service';

export class SongService {
	static async create(data: Song) {
		const songRepo = AppDataSource.getRepository(Song);
		return songRepo.save(data);
	}

	static async remove(data: Song): Promise<Song> {
		const songRepo = AppDataSource.getRepository(Song);
		return songRepo.remove(data);
	}

	static async updateGenres(songId: string, genres: string[]): Promise<(Genre | undefined)[]> {
		const song = await SongService.find(parseInt(songId));
		const genreNames = await GenreService.getGenreNames(genres);
		if (song != null && genreNames != undefined) {
			const songRepo = await AppDataSource.getRepository(Song);
			const updatedSong = songRepo.create(song);
			updatedSong.genres = genreNames.map((genre) => genre as Genre);
			updatedSong.id = parseInt(songId);

			await songRepo.save(updatedSong);
			return genreNames;
		}
		return genreNames;
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
			}
		});
	}

	static async checkSongExists(guildId: string, url: string): Promise<boolean> {
		const songRepo = AppDataSource.getRepository(Song);

		return Boolean(
			await songRepo.findOne({
				where: {
					url,
					guildId
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

	static async addPlayCountBulk(ids: string[]) {
		const songRepo = AppDataSource.getRepository(Song);

		return songRepo.update(ids, {
			playCount: () => 'playCOunt + 1'
		});
	}
}
