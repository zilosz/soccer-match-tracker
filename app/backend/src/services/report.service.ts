import { MatchDTO, type MatchFilterDTO, ReportStatsDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import type { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { MatchEntity } from "../entities/Match.js";

export class ReportService {
  constructor(private matchRepo: Repository<MatchEntity>) {}

  private applyFilterOnQuery(
    qb: SelectQueryBuilder<MatchEntity>,
    filter: MatchFilterDTO,
  ) {
    if (filter.teamId) {
      qb.andWhere(
        "(match.homeTeamId = :teamId OR match.awayTeamId = :teamId)",
        {
          teamId: filter.teamId,
        },
      );
    }

    if (filter.competitionId) {
      qb.andWhere("match.competitionId = :competitionId", {
        competitionId: filter.competitionId,
      });
    }

    if (filter.startDate) {
      qb.andWhere("match.date >= :startDate", {
        startDate: filter.startDate,
      });
    }

    if (filter.endDate) {
      qb.andWhere("match.date <= :endDate", {
        endDate: filter.endDate,
      });
    }
  }

  async getStats(filter: MatchFilterDTO): Promise<ReportStatsDTO> {
    const baseQuery = this.matchRepo
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.homeTeam", "homeTeam")
      .leftJoinAndSelect("match.awayTeam", "awayTeam")
      .leftJoinAndSelect("match.competition", "competition");
    this.applyFilterOnQuery(baseQuery, filter);
    const matchEntities = await baseQuery.getMany();
    const matches = matchEntities.map((m) => plainToInstance(MatchDTO, m));

    const avgGoalsQuery = this.matchRepo
      .createQueryBuilder("match")
      .select("AVG(match.homeGoals + match.awayGoals)", "avgGoals");
    this.applyFilterOnQuery(avgGoalsQuery, filter);
    const { avgGoals } = await avgGoalsQuery.getRawOne();

    const uniqueTeamsQuery = this.matchRepo
      .createQueryBuilder("match")
      .select(
        "COUNT(DISTINCT match.homeTeamId) + COUNT(DISTINCT match.awayTeamId)",
        "uniqueTeams",
      );
    this.applyFilterOnQuery(uniqueTeamsQuery, filter);
    const { uniqueTeams } = await uniqueTeamsQuery.getRawOne();

    const uniqueCompsQuery = this.matchRepo
      .createQueryBuilder("match")
      .select("COUNT(DISTINCT match.competitionId)", "uniqueComps");
    this.applyFilterOnQuery(uniqueCompsQuery, filter);
    const { uniqueComps } = await uniqueCompsQuery.getRawOne();

    return plainToInstance(ReportStatsDTO, {
      matches,
      avgGoalsPerMatch: Number(avgGoals),
      numUniqueTeams: Number(uniqueTeams),
      numUniqueCompetitions: Number(uniqueComps),
    });
  }
}

export function createReportService(dataSource: DataSource): ReportService {
  return new ReportService(dataSource.getRepository(MatchEntity));
}
