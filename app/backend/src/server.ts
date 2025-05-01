import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { initDataSource } from "./database/data-source";
import { setupCompetitionRoutes } from "./routes/competition.routes";
import { setupMatchRoutes } from "./routes/match.routes";
import { setupReportRoutes } from "./routes/report.routes";
import { setupTeamRoutes } from "./routes/team.routes";
import { createCompetitionService } from "./services/competition.service";
import { createMatchService } from "./services/match.service";
import { createReportService } from "./services/report.service";
import { createTeamService } from "./services/team.service";

dotenv.config();

const app = express();

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 8080;

try {
	const dataSource = await initDataSource();
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
