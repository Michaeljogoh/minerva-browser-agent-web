"use client"

import * as React from "react"

import type { MonthEndExceptionReport } from "@/lib/types/task-results"
import { TaxDeltaResultView } from "@/components/agent-workspace/results/tax-delta-result"
import {
  StatusBadge,
  TaxSensitiveBadge,
} from "@/components/agent-workspace/results/result-badges"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatUsd } from "@/lib/format-task-result"
import { cn } from "@/lib/utils"

type SortKey = "description" | "amountUsd" | "proposedCategory" | "status"
type SortDir = "asc" | "desc"

type MonthEndResultViewProps = {
  data: MonthEndExceptionReport
}

export function MonthEndResultView({ data }: MonthEndResultViewProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>("description")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  const sorted = React.useMemo(() => {
    const rows = [...data.exceptions]
    rows.sort((a, b) => {
      const av =
        sortKey === "amountUsd"
          ? (a.amountUsd ?? 0)
          : String(a[sortKey] ?? "")
      const bv =
        sortKey === "amountUsd"
          ? (b.amountUsd ?? 0)
          : String(b[sortKey] ?? "")
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv))
      return sortDir === "asc" ? cmp : -cmp
    })
    return rows
  }, [data.exceptions, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sortLabel = (key: SortKey, label: string) => (
    <button
      type="button"
      className="font-mono text-[10px] uppercase tracking-wide hover:text-sh-text"
      onClick={() => toggleSort(key)}
    >
      {label}
      {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  )

  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] text-sh-text-muted">
        {data.clientName} · {data.period}
      </p>

      <Table>
        <TableHeader>
          <TableRow className="border-sh-border hover:bg-transparent">
            <TableHead>{sortLabel("description", "Description")}</TableHead>
            <TableHead>{sortLabel("amountUsd", "Amount")}</TableHead>
            <TableHead>{sortLabel("proposedCategory", "Category")}</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>{sortLabel("status", "Status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                "border-sh-border",
                row.taxSensitive && "border-l-2 border-l-[var(--sh-warning)]",
              )}
            >
              <TableCell className="max-w-[140px] truncate font-sans text-xs">
                {row.description}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {formatUsd(row.amountUsd)}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {row.proposedCategory ?? "—"}
              </TableCell>
              <TableCell>
                {row.taxSensitive ? <TaxSensitiveBadge /> : null}
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-sh-text-muted">
        <span>Exceptions: {data.totals.exceptionCount}</span>
        <span>Approved: {data.totals.approvedCount}</span>
        <span>Rejected: {data.totals.rejectedCount}</span>
        <span>Tax flags: {data.totals.taxFlagCount}</span>
      </div>

      {data.taxBrief ? (
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger className="font-mono text-[10px] text-sh-accent-link hover:underline">
            IRS tax brief ({data.taxBrief.findings.length} findings)
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <TaxDeltaResultView data={data.taxBrief} compact />
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  )
}
