import type { Repository } from "typeorm";
import type { TeamEntity } from "../entities/Team";

export class TeamService {
	constructor(private repo: Repository<TeamEntity>) {}

	async getAll(): Promise<TeamEntity[]> {
		return await this.repo.find();
	}
}
