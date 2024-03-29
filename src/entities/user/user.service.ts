import { AppDataSource } from '../..';
import { User } from '../../models/user.model';
import { UserCreationDto } from './user.dto';

export class UserService {
	static async create(data: UserCreationDto) {
		return await AppDataSource.manager
			.createQueryBuilder()
			.insert()
			.into(User)
			.values([{ ...data }])
			.execute();
	}

	static async findOne(id: string) {
		const userRepo = AppDataSource.getRepository(User);

		return await userRepo.findOne({
			where: {
				id
			},
			cache: true,
			relations: { songs: false, requests: false, commands: false }
		});
	}
}
