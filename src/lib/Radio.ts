import { RequestService } from '../entities/request/request.service';
import { SongService } from '../entities/song/song.service';
import { Request } from '../models/request.model';

export enum RadioModes {
	REGULAR = 0,
	RADIO = 1
}

export class Radio {
	protected currentState: RadioModes;
	protected radioGenres: string[];

	constructor() {
		this.currentState = RadioModes.REGULAR;
		this.radioGenres = [];
	}

	currentMode() {
		return this.currentState;
	}

	currentGenres() {
		return this.radioGenres;
	}

	changeGenres(genres: string[]) {
		this.radioGenres = genres;
		return this.radioGenres;
	}

	changeMode(mode: RadioModes) {
		this.currentState = mode;
		return this.currentState;
	}

	stop() {
		this.currentState = RadioModes.REGULAR;
		this.radioGenres = [];

		return this.currentState;
	}

	async addSongs(nr: number, channelId: string) {
		const songs = await SongService.getRandom(nr, this.radioGenres);

		// Adds the 10 random songs
		await RequestService.createBulk(
			songs.map((song) => {
				const req: Request = new Request();

				req.channelRequested = channelId;
				req.url = song.url;
				req.title = song.description;

				return req;
			})
		);
	}
}
