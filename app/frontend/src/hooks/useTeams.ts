import type { TeamDTO } from "@project/shared";
import { useEffect, useState } from "react";
import { getAllTeams } from "../api/teams";
import { notifyAPIError } from "../utils/notification";

export default function useTeams() {
  const [teams, setTeams] = useState<TeamDTO[]>([]);

  useEffect(() => {
    getAllTeams()
      .then(setTeams)
      .catch((err) => notifyAPIError(err, "Failed to fetch teams."));
  }, []);

  return { teams };
}
