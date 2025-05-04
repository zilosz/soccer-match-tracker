import type { MatchDTO } from "@project/shared";
import { useEffect, useState } from "react";
import { getAllMatches } from "../api/matches";
import { notifyAPIError } from "../utils/notification";

export default function useMatches() {
  const [matches, setMatches] = useState<MatchDTO[]>([]);

  useEffect(() => {
    getAllMatches()
      .then(setMatches)
      .catch((err) => notifyAPIError(err, "Failed to fetch matches."));
  }, []);

  return { matches, setMatches };
}
