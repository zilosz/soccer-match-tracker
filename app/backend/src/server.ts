import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { DataSource } from "typeorm";
import { createDatabase, runSeeders } from "typeorm-extension";
import { getDbOptions } from "./database/settings.js";
import { setupCompetitionRoutes } from "./routes/competition.routes.js";
import { setupMatchRoutes } from "./routes/match.routes.js";
import { setupReportRoutes } from "./routes/report.routes.js";
import { setupTeamRoutes } from "./routes/team.routes.js";
import { createCompetitionService } from "./services/competition.service.js";
import { createMatchService } from "./services/match.service.js";
import { createReportService } from "./services/report.service.js";
import { createTeamService } from "./services/team.service.js";

dotenv.config();

const CORS_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();
app.use(
  cors({
    origin: [CORS_ORIGIN],
  }),
  express.json(),
  express.urlencoded({
    extended: true,
  }),
);

const PORT = 8080;

async function startServer() {
  const options = getDbOptions();

  try {
    await createDatabase({
      options,
      ifNotExist: true,
    });

    const dataSource = await new DataSource(options).initialize();
    runSeeders(dataSource);

    console.log("Data Source has been initialized!");

    setupMatchRoutes(app, createMatchService(dataSource));
    setupTeamRoutes(app, createTeamService(dataSource));
    setupCompetitionRoutes(app, createCompetitionService(dataSource));
    setupReportRoutes(app, createReportService(dataSource));
  } catch (err) {
    console.error("Failed to initialize Data Source", err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
