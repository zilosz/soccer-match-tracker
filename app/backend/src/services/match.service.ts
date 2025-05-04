import type { MatchDTO, MatchDTONoId } from "@project/shared";
import type {
  DataSource,
  DeleteResult,
  Repository,
  UpdateResult,
} from "typeorm";
import { MatchEntity } from "../entities/Match.js";

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

  async isEmpty(): Promise<boolean> {
    const count = await this.repo.count();
    return count === 0;
  }
}

export function createMatchService(dataSource: DataSource): MatchService {
  return new MatchService(dataSource.getRepository(MatchEntity));
}
