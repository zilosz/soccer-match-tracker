import type { CompetitionService } from "../services/competition.service";
import type { MatchService } from "../services/match.service";
import type { TeamService } from "../services/team.service";

export type Services = {
	matchService: MatchService;
	teamService: TeamService;
	compService: CompetitionService;
};
