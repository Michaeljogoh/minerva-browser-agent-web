"use client"

import * as React from "react"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  FileWarningIcon,
  LandmarkIcon,
  ListTodoIcon,
} from "lucide-react"

import type { MonthEndExceptionReport } from "@/lib/types/task-results"
import { TaxDeltaResultView } from "@/components/agent-workspace/results/tax-delta-result"
import {
  StatusBadge,
  TaxSensitiveBadge,
} from "@/components/agent-workspace/results/result-badges"
import {
  ActionList,
  CountChip,
  ResultContext,
  ResultSection,
  ResultTableFrame,
  CountLine,
  resultTable,
} from "@/components/agent-workspace/results/result-primitives"
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

  const ariaSort = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none"

  const sortLabel = (key: SortKey, label: string, alignEnd = false) => {
    const SortIcon =
      sortKey !== key
        ? ArrowUpDownIcon
        : sortDir === "asc"
          ? ArrowUpIcon
          : ArrowDownIcon
    return (
      <button
        type="button"
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-md transition-colors duration-150 hover:text-sh-text focus-visible:ring-2 focus-visible:ring-sh-steer/40 focus-visible:outline-none",
          sortKey === key && "text-sh-text",
          alignEnd && "flex-row-reverse",
        )}
        onClick={() => toggleSort(key)}
      >
        {label}
        <SortIcon
          className={cn("size-3", sortKey !== key && "opacity-50")}
          aria-hidden
        />
      </button>
    )
  }

  const hasBlockers = (data.blockers?.length ?? 0) > 0
  const hasMissing = (data.missingDocuments?.length ?? 0) > 0

  return (
    <div className="motion-stagger flex flex-col gap-8">
      <ResultContext clientName={data.clientName} period={data.period}>
        {data.closeStatus ? <StatusBadge status={data.closeStatus} /> : null}
      </ResultContext>

      <CountLine
        items={[
          { label: "exceptions", value: data.totals.exceptionCount },
          { label: "approved", value: data.totals.approvedCount, tone: "success" },
          { label: "rejected", value: data.totals.rejectedCount, tone: "error" },
          { label: "tax flags", value: data.totals.taxFlagCount, tone: "warning" },
        ]}
      />


      {hasBlockers || hasMissing ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {hasBlockers ? (
            <ResultSection title="Blockers" count={data.blockers!.length}>
              <ActionList items={data.blockers!} tone="warning" />
            </ResultSection>
          ) : null}
          {hasMissing ? (
            <ResultSection
              title="Missing documents"
              count={data.missingDocuments!.length}
            >
              <ActionList
                items={data.missingDocuments!}
                tone="error"
                icon={FileWarningIcon}
              />
            </ResultSection>
          ) : null}
        </div>
      ) : null}

      {sorted.length > 0 ? (
      <ResultSection title="Exceptions" count={sorted.length}>
        <ResultTableFrame>
          <Table>
            <TableHeader>
              <TableRow className={resultTable.headRow}>
                <TableHead
                  className={resultTable.head}
                  aria-sort={ariaSort("description")}
                >
                  {sortLabel("description", "Description")}
                </TableHead>
                <TableHead
                  className={cn(resultTable.head, "text-right")}
                  aria-sort={ariaSort("amountUsd")}
                >
                  {sortLabel("amountUsd", "Amount", true)}
                </TableHead>
                <TableHead
                  className={resultTable.head}
                  aria-sort={ariaSort("proposedCategory")}
                >
                  {sortLabel("proposedCategory", "Category")}
                </TableHead>
                <TableHead className={resultTable.head}>Tax</TableHead>
                <TableHead
                  className={resultTable.head}
                  aria-sort={ariaSort("status")}
                >
                  {sortLabel("status", "Status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    resultTable.row,
                    row.taxSensitive && resultTable.warnRow,
                  )}
                >
                  <TableCell
                    className={cn(resultTable.cell, "max-w-[240px] truncate")}
                    title={row.description}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell className={resultTable.num}>
                    {formatUsd(row.amountUsd)}
                  </TableCell>
                  <TableCell className={cn(resultTable.cell, "text-sh-text-muted")}>
                    {row.proposedCategory ?? "-"}
                  </TableCell>
                  <TableCell className={resultTable.cell}>
                    {row.taxSensitive ? <TaxSensitiveBadge /> : null}
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
      ) : null}

      {data.checklist && data.checklist.length > 0 ? (
        <ResultSection title="Close checklist" count={data.checklist.length}>
          <ActionList items={data.checklist} icon={ListTodoIcon} />
        </ResultSection>
      ) : null}

      {data.taxBrief ? (
        <Collapsible
          defaultOpen={false}
          className="rounded-xl border border-sh-border bg-sh-surface-raised"
        >
          <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-colors duration-150 hover:bg-sh-surface/60 focus-visible:ring-2 focus-visible:ring-sh-steer/40 focus-visible:outline-none">
            <span className="flex items-center gap-2.5">
              <LandmarkIcon className="size-4 text-sh-accent-green" aria-hidden />
              <span className="text-[13px] font-semibold text-sh-text">
                IRS tax brief
              </span>
              <CountChip count={data.taxBrief.findings.length} />
            </span>
            <ChevronDownIcon
              className="size-4 text-sh-text-muted transition-transform duration-200 ease-out group-data-panel-open:rotate-180"
              aria-hidden
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t border-sh-border px-4 py-4">
            <TaxDeltaResultView data={data.taxBrief} compact />
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  )
}
