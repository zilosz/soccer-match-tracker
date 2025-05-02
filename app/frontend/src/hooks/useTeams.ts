import { TeamDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { useEffect, useState } from "react";
import { showNotification } from "../components/utils";

export default function useTeams() {
  const [teams, setTeams] = useState<TeamDTO[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/teams");

        if (!res.ok) {
          showNotification({
            title: `Error ${res.status}`,
            caption: "Could not fetch teams.",
            kind: "error",
          });

          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Team data is not an array.");
        }

        const teams = plainToInstance(TeamDTO, data);

        for (const team of teams) {
          const validation = await validate(team);

          if (validation.length > 0) {
            throw new Error(validation[0].toString());
          }
        }

        teams.sort((a, b) => a.name.localeCompare(b.name));
        setTeams(teams);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }

        showNotification({
          title: "Unexpected Error",
          caption: "Failed to fetch teams.",
          kind: "error",
        });
      }
    };

    fetchTeams();
  }, []);

  return { teams };
}
