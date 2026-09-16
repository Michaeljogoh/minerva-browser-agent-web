"use client"

import type { ReceiptChaseResult } from "@/lib/types/task-results"
import { StatusBadge } from "@/components/agent-workspace/results/result-badges"
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
    <div className="space-y-3">
      <p className="font-mono text-[10px] text-sh-text-muted">
        {data.clientName} · {data.period}
      </p>

      <Table>
        <TableHeader>
          <TableRow className="border-sh-border hover:bg-transparent">
            <TableHead className="font-mono text-[10px]">Vendor</TableHead>
            <TableHead className="font-mono text-[10px]">Amount</TableHead>
            <TableHead className="font-mono text-[10px]">Source</TableHead>
            <TableHead className="font-mono text-[10px]">Category</TableHead>
            <TableHead className="font-mono text-[10px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item) => (
            <TableRow
              key={item.id}
              className={cn(
                "border-sh-border",
                item.status === "missing" &&
                  "border-l-2 border-l-[var(--sh-error)] bg-sh-bg",
              )}
            >
              <TableCell className="max-w-[100px] truncate font-sans text-xs">
                {item.vendor ?? "—"}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {formatUsd(item.amountUsd)}
              </TableCell>
              <TableCell className="font-mono text-xs capitalize">
                {item.source}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {item.proposedCategory ?? "—"}
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-sh-text-muted">
        <span>Found: {data.totals.foundCount}</span>
        <span>Posted: {data.totals.postedCount}</span>
        <span>Missing: {data.totals.missingCount}</span>
      </div>
    </div>
  )
}
