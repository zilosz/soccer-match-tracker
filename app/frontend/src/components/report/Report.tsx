import { Button, DatePicker, DatePickerInput, Dropdown, Stack } from "@carbon/react";
import type { CompetitionDTO, MatchFilterDTO, ReportStatsDTO, TeamDTO } from "@project/shared";
import { useState } from "react";
import { generateReport } from "../../api/report";
import useCompetitions from "../../hooks/useCompetitions";
import useTeams from "../../hooks/useTeams";
import { notifyAPIError } from "../../utils/notification";
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

  const handleGenerateReport = () => {
    const matchFilter: MatchFilterDTO = {
      teamId: selectedTeam?.id,
      competitionId: selectedComp?.id,
      startDate: selectedStartDate ?? undefined,
      endDate: selectedEndDate ?? undefined,
    };

    generateReport(matchFilter)
      .then(setReportStats)
      .catch((err) => notifyAPIError(err, "Failed to generate report."));
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
          <Button className="submit-button" kind="primary" onClick={(_) => handleGenerateReport()}>
            Generate Report
          </Button>
        </Stack>
      </div>
      <ReportMatches stats={reportStats} />
      <ReportStats stats={reportStats} />
    </div>
  );
}
