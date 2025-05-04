import type { CompetitionDTO } from "@project/shared";
import { useEffect, useState } from "react";
import { getAllCompetitions } from "../api/competitions";
import { notifyAPIError } from "../utils/notification";

export default function useCompetitions() {
  const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);

  useEffect(() => {
    getAllCompetitions()
      .then(setCompetitions)
      .catch((err) => notifyAPIError(err, "Failed to fetch competitions."));
  }, []);

  return { competitions };
}
