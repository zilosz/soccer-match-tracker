import { AddAlt, Edit, Save } from "@carbon/icons-react";
import {
  Button,
  ComboBox,
  DataTable,
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
import type { MatchDTO } from "@project/shared";
import { type ReactNode, useState } from "react";
import { createMatch, deleteMatch, updateMatch } from "../../api/matches";
import useCompetitions from "../../hooks/useCompetitions";
import useMatches from "../../hooks/useMatches";
import useTeams from "../../hooks/useTeams";
import { notifyAPIError, notifyError, notifySuccess } from "../../utils/notification";
import MatchDeleteButton from "./MatchDeleteButton";

const headers = [
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
];

type MatchRow = {
  id: string;
  date: ReactNode;
  competition: ReactNode;
  homeTeam: ReactNode;
  awayTeam: ReactNode;
  homeGoals: ReactNode;
  awayGoals: ReactNode;
  actions: ReactNode;
};

export default function Matches() {
  const { competitions } = useCompetitions();
  const { teams } = useTeams();
  const { matches, setMatches } = useMatches();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editedMatch, setEditedMatch] = useState<MatchDTO | null>();
  const [isAdding, setIsAdding] = useState(false);

  const stopMatchEditing = () => {
    setEditedMatch(null);

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

  const handleMatchDelete = (id: number) => {
    if (isAdding && id === editedMatch?.id) {
      stopMatchEditing();

      return;
    }

    deleteMatch(id)
      .then(() => {
        notifySuccess("Deleted match.");

        const newMatches = matches.filter((match) => match.id !== id);
        setMatches(newMatches);

        const lastPage = Math.ceil(matches.length / pageSize);

        if (page === lastPage && page > 0 && newMatches.length % pageSize === 0) {
          setPage(page - 1);
        }
      })
      .catch((err) => notifyAPIError(err, "Failed to delete match."));
  };

  const handleMatchEdit = (match: MatchDTO) => {
    stopMatchEditing();
    setEditedMatch(match);
  };

  const handleMatchChange = <K extends keyof MatchDTO>(field: K, value: MatchDTO[K]) => {
    if (editedMatch) {
      setEditedMatch({
        ...editedMatch,
        [field]: value,
      });
    }
  };

  const handleMatchCreate = () => {
    if (!editedMatch) return;

    const { id, ...editedMatchNoId } = editedMatch;

    createMatch(editedMatchNoId)
      .then((createdMatch) => {
        notifySuccess("Created match.");

        setMatches(matches.map((match) => (match.id === -1 ? createdMatch : match)));
        setIsAdding(false);
        setEditedMatch(null);
      })
      .catch((err) => notifyAPIError(err, "Failed to create match."));
  };

  const handleMatchUpdate = () => {
    if (!editedMatch) return;

    updateMatch(editedMatch)
      .then(() => {
        notifySuccess("Edited match.");

        setMatches(matches.map((match) => (match.id === editedMatch.id ? editedMatch : match)));
        setEditedMatch(null);
      })
      .catch((err) => notifyAPIError(err, "Failed to edit match."));
  };

  const handleMatchSave = () => {
    if (!editedMatch) return;

    if (editedMatch.homeGoals < 0 || editedMatch.awayGoals < 0) {
      notifyError("Match Error", "Goals cannot be negative.");
    } else if (isAdding) {
      handleMatchCreate();
    } else {
      handleMatchUpdate();
    }
  };

  const handleMatchAdd = () => {
    if (editedMatch) return;

    const match: MatchDTO = {
      id: -1,
      date: new Date(),
      competition: competitions[0],
      homeTeam: teams[0],
      awayTeam: teams[1],
      homeGoals: 0,
      awayGoals: 0,
    };

    matches.splice((page - 1) * pageSize, 0, match);
    setMatches(matches);

    setEditedMatch(match);
    setIsAdding(true);
  };

  function createEditableMatchRow(match: MatchDTO): MatchRow {
    return {
      id: String(match.id),
      date: (
        <DatePicker datePickerType="single" onChange={([date]) => handleMatchChange("date", date)}>
          <DatePickerInput
            id={String(match.id)}
            labelText=""
            defaultValue={match.date.toLocaleDateString()}
            style={{
              width: "100%",
            }}
          />
        </DatePicker>
      ),
      competition: (
        <ComboBox
          id={String(match.id)}
          items={competitions}
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
      ),
      homeTeam: (
        <ComboBox
          id={String(match.id)}
          items={teams.filter((team) => team.id !== match.awayTeam.id)}
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
      ),
      awayTeam: (
        <ComboBox
          id={String(match.id)}
          items={teams.filter((team) => team.id !== match.homeTeam.id)}
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
      ),
      homeGoals: (
        <NumberInput
          id={String(match.id)}
          defaultValue={match.homeGoals}
          min={0}
          size="sm"
          style={{
            width: "100%",
          }}
          onChange={(_, { value }) => handleMatchChange("homeGoals", Number(value))}
        />
      ),
      awayGoals: (
        <NumberInput
          id={String(match.id)}
          defaultValue={match.awayGoals}
          min={0}
          size="sm"
          style={{
            width: "100%",
          }}
          onChange={(_, { value }) => handleMatchChange("awayGoals", Number(value))}
        />
      ),
      actions: (
        <>
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
          <MatchDeleteButton matchId={match.id} handleMatchDelete={handleMatchDelete} />
        </>
      ),
    };
  }

  function createNormalMatchRow(match: MatchDTO): MatchRow {
    return {
      id: String(match.id),
      date: match.date.toLocaleDateString(),
      competition: match.competition.name,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      actions: (
        <>
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
          <MatchDeleteButton matchId={match.id} handleMatchDelete={handleMatchDelete} />
        </>
      ),
    };
  }

  const rows = matches.map((match) => {
    return editedMatch && editedMatch.id === match.id
      ? createEditableMatchRow(match)
      : createNormalMatchRow(match);
  });

  return (
    <DataTable headers={headers} rows={rows.slice((page - 1) * pageSize, page * pageSize)}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <TableContainer title="Match Table" description="All matches in database">
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
          <div className="scrollable-table">
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
          </div>
          <Pagination
            onChange={({ page, pageSize }) => handlePageChange(page, pageSize)}
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
  );
}
