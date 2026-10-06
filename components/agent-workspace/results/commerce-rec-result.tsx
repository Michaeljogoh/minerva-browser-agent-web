"use client"

import {
  BanknoteIcon,
  CircleAlertIcon,
  ListTodoIcon,
  ReceiptIcon,
  WalletIcon,
} from "lucide-react"

import type { CommerceReconciliationResult } from "@/lib/types/task-results"
import { StatusBadge } from "@/components/agent-workspace/results/result-badges"
import {
  ActionList,
  ResultContext,
  ResultSection,
  ResultTableFrame,
  StatGrid,
  resultTable,
  toneWhen,
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

type CommerceRecResultViewProps = {
  data: CommerceReconciliationResult
}

export function CommerceRecResultView({ data }: CommerceRecResultViewProps) {
  const exceptions = data.rows.filter((row) => row.status !== "matched")
  const matched = data.rows.filter((row) => row.status === "matched")

  return (
    <div className="motion-stagger flex flex-col gap-8">
      <ResultContext clientName={data.clientName} period={data.period}>
        {data.connectedSources.map((source) => (
          <span
            key={source}
            className="inline-flex h-6 items-center rounded-full bg-sh-surface px-2.5 text-[11.5px] font-medium capitalize text-sh-text-muted"
          >
            {source}
          </span>
        ))}
      </ResultContext>

      <StatGrid
        items={[
          {
            label: "Gross",
            value: formatUsd(data.totals.grossUsd),
            icon: BanknoteIcon,
          },
          {
            label: "Fees",
            value: formatUsd(data.totals.feeUsd),
            icon: ReceiptIcon,
          },
          {
            label: "Net payout",
            value: formatUsd(data.totals.netUsd),
            icon: WalletIcon,
            tone: "success",
          },
          {
            label: "Exceptions",
            value: String(data.totals.exceptionCount),
            icon: CircleAlertIcon,
            tone: toneWhen(data.totals.exceptionCount, "warning"),
          },
        ]}
      />

      {exceptions.length > 0 ? (
        <RowTable title="Needs review" rows={exceptions} highlight />
      ) : null}
      {matched.length > 0 ? <RowTable title="Matched" rows={matched} /> : null}

      {data.nextActions.length > 0 ? (
        <ResultSection title="Next for the accountant">
          <ActionList items={data.nextActions} icon={ListTodoIcon} />
        </ResultSection>
      ) : null}
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
    <ResultSection title={title} count={rows.length}>
      <ResultTableFrame>
        <Table className={resultTable.fixed}>
          <TableHeader>
            <TableRow className={resultTable.headRow}>
              <TableHead className={cn(resultTable.head, "w-[110px]")}>
                Source
              </TableHead>
              <TableHead className={resultTable.head}>Description</TableHead>
              <TableHead className={cn(resultTable.head, "w-[120px] text-right")}>
                Gross
              </TableHead>
              <TableHead className={cn(resultTable.head, "w-[120px] text-right")}>
                Net
              </TableHead>
              <TableHead className={cn(resultTable.head, "w-[170px]")}>
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(resultTable.row, highlight && resultTable.warnRow)}
              >
                <TableCell
                  className={cn(resultTable.cell, "font-medium capitalize")}
                >
                  {row.source}
                </TableCell>
                <TableCell className={resultTable.cell}>
                  <p className="truncate" title={row.description}>
                    {row.description}
                  </p>
                  {row.exceptionReason ? (
                    <p className="mt-0.5 truncate text-[12px] text-sh-warning">
                      {row.exceptionReason}
                    </p>
                  ) : null}
                  {row.payoutDate || row.saleDate ? (
                    <p className={cn(resultTable.muted, "mt-0.5")}>
                      {formatDate(row.saleDate ?? row.payoutDate)}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className={resultTable.num}>
                  {formatUsd(row.grossUsd)}
                </TableCell>
                <TableCell className={cn(resultTable.num, "font-semibold")}>
                  {formatUsd(row.netUsd)}
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
