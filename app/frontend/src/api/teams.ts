import { TeamDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validateMany } from "../utils/validation";
import api from "./axios";

export async function getAllTeams(): Promise<TeamDTO[]> {
  const res = await api.get("/api/teams");

  if (!Array.isArray(res.data)) {
    throw new Error("Team data is not an array.");
  }

  const teams = plainToInstance(TeamDTO, res.data);
  await validateMany(teams);

  teams.sort((a, b) => a.name.localeCompare(b.name));

  return teams;
}
