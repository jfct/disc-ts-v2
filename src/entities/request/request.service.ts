import { AppDataSource } from '../..';
import { Request } from '../../models/request.model';

export class RequestService {
	static async create(data: Request) {
		const requestRepo = AppDataSource.getRepository(Request);
		return requestRepo.save(data);
	}

	static async createBulk(data: Request[]) {
		return AppDataSource.createQueryBuilder().insert().into(Request).values(data).execute();
	}

	static async getRequestList(guildId: string): Promise<Request[]> {
		const requestRepo = AppDataSource.getRepository(Request);

		return await requestRepo.find({
			where: {
				done: false,
				guildRequested: guildId
			},
			order: {
				created_at: 'ASC'
			},
			relations: {
				user: true
			}
		});
	}

	static async checkValidRequest(url: string): Promise<boolean> {
		const requestRepo = AppDataSource.getRepository(Request);

		return Boolean(
			await requestRepo.findOne({
				where: {
					done: false,
					url
				}
			})
		);
	}

	static async markDone(id: number) {
		const requestRepo = AppDataSource.getRepository(Request);

		return await requestRepo
			.createQueryBuilder()
			.update({
				done: true
			})
			.where({
				id
			})
			.execute();
	}

	static async markAllDone(guildId: string) {
		const requestRepo = AppDataSource.getRepository(Request);

		return await requestRepo
			.createQueryBuilder()
			.update({
				done: true
			})
			.where({
				guildRequested: guildId
			})
			.execute();
	}

	static async cleanAllRequests() {
		const requestRepo = AppDataSource.getRepository(Request);

		return await requestRepo
			.createQueryBuilder()
			.update({
				done: true
			})
			.execute();
	}
}
