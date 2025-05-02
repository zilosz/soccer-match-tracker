import { InlineNotification, NumberInput, Tile } from "@carbon/react";
import type { ReportStatsDTO } from "@project/shared";

type ReportStatsProps = {
  stats: ReportStatsDTO | null;
};

export default function ReportStats({ stats }: ReportStatsProps) {
  return (
    <>
      <h2>Statistics</h2>
      {stats && stats.matches.length > 0 ? (
        <>
          <Tile>
            Average goals per match
            <NumberInput
              id="avg-goals"
              value={stats.avgGoalsPerMatch.toFixed(2)}
              label=""
              readOnly
              hideSteppers
            />
          </Tile>
          <Tile>
            Unique teams
            <NumberInput
              id="unique-comps"
              value={stats.numUniqueTeams}
              label=""
              readOnly
              hideSteppers
            />
          </Tile>
          <Tile>
            Unique competitions
            <NumberInput
              id="unique-comps"
              value={stats.numUniqueCompetitions}
              label=""
              readOnly
              hideSteppers
            />
          </Tile>
        </>
      ) : (
        <InlineNotification
          kind="info"
          title="Statistics not available."
          subtitle="Click 'Generate Report' or adjust your filters."
          lowContrast
          hideCloseButton
        />
      )}
    </>
  );
}
