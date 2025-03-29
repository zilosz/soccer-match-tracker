import type { Repository } from "typeorm";
import type { CompetitionEntity } from "../entities/Competition";

export class CompetitionService {
	constructor(private repo: Repository<CompetitionEntity>) {}

	async getAll(): Promise<CompetitionEntity[]> {
		return await this.repo.find();
	}
}
