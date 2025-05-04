import { faker } from "@faker-js/faker";
import type { DataSource } from "typeorm";
import type { Seeder, SeederFactoryManager } from "typeorm-extension";
import { CompetitionEntity } from "../../entities/Competition.js";
import { MatchEntity } from "../../entities/Match.js";
import { TeamEntity } from "../../entities/Team.js";

const N_COMPS = 100;
const N_TEAMS = 500;
const N_MATCHES = 2500;

export default class InitialSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const teamFactory = factoryManager.get(TeamEntity);
    const compFactory = factoryManager.get(CompetitionEntity);
    const matchFactory = factoryManager.get(MatchEntity);

    const compRepo = dataSource.getRepository(CompetitionEntity);
    const teamRepo = dataSource.getRepository(TeamEntity);
    const matchRepo = dataSource.getRepository(MatchEntity);

    const nComps = await compRepo.count();
    const nTeams = await teamRepo.count();
    const nMatches = await matchRepo.count();

    const competitions =
      nComps === 0
        ? await compFactory.saveMany(N_COMPS)
        : await compRepo.find();

    const teams =
      nTeams === 0
        ? await teamFactory.saveMany(N_TEAMS)
        : await teamRepo.find();

    if (nMatches > 0) {
      return;
    }

    for (let i = 0; i < N_MATCHES; i++) {
      const match = await matchFactory.make();
      match.competition = faker.helpers.arrayElement(competitions);

      do {
        match.homeTeam = faker.helpers.arrayElement(teams);
        match.awayTeam = faker.helpers.arrayElement(teams);
      } while (match.homeTeam.id === match.awayTeam.id);

      await matchRepo.save(match);
    }
  }
}
