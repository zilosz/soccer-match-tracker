import { Router } from "express";
import { MatchController } from "../controllers/match.controller";
import type { MatchService } from "../services/match.service";

export const setupMatchRoutes = (matchService: MatchService): Router => {
	const controller = new MatchController(matchService);

	return Router()
		.get("/", controller.getAll.bind(controller))
		.put("/:id", controller.update.bind(controller))
		.delete("/:id", controller.delete.bind(controller))
		.post("/", controller.create.bind(controller));
};
