import { CompetitionDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { useEffect, useState } from "react";
import { showNotification } from "../components/utils";

export default function useCompetitions() {
	const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);

	useEffect(() => {
		const fetchCompetitions = async () => {
			try {
				const res = await fetch("http://localhost:8080/api/competitions");

				if (!res.ok) {
					showNotification({
						title: `Error ${res.status}`,
						caption: "Failed to fetch competitions.",
						kind: "error",
					});

					return;
				}

				const data = await res.json();

				if (!Array.isArray(data)) {
					throw new Error("Competition data is not an array.");
				}

				const comps = plainToInstance(CompetitionDTO, data);

				for (const comp of comps) {
					const validation = await validate(comp);

					if (validation.length > 0) {
						throw new Error(validation[0].toString());
					}
				}

				comps.sort((a, b) => a.name.localeCompare(b.name));
				setCompetitions(comps);
			} catch (err) {
				if (err instanceof Error) {
					console.error(err.message);
				}

				showNotification({
					title: "Unexpected Error",
					caption: "Failed to fetch competitions.",
					kind: "error",
				});
			}
		};

		fetchCompetitions();
	}, []);

	return { competitions };
}
