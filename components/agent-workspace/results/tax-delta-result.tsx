"use client"

import type { TaxCodeDeltaBriefResult } from "@/lib/types/task-results"
import { formatUsd } from "@/lib/format-task-result"
import { cn } from "@/lib/utils"

type TaxDeltaResultViewProps = {
  data: TaxCodeDeltaBriefResult
  compact?: boolean
}

export function TaxDeltaResultView({
  data,
  compact = false,
}: TaxDeltaResultViewProps) {
  return (
    <div className={cn("space-y-3", compact && "text-xs")}>
      {!compact ? (
        <p className="font-mono text-[10px] text-sh-text-muted">
          {data.query.clientName} · {data.query.taxYear} ·{" "}
          {data.query.topics.join(", ")}
        </p>
      ) : null}

      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
          Findings
        </p>
        <ul className="space-y-2">
          {data.findings.map((finding) => (
            <li
              key={`${finding.title}-${finding.date}`}
              className="border border-sh-border bg-sh-bg px-2 py-1.5"
            >
              <a
                href={finding.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-sh-accent-link hover:underline"
              >
                {finding.title}
              </a>
              <p className="font-mono text-[10px] text-sh-text-muted">
                {finding.date}
              </p>
              <p className="mt-1 font-sans text-xs text-sh-text-muted">
                {finding.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-sh-border bg-sh-bg p-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
          Client facts
        </p>
        {data.clientFacts.equipmentSpendUsd != null ? (
          <p className="font-mono text-xs text-sh-text">
            Equipment spend: {formatUsd(data.clientFacts.equipmentSpendUsd)}
          </p>
        ) : null}
        {data.clientFacts.depreciationNotes ? (
          <p className="font-sans text-xs text-sh-text-muted">
            {data.clientFacts.depreciationNotes}
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "border border-l-2 p-2",
          data.impact.affected
            ? "border-l-sh-accent-green bg-sh-bg"
            : "border-l-sh-text-muted bg-sh-bg",
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
          Impact
        </p>
        <p className="font-sans text-sm text-sh-text">
          {data.impact.affected ? "Affected" : "Not affected"}
        </p>
        <p className="font-sans text-xs text-sh-text-muted">
          {data.impact.rationale}
        </p>
        {data.impact.estimatedSavingsUsd != null ? (
          <p className="mt-1 font-mono text-xs text-sh-accent-green">
            Est. savings: {formatUsd(data.impact.estimatedSavingsUsd)}
          </p>
        ) : null}
      </div>
    </div>
  )
}
