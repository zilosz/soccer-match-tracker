import { AddAlt, Edit, Save, TrashCan } from "@carbon/icons-react";
import {
	Button,
	ComboBox,
	DataTable,
	type DataTableRow,
	DatePicker,
	DatePickerInput,
	NumberInput,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TableToolbar,
	TableToolbarContent,
} from "@carbon/react";
import { MatchDTO, MatchDTONoId } from "@project/shared";
import { TeamDTO } from "@project/shared";
import { CompetitionDTO } from "@project/shared";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { showNotification } from "./utils";
import { toast } from "react-toastify";

const Matches = () => {
	const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);
	const memoCompetitions = useMemo(() => competitions, [competitions]);

	const [teams, setTeams] = useState<TeamDTO[]>([]);
	const memoTeams = useMemo(() => teams, [teams]);

	const [matches, setMatches] = useState<MatchDTO[]>([]);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const [editedMatch, setEditedMatch] = useState<MatchDTO | undefined>();
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		const fetchCompetitions = async (): Promise<void> => {
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

				console.log(`Fetched ${comps.length} competitions from backend.`);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
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

	useEffect(() => {
		const fetchTeams = async (): Promise<void> => {
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

				console.log(`Fetched ${teams.length} teams from backend.`);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
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

	useEffect(() => {
		const fetchMatches = async (): Promise<void> => {
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

				console.log(`Fetched ${matches.length} matches from backend.`);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
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

	const stopMatchEditing = () => {
		setEditedMatch(undefined);

		if (isAdding) {
			setMatches(matches.filter((match) => match.id !== -1));
			setIsAdding(false);
		}
	};

	const handlePageChange = (page: number, pageSize: number) => {
		stopMatchEditing();

		setPage(page);
		setPageSize(pageSize);
	};

	const handleMatchDelete = async (id: number) => {
		if (isAdding && id === editedMatch?.id) {
			stopMatchEditing();

			return;
		}

		try {
			const res = await fetch(`http://localhost:8080/api/matches/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				showNotification({
					title: `Error ${res.status}`,
					caption: "Failed to delete match.",
					kind: "error",
				});

				return;
			}
		} catch (err) {
			showNotification({
				title: "Unexpected Error",
				caption: "Failed to delete match.",
				kind: "error",
			});

			return;
		}

		showNotification({
			title: "Success",
			caption: "Deleted match.",
			kind: "success",
		});

		const newMatches = matches.filter((match) => match.id !== id);
		setMatches(newMatches);

		const lastPage = Math.ceil(matches.length / pageSize);

		if (page === lastPage && page > 0 && newMatches.length % pageSize === 0) {
			setPage(page - 1);
		}
	};

	const handleMatchEdit = (match: MatchDTO) => {
		stopMatchEditing();
		setEditedMatch(match);
	};

	const handleMatchChange = <K extends keyof MatchDTO>(
		field: K,
		value: MatchDTO[K],
	) => {
		if (!editedMatch) return;

		setEditedMatch({
			...editedMatch,
			[field]: value,
		});
	};

	const handleMatchCreate = async (): Promise<void> => {
		if (!editedMatch) return;

		const { id, ...editedMatchNoId } = editedMatch;
		const matchNoId = plainToInstance(MatchDTONoId, editedMatchNoId);

		try {
			const res = await fetch("http://localhost:8080/api/matches", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(instanceToPlain(matchNoId)),
			});

			if (!res.ok) {
				showNotification({
					title: `Error ${res.status}`,
					caption: "Failed to create match.",
					kind: "error",
				});

				return;
			}

			const data = await res.json();
			const newMatch = plainToInstance(MatchDTO, data);
			const validation = await validate(newMatch);

			if (validation.length > 0) {
				throw new Error(validation[0].toString());
			}

			setMatches(matches.map((match) => (match.id === -1 ? newMatch : match)));
			setIsAdding(false);
			setEditedMatch(undefined);

			showNotification({
				title: "Success",
				caption: "Created match.",
				kind: "success",
			});
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}

			showNotification({
				title: "Unexpected Error",
				caption: "Failed to create match.",
				kind: "error",
			});
		}
	};

	const handleMatchUpdate = async (): Promise<void> => {
		if (!editedMatch) return;

		try {
			const res = await fetch(
				`http://localhost:8080/api/matches/${editedMatch.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(instanceToPlain(editedMatch)),
				},
			);

			if (!res.ok) {
				showNotification({
					title: `Error ${res.status}`,
					caption: "Failed to update match.",
					kind: "error",
				});

				return;
			}
		} catch (err) {
			showNotification({
				title: "Unexpected Error",
				caption: "Failed to update match.",
				kind: "error",
			});

			return;
		}

		showNotification({
			title: "Success",
			caption: "Edited match.",
			kind: "success",
		});

		setMatches(
			matches.map((match) =>
				match.id === editedMatch.id ? editedMatch : match,
			),
		);
		setEditedMatch(undefined);
	};

	const handleMatchSave = async () => {
		if (!editedMatch) return;

		if (editedMatch.homeGoals < 0 || editedMatch.awayGoals < 0) {
      toast.dismiss();
			showNotification({
				title: "Match Error",
				caption: "Goals cannot be negative.",
				kind: "error",
			});

			return;
		}

		if (isAdding) {
			await handleMatchCreate();
		} else {
			await handleMatchUpdate();
		}
	};

	const handleMatchAdd = () => {
		if (editedMatch) return;

		const match: MatchDTO = {
			id: -1,
			date: new Date(),
			competition: memoCompetitions[0],
			homeTeam: memoTeams[0],
			awayTeam: memoTeams[1],
			homeGoals: 0,
			awayGoals: 0,
		};

		matches.splice((page - 1) * pageSize, 0, match);
		setMatches(matches);

		setEditedMatch(match);
		setIsAdding(true);
	};

	const rows: Omit<DataTableRow<ReactNode[]>, "cells">[] = matches.map(
		(match) => ({
			id: String(match.id),
			date:
				editedMatch && editedMatch.id === match.id ? (
					<DatePicker
						datePickerType="single"
						onChange={([date]) => handleMatchChange("date", date)}
					>
						<DatePickerInput
							id={String(match.id)}
							labelText=""
							defaultValue={match.date.toLocaleDateString()}
							style={{
								width: "100%",
							}}
						/>
					</DatePicker>
				) : (
					match.date.toLocaleDateString()
				),
			competition:
				editedMatch && editedMatch.id === match.id ? (
					<ComboBox
						id={String(match.id)}
						items={memoCompetitions}
						itemToString={(comp) => (comp ? comp.name : "")}
						placeholder={match.competition.name}
						size="sm"
						style={{
							width: "100%",
						}}
						onChange={({ selectedItem }) => {
							if (selectedItem) {
								handleMatchChange("competition", selectedItem);
							}
						}}
					/>
				) : (
					match.competition.name
				),
			homeTeam:
				editedMatch && editedMatch.id === match.id ? (
					<ComboBox
						id={String(match.id)}
						items={memoTeams.filter((team) => team.id !== match.awayTeam.id)}
						itemToString={(team) => (team ? team.name : "")}
						placeholder={match.homeTeam.name}
						size="sm"
						style={{
							width: "100%",
						}}
						onChange={({ selectedItem }) => {
							if (selectedItem) {
								handleMatchChange("homeTeam", selectedItem);
							}
						}}
					/>
				) : (
					match.homeTeam.name
				),
			awayTeam:
				editedMatch && editedMatch.id === match.id ? (
					<ComboBox
						id={String(match.id)}
						items={memoTeams.filter((team) => team.id !== match.homeTeam.id)}
						itemToString={(team) => (team ? team.name : "")}
						placeholder={match.awayTeam.name}
						size="sm"
						style={{
							width: "100%",
						}}
						onChange={({ selectedItem }) => {
							if (selectedItem) {
								handleMatchChange("awayTeam", selectedItem);
							}
						}}
					/>
				) : (
					match.awayTeam.name
				),
			homeGoals:
				editedMatch && editedMatch.id === match.id ? (
					<NumberInput
						id={String(match.id)}
						defaultValue={match.homeGoals}
						min={0}
						size="sm"
						style={{
							width: "100%",
						}}
						onChange={(_, { value }) =>
							handleMatchChange("homeGoals", Number(value))
						}
					/>
				) : (
					match.homeGoals
				),
			awayGoals:
				editedMatch && editedMatch.id === match.id ? (
					<NumberInput
						id={String(match.id)}
						defaultValue={match.awayGoals}
						min={0}
						size="sm"
						style={{
							width: "100%",
						}}
						onChange={(_, { value }) =>
							handleMatchChange("awayGoals", Number(value))
						}
					/>
				) : (
					match.awayGoals
				),
			actions: (
				<>
					{editedMatch && editedMatch.id === match.id ? (
						<Button
							kind="ghost"
							renderIcon={() => (
								<Save
									style={{
										fill: "#00FF00",
									}}
								/>
							)}
							hasIconOnly
							iconDescription="Save"
							onClick={handleMatchSave}
						/>
					) : (
						<Button
							kind="ghost"
							renderIcon={() => (
								<Edit
									style={{
										fill: "#4589ff",
									}}
								/>
							)}
							hasIconOnly
							iconDescription="Edit"
							onClick={() => handleMatchEdit(match)}
						/>
					)}
					<Button
						kind="danger--ghost"
						renderIcon={TrashCan}
						hasIconOnly
						iconDescription="Delete"
						onClick={() => handleMatchDelete(match.id)}
					/>
				</>
			),
		}),
	);

	return (
		<div className="data-table-wrapper">
			<DataTable
				headers={[
					{
						key: "date",
						header: "Date",
					},
					{
						key: "competition",
						header: "Competition",
					},
					{
						key: "homeTeam",
						header: "Home Team",
					},
					{
						key: "awayTeam",
						header: "Away Team",
					},
					{
						key: "homeGoals",
						header: "Home Goals",
					},
					{
						key: "awayGoals",
						header: "Away Goals",
					},
					{
						key: "actions",
						header: "",
					},
				]}
				rows={rows.slice((page - 1) * pageSize, page * pageSize)}
			>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<TableContainer
						title="Match Table"
						description="All matches in database"
					>
						<TableToolbar>
							<TableToolbarContent>
								<Button
									kind="primary"
									renderIcon={AddAlt}
									hasIconOnly
									iconDescription="Add"
									onClick={handleMatchAdd}
								/>
							</TableToolbarContent>
						</TableToolbar>
						<Table {...getTableProps()}>
							<TableHead>
								<TableRow>
									{headers.map((header) => (
										<TableHeader
											{...getHeaderProps({
												header,
											})}
											key={header.key}
											className={header.key}
										>
											{header.header}
										</TableHeader>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow
										{...getRowProps({
											row,
										})}
										key={row.id}
									>
										{row.cells.map((cell, i) => (
											<TableCell key={cell.id} className={headers[i].key}>
												{cell.value}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Pagination
							onChange={({ page, pageSize }) =>
								handlePageChange(page, pageSize)
							}
							pageSizes={[5, 10, 25, 50, 100]}
							pageSize={pageSize}
							page={page}
							backwardText="Previous page"
							forwardText="Next page"
							totalItems={matches.length}
							size="lg"
						/>
					</TableContainer>
				)}
			</DataTable>
		</div>
	);
};

export default Matches;
