import { Router } from "express";
import type { Express } from "express";
import { CompetitionController } from "../controllers/competition.controller";
import type { CompetitionService } from "../services/competition.service";

export function setupCompetitionRoutes(
	app: Express,
	service: CompetitionService,
) {
	const controller = new CompetitionController(service);
	const router = Router().get("/", controller.getAll.bind(controller));
	app.use("/api/competitions", router);
}
