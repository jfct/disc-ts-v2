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

	static async getRequestList(): Promise<Request[]> {
		const requestRepo = AppDataSource.getRepository(Request);

		return await requestRepo.find({
			where: {
				done: false
			},
			order: {
				created_at: 'ASC'
			},
			relations: {
				user: true
			},
			take: 10
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

	static async markAllDone() {
		const requestRepo = AppDataSource.getRepository(Request);

		return await requestRepo
			.createQueryBuilder()
			.update({
				done: true
			})
			.execute();
	}
}
