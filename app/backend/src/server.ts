import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { initDataSource } from "./database/data-source";
import { setupRoutes } from "./routes/setup";
import { setupServices } from "./services/setup";

dotenv.config();

const app = express();
app.use(
	cors({
		origin: ["http://localhost:5173"],
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 8080;

const startServer = async () => {
	try {
		const dataSource = await initDataSource();
		console.log("Data Source has been initialized!");

		setupRoutes(app, setupServices(dataSource));

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (err) {
		console.error("Failed to initialize Data Source", err);
	}
};

startServer();
