import { Router } from "express";
import { TeamController } from "../controllers/team.controller";
import type { TeamService } from "../services/team.service";

export const setupTeamRoutes = (teamService: TeamService): Router => {
	const controller = new TeamController(teamService);

	return Router().get("/", controller.getAll.bind(controller));
};
