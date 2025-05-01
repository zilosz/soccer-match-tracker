import type { DataSource, Repository } from "typeorm";
import { TeamEntity } from "../entities/Team";

export class TeamService {
	constructor(private repo: Repository<TeamEntity>) {}

	async getAll(): Promise<TeamEntity[]> {
		return await this.repo.find();
	}
}

export function createTeamService(dataSource: DataSource): TeamService {
	return new TeamService(dataSource.getRepository(TeamEntity));
}
