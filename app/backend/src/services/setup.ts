import type { DataSource } from "typeorm";
import { CompetitionEntity } from "../entities/Competition";
import { MatchEntity } from "../entities/Match";
import { TeamEntity } from "../entities/Team";
import type { Services } from "../types/services.types";
import { CompetitionService } from "./competition.service";
import { MatchService } from "./match.service";
import { TeamService } from "./team.service";

export const setupServices = (dataSource: DataSource): Services => {
	return {
		matchService: new MatchService(dataSource.getRepository(MatchEntity)),
		teamService: new TeamService(dataSource.getRepository(TeamEntity)),
		compService: new CompetitionService(
			dataSource.getRepository(CompetitionEntity),
		),
	};
};
