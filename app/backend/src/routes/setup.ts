import type { Express } from "express";
import type { Services } from "../types/services.types";
import { setupCompetitionRoutes } from "./competition.routes";
import { setupMatchRoutes } from "./match.routes";
import { setupTeamRoutes } from "./team.routes";

export const setupRoutes = (app: Express, services: Services) => {
	app.use("/api/matches", setupMatchRoutes(services.matchService));
	app.use("/api/teams", setupTeamRoutes(services.teamService));
	app.use("/api/competitions", setupCompetitionRoutes(services.compService));
};
