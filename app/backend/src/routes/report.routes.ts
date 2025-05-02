import { type Express, Router } from "express";
import { ReportController } from "../controllers/report.controller";
import type { ReportService } from "../services/report.service";

export function setupReportRoutes(app: Express, service: ReportService) {
  const controller = new ReportController(service);
  const router = Router().post("/", controller.getStats.bind(controller));
  app.use("/api/report", router);
}
