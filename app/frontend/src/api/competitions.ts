import { CompetitionDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validateMany } from "../utils/validation";
import api from "./axios";

export async function getAllCompetitions(): Promise<CompetitionDTO[]> {
  const res = await api.get("/api/competitions");

  if (!Array.isArray(res.data)) {
    throw new Error("Competition data is not an array.");
  }

  const competitions = plainToInstance(CompetitionDTO, res.data);
  await validateMany(competitions);

  competitions.sort((a, b) => a.name.localeCompare(b.name));

  return competitions;
}
