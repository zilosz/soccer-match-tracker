import { MatchDTO, type MatchDTONoId } from "@project/shared";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validateMany, validateOne } from "../utils/validation";
import api from "./axios";

export async function getAllMatches(): Promise<MatchDTO[]> {
  const res = await api.get("/api/matches");

  if (!Array.isArray(res.data)) {
    throw new Error("Match data is not an array.");
  }

  const matches = plainToInstance(MatchDTO, res.data);
  await validateMany(matches);

  return matches;
}

export async function deleteMatch(id: number): Promise<void> {
  api.delete(`/api/matches/${id}`);
}

export async function createMatch(match: MatchDTONoId): Promise<MatchDTO> {
  const res = await api.post("/api/matches", instanceToPlain(match));

  const createdMatch = plainToInstance(MatchDTO, res.data);
  await validateOne(createdMatch);

  return createdMatch;
}

export async function updateMatch(match: MatchDTO): Promise<void> {
  await api.put(`/api/matches/${match.id}`, instanceToPlain(match));
}
