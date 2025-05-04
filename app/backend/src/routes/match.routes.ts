import { Router } from "express";
import type { Express } from "express";
import { MatchController } from "../controllers/match.controller.js";
import type { MatchService } from "../services/match.service.js";

export function setupMatchRoutes(app: Express, service: MatchService) {
  const controller = new MatchController(service);
  const router = Router()
    .get("/", controller.getAll.bind(controller))
    .put("/:id", controller.update.bind(controller))
    .delete("/:id", controller.delete.bind(controller))
    .post("/", controller.create.bind(controller));
  app.use("/api/matches", router);
}
