import {
  DataTable,
  type DataTableRow,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import type { ReportStatsDTO } from "@project/shared";
import { useState } from "react";

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
];

type ReportMatchesProps = {
  stats: ReportStatsDTO | null;
};

export default function ReportMatches({ stats }: ReportMatchesProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const rows: Omit<DataTableRow<any[]>, "cells">[] = stats
    ? stats.matches.map((match) => {
        return {
          id: String(match.id),
          date: match.date.toLocaleDateString(),
          competition: match.competition.name,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          homeGoals: match.homeGoals,
          awayGoals: match.awayGoals,
        };
      })
    : [];

  return (
    <>
      <h2>Matches</h2>
      <DataTable headers={headers} rows={rows.slice((page - 1) * pageSize, page * pageSize)}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer title="Found Matches" description="Filtered matches in report">
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
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
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
              totalItems={stats ? stats.matches.length : 0}
              size="lg"
            />
          </TableContainer>
        )}
      </DataTable>
    </>
  );
}
