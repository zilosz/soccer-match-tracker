import type { DataSource, Repository } from "typeorm";
import { CompetitionEntity } from "../entities/Competition.js";

export class CompetitionService {
  constructor(private repo: Repository<CompetitionEntity>) {}

  async getAll(): Promise<CompetitionEntity[]> {
    return await this.repo.find();
  }
}

export function createCompetitionService(
  dataSource: DataSource,
): CompetitionService {
  return new CompetitionService(dataSource.getRepository(CompetitionEntity));
}
