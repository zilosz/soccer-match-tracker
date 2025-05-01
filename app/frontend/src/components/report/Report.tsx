import { Button, DatePicker, DatePickerInput, Dropdown, Stack } from "@carbon/react";
import {
	type CompetitionDTO,
	type MatchFilterDTO,
	ReportStatsDTO,
	type TeamDTO,
} from "@project/shared";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { useState } from "react";
import useCompetitions from "../../hooks/useCompetitions";
import useTeams from "../../hooks/useTeams";
import { showNotification } from "../utils";
import ReportMatches from "./ReportMatches";
import ReportStats from "./ReportStats";

export default function Report() {
	const { competitions } = useCompetitions();
	const { teams } = useTeams();

	const [selectedTeam, setSelectedTeam] = useState<TeamDTO | null>(null);
	const [selectedComp, setSelectedComp] = useState<CompetitionDTO | null>(null);
	const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
	const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

	const [reportStats, setReportStats] = useState<ReportStatsDTO | null>(null);

	const handleDateChange = (dates: Array<Date | null>) => {
		setSelectedStartDate(dates[0]);
		setSelectedEndDate(dates[1]);
	};

	const handleButtonClick = async () => {
		const matchFilter: MatchFilterDTO = {};

		if (selectedTeam) {
			matchFilter.teamId = selectedTeam.id;
		}

		if (selectedComp) {
			matchFilter.competitionId = selectedComp.id;
		}

		if (selectedStartDate) {
			matchFilter.startDate = selectedStartDate;
		}

		if (selectedEndDate) {
			matchFilter.endDate = selectedEndDate;
		}

		try {
			const res = await fetch("http://localhost:8080/api/report", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(instanceToPlain(matchFilter)),
			});

			if (!res.ok) {
				showNotification({
					title: `Error ${res.status}`,
					caption: "Could not fetch stats.",
					kind: "error",
				});

				return;
			}

			const data = await res.json();
			const stats = plainToInstance(ReportStatsDTO, data);
			console.log(stats);
			const statsValidation = await validate(stats);

			if (statsValidation.length > 0) {
				throw new Error(statsValidation.toString());
			}

			setReportStats(stats);
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
			}

			showNotification({
				title: "Unexpected error",
				caption: "Failed to acquire filtered matches.",
				kind: "error",
			});
		}
	};

	return (
		<div className="report-container">
			<div className="report-section report-filter">
				<h2>Filter</h2>
				<Stack gap={5}>
					<Dropdown
						id="team-dropdown"
						titleText="Team"
						label="Choose a team"
						items={teams}
						itemToString={(item) => (item ? item.name : "")}
						onChange={({ selectedItem }) => setSelectedTeam(selectedItem)}
						selectedItem={selectedTeam}
					/>
					<Dropdown
						id="competition-dropdown"
						titleText="Competition"
						label="Choose a competition"
						items={competitions}
						itemToString={(item) => (item ? item.name : "")}
						onChange={({ selectedItem }) => setSelectedComp(selectedItem)}
						selectedItem={selectedComp}
					/>
					<DatePicker datePickerType="range" onChange={handleDateChange}>
						<DatePickerInput id="start-date" labelText="Start date" placeholder="yyyy-mm-dd" />
						<DatePickerInput id="end-date" labelText="End date" placeholder="yyyy-mm-dd" />
					</DatePicker>
					<Button className="submit-button" kind="primary" onClick={(_) => handleButtonClick()}>
						Generate Report
					</Button>
				</Stack>
			</div>
			<div className="report-section report-matches">
				<ReportMatches stats={reportStats} />
			</div>
			<div className="report-section report-stats">
				<ReportStats stats={reportStats} />
			</div>
		</div>
	);
}
