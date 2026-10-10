"use client"

import type { BankRecDiffResult } from "@/lib/types/task-results"
import { StatusBadge } from "@/components/agent-workspace/results/result-badges"
import {
  ResultContext,
  ResultSection,
  ResultTableFrame,
  CountLine,
  resultTable,
} from "@/components/agent-workspace/results/result-primitives"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatUsd } from "@/lib/format-task-result"
import { cn } from "@/lib/utils"

type BankRecResultViewProps = {
  data: BankRecDiffResult
}

export function BankRecResultView({ data }: BankRecResultViewProps) {
  const grouped = {
    unmatched: data.rows.filter((r) => r.status === "unmatched"),
    proposed: data.rows.filter((r) => r.status === "proposed_match"),
    other: data.rows.filter(
      (r) => r.status !== "unmatched" && r.status !== "proposed_match",
    ),
  }

  const renderSection = (
    title: string,
    rows: BankRecDiffResult["rows"],
    rowTone?: string,
  ) => {
    if (rows.length === 0) {
      return null
    }
    return (
      <ResultSection title={title} count={rows.length}>
        <ResultTableFrame>
          <Table className={resultTable.fixed}>
            <TableHeader>
              <TableRow className={resultTable.headRow}>
                <TableHead className={cn(resultTable.head, "w-[100px]")}>
                  Side
                </TableHead>
                <TableHead className={resultTable.head}>Description</TableHead>
                <TableHead className={cn(resultTable.head, "w-[120px] text-right")}>
                  Amount
                </TableHead>
                <TableHead className={cn(resultTable.head, "w-[120px]")}>
                  Date
                </TableHead>
                <TableHead className={cn(resultTable.head, "w-[170px]")}>
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className={cn(resultTable.row, rowTone)}>
                  <TableCell
                    className={cn(resultTable.cell, "font-medium capitalize")}
                  >
                    {row.side}
                  </TableCell>
                  <TableCell
                    className={cn(resultTable.cell, "truncate")}
                    title={row.description}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell className={resultTable.num}>
                    {formatUsd(row.amountUsd)}
                  </TableCell>
                  <TableCell className={cn(resultTable.cell, resultTable.muted)}>
                    {formatDate(row.date)}
                  </TableCell>
                  <TableCell className={resultTable.cell}>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResultTableFrame>
      </ResultSection>
    )
  }

  return (
    <div className="motion-stagger flex flex-col gap-8">
      <ResultContext clientName={data.clientName} period={data.period} />
      <CountLine
        items={[
          { label: "bank only", value: data.totals.bankOnlyCount, tone: "warning" },
          { label: "books only", value: data.totals.booksOnlyCount, tone: "warning" },
          { label: "matched", value: data.totals.matchedCount, tone: "success" },
          { label: "cleared", value: data.totals.clearedCount, tone: "success" },
        ]}
      />
      {renderSection("Unmatched", grouped.unmatched, resultTable.errorRow)}
      {renderSection("Proposed matches", grouped.proposed, resultTable.successRow)}
      {renderSection("Other", grouped.other)}
    </div>
  )
}
