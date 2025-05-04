import { type MatchFilterDTO, ReportStatsDTO } from "@project/shared";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validateOne } from "../utils/validation";
import api from "./axios";

export async function generateReport(
  filter: MatchFilterDTO,
): Promise<ReportStatsDTO> {
  const res = await api.post("/api/report", instanceToPlain(filter));

  const stats = plainToInstance(ReportStatsDTO, res.data);
  await validateOne(stats);

  return stats;
}
