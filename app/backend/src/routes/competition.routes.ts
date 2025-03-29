import { Router } from "express";
import { CompetitionController } from "../controllers/competition.controller";
import type { CompetitionService } from "../services/competition.service";

export const setupCompetitionRoutes = (service: CompetitionService): Router => {
	const controller = new CompetitionController(service);
	return Router().get("/", controller.getAll.bind(controller));
};
