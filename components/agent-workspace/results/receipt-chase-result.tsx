"use client"

import type { ReceiptChaseResult } from "@/lib/types/task-results"
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
import { formatUsd } from "@/lib/format-task-result"
import { cn } from "@/lib/utils"

type ReceiptChaseResultViewProps = {
  data: ReceiptChaseResult
}

export function ReceiptChaseResultView({ data }: ReceiptChaseResultViewProps) {
  return (
    <div className="motion-stagger flex flex-col gap-8">
      <ResultContext clientName={data.clientName} period={data.period} />

      <CountLine
        items={[
          { label: "found", value: data.totals.foundCount },
          { label: "posted", value: data.totals.postedCount, tone: "success" },
          { label: "missing", value: data.totals.missingCount, tone: "error" },
        ]}
      />


      {data.items.length > 0 ? (
      <ResultSection title="Receipts" count={data.items.length}>
        <ResultTableFrame>
          <Table>
            <TableHeader>
              <TableRow className={resultTable.headRow}>
                <TableHead className={resultTable.head}>Vendor</TableHead>
                <TableHead className={cn(resultTable.head, "text-right")}>
                  Amount
                </TableHead>
                <TableHead className={resultTable.head}>Source</TableHead>
                <TableHead className={resultTable.head}>Category</TableHead>
                <TableHead className={resultTable.head}>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    resultTable.row,
                    item.status === "missing" && resultTable.errorRow,
                  )}
                >
                  <TableCell
                    className={cn(resultTable.cell, "max-w-[200px] truncate font-medium")}
                    title={item.vendor}
                  >
                    {item.vendor ?? "-"}
                  </TableCell>
                  <TableCell className={resultTable.num}>
                    {formatUsd(item.amountUsd)}
                  </TableCell>
                  <TableCell className={cn(resultTable.cell, "capitalize text-sh-text-muted")}>
                    {item.source}
                  </TableCell>
                  <TableCell className={cn(resultTable.cell, "text-sh-text-muted")}>
                    {item.proposedCategory ?? "-"}
                  </TableCell>
                  <TableCell className={resultTable.cell}>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResultTableFrame>
      </ResultSection>
      ) : null}
    </div>
  )
}
