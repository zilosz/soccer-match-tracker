import type { MatchDTO, MatchDTONoId } from "@project/shared";
import type { DeleteResult, Repository, UpdateResult } from "typeorm";
import type { MatchEntity } from "../entities/Match";

export class MatchService {
	constructor(private repo: Repository<MatchEntity>) {}

	async getAll(): Promise<MatchEntity[]> {
		return await this.repo.find({
			relations: ["competition", "homeTeam", "awayTeam"],
		});
	}

	async create(matchDTO: MatchDTONoId): Promise<MatchEntity> {
		const match = this.repo.create(matchDTO);
		return await this.repo.save(match);
	}

	async update(matchDTO: MatchDTO): Promise<UpdateResult> {
		return await this.repo.update(matchDTO.id, matchDTO);
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.repo.delete(id);
	}
}
