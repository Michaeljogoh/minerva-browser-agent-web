"use client"

import type { BankRecDiffResult } from "@/lib/types/task-results"
import { StatusBadge } from "@/components/agent-workspace/results/result-badges"
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
  ) => {
    if (rows.length === 0) {
      return null
    }
    return (
      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
          {title}
        </p>
        <Table>
          <TableHeader>
            <TableRow className="border-sh-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px]">Side</TableHead>
              <TableHead className="font-mono text-[10px]">
                Description
              </TableHead>
              <TableHead className="font-mono text-[10px]">Amount</TableHead>
              <TableHead className="font-mono text-[10px]">Date</TableHead>
              <TableHead className="font-mono text-[10px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "border-sh-border",
                  row.status === "proposed_match" &&
                    "border-l-2 border-l-sh-accent-green bg-sh-bg",
                )}
              >
                <TableCell className="font-mono text-xs capitalize">
                  {row.side}
                </TableCell>
                <TableCell className="max-w-[120px] truncate font-sans text-xs">
                  {row.description}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatUsd(row.amountUsd)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatDate(row.date)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] text-sh-text-muted">
        {data.clientName} · {data.period}
      </p>
      {renderSection("Unmatched", grouped.unmatched)}
      {renderSection("Proposed matches", grouped.proposed)}
      {renderSection("Other", grouped.other)}
      <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-sh-text-muted">
        <span>Bank only: {data.totals.bankOnlyCount}</span>
        <span>Books only: {data.totals.booksOnlyCount}</span>
        <span>Matched: {data.totals.matchedCount}</span>
        <span>Cleared: {data.totals.clearedCount}</span>
      </div>
    </div>
  )
}
