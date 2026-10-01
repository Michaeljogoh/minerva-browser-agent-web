"use client"

import type { CommerceReconciliationResult } from "@/lib/types/task-results"
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

type CommerceRecResultViewProps = {
  data: CommerceReconciliationResult
}

export function CommerceRecResultView({ data }: CommerceRecResultViewProps) {
  const exceptions = data.rows.filter((row) => row.status !== "matched")
  const matched = data.rows.filter((row) => row.status === "matched")

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] text-sh-text-muted">
          {data.clientName} · {data.period}
        </p>
        {data.connectedSources.length > 0 ? (
          <p className="font-mono text-[10px] text-sh-text-muted">
            Sources: {data.connectedSources.join(" · ")}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        <Stat label="Gross" value={formatUsd(data.totals.grossUsd)} />
        <Stat label="Net payout" value={formatUsd(data.totals.netUsd)} />
        <Stat
          label="Exceptions"
          value={String(data.totals.exceptionCount)}
          warn={data.totals.exceptionCount > 0}
        />
      </div>

      {exceptions.length > 0 ? (
        <RowTable title="Needs review" rows={exceptions} highlight />
      ) : null}
      {matched.length > 0 ? (
        <RowTable title="Matched" rows={matched} />
      ) : null}

      {data.nextActions.length > 0 ? (
        <div className="border border-sh-border bg-sh-bg px-2.5 py-2">
          <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
            Next for the accountant
          </p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 font-sans text-xs text-sh-text">
            {data.nextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string
  value: string
  warn?: boolean
}) {
  return (
    <div className="border border-sh-border bg-sh-bg px-2 py-1.5">
      <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-sm",
          warn ? "text-(--sh-warning)" : "text-sh-text",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function RowTable({
  title,
  rows,
  highlight,
}: {
  title: string
  rows: CommerceReconciliationResult["rows"]
  highlight?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
        {title}
      </p>
      <Table>
        <TableHeader>
          <TableRow className="border-sh-border hover:bg-transparent">
            <TableHead className="font-mono text-[10px]">Source</TableHead>
            <TableHead className="font-mono text-[10px]">Description</TableHead>
            <TableHead className="font-mono text-[10px]">Gross</TableHead>
            <TableHead className="font-mono text-[10px]">Net</TableHead>
            <TableHead className="font-mono text-[10px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                "border-sh-border",
                highlight &&
                  row.status !== "matched" &&
                  "border-l-2 border-l-(--sh-warning)",
              )}
            >
              <TableCell className="font-mono text-xs capitalize">
                {row.source}
              </TableCell>
              <TableCell className="max-w-[140px]">
                <p className="truncate font-sans text-xs">{row.description}</p>
                {row.exceptionReason ? (
                  <p className="truncate font-mono text-[10px] text-sh-text-muted">
                    {row.exceptionReason}
                  </p>
                ) : null}
                {row.payoutDate || row.saleDate ? (
                  <p className="font-mono text-[10px] text-sh-text-muted">
                    {formatDate(row.saleDate ?? row.payoutDate)}
                  </p>
                ) : null}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {formatUsd(row.grossUsd)}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {formatUsd(row.netUsd)}
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
