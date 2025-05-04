import { Router } from "express";
import type { Express } from "express";
import { TeamController } from "../controllers/team.controller.js";
import type { TeamService } from "../services/team.service.js";

export function setupTeamRoutes(app: Express, service: TeamService) {
  const controller = new TeamController(service);
  const router = Router().get("/", controller.getAll.bind(controller));
  app.use("/api/teams", router);
}
