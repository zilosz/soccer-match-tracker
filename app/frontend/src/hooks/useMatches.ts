import { MatchDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { useEffect, useState } from "react";
import { showNotification } from "../components/utils";

export default function useMatches() {
  const [matches, setMatches] = useState<MatchDTO[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/matches");

        if (!res.ok) {
          showNotification({
            title: `Error ${res.status}`,
            caption: "Could not fetch matches.",
            kind: "error",
          });

          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Match data is not an array.");
        }

        const matches = plainToInstance(MatchDTO, data);

        for (const match of matches) {
          const validation = await validate(match);

          if (validation.length > 0) {
            throw new Error(validation[0].toString());
          }
        }

        setMatches(matches);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }

        showNotification({
          title: "Unexpected Error",
          caption: "Failed to fetch matches from backend.",
          kind: "error",
        });
      }
    };

    fetchMatches();
  }, []);

  return { matches, setMatches };
}
