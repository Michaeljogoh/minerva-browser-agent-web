"use client"

import {
  ArrowUpRightIcon,
  BadgeCheckIcon,
  CircleMinusIcon,
  ListTodoIcon,
  ShieldCheckIcon,
} from "lucide-react"

import type { TaxCodeDeltaBriefResult } from "@/lib/types/task-results"
import {
  ActionList,
  IconTile,
  ResultContext,
  ResultSection,
} from "@/components/agent-workspace/results/result-primitives"
import { formatUsd } from "@/lib/format-task-result"
import { cn } from "@/lib/utils"

type TaxDeltaResultViewProps = {
  data: TaxCodeDeltaBriefResult
  compact?: boolean
}

const CONFIDENCE_SOLID: Record<TaxCodeDeltaBriefResult["confidence"], string> = {
  high: "bg-primary text-primary-foreground",
  medium: "bg-sh-warning text-sh-warning-fill",
  low: "bg-sh-error text-sh-on-error",
}

const SOLID_PILL =
  "inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-semibold"

export function TaxDeltaResultView({
  data,
  compact = false,
}: TaxDeltaResultViewProps) {
  const { impact, clientFacts } = data
  const hasClientFacts =
    clientFacts.equipmentSpendUsd != null || Boolean(clientFacts.depreciationNotes)

  return (
    <div className={cn("flex flex-col", compact ? "gap-6" : "motion-stagger gap-8")}>
      {!compact ? (
        <ResultContext
          clientName={data.query.clientName}
          period={`Tax year ${data.query.taxYear}`}
        >
          {data.query.topics.map((topic) => (
            <span
              key={topic}
              className={cn(SOLID_PILL, "bg-primary text-primary-foreground")}
            >
              {topic}
            </span>
          ))}
        </ResultContext>
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between",
          impact.affected
            ? "border-transparent bg-sh-success-fill"
            : "border-sh-border bg-sh-surface-raised",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <IconTile
            icon={impact.affected ? BadgeCheckIcon : CircleMinusIcon}
            tone={impact.affected ? "success" : "neutral"}
            className={cn("size-9 rounded-xl", impact.affected && "bg-primary text-primary-foreground")}
          />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-sh-text">
              {impact.affected ? "Client is affected" : "Client is not affected"}
            </p>
            <p className="mt-1 max-w-[60ch] text-[13px] leading-relaxed text-pretty text-sh-text-muted">
              {impact.rationale}
            </p>
          </div>
        </div>
        {impact.estimatedSavingsUsd != null ? (
          <div className="shrink-0 sm:text-right">
            <p className="text-[12px] font-medium text-sh-text-muted">
              Est. savings
            </p>
            <p className="font-mono text-[22px] font-semibold tracking-tight tabular-nums text-sh-accent-green">
              {formatUsd(impact.estimatedSavingsUsd)}
            </p>
          </div>
        ) : null}
      </div>

      <ResultSection title="Findings" count={data.findings.length}>
        <ul className="grid gap-3">
          {data.findings.map((finding) => (
            <li key={`${finding.title}-${finding.date}`}>
              <a
                href={finding.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 rounded-xl border border-sh-border bg-sh-surface-raised px-4 py-3.5 transition-colors duration-150 hover:border-[color-mix(in_srgb,var(--sh-border),var(--sh-accent-green)_40%)] focus-visible:ring-2 focus-visible:ring-sh-steer/40 focus-visible:outline-none"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[13.5px] font-semibold text-sh-text group-hover:text-sh-accent-green">
                    {finding.title}
                  </span>
                  <ArrowUpRightIcon
                    className="mt-0.5 size-4 shrink-0 text-sh-text-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sh-accent-green"
                    aria-hidden
                  />
                </span>
                <span className="font-mono text-[11.5px] text-sh-text-muted">
                  {finding.date}
                </span>
                <span className="text-[13px] leading-relaxed text-pretty text-sh-text-muted">
                  {finding.summary}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </ResultSection>

      {hasClientFacts ? (
        <ResultSection title="Client facts">
          <div className="flex flex-col gap-2 rounded-xl border border-sh-border bg-sh-surface-raised px-4 py-3.5">
            {clientFacts.equipmentSpendUsd != null ? (
              <p className="flex items-baseline justify-between gap-3 text-[13px] text-sh-text-muted">
                Equipment spend
                <span className="font-mono text-[14px] font-semibold tabular-nums text-sh-text">
                  {formatUsd(clientFacts.equipmentSpendUsd)}
                </span>
              </p>
            ) : null}
            {clientFacts.depreciationNotes ? (
              <p className="text-[13px] leading-relaxed text-pretty text-sh-text-muted">
                {clientFacts.depreciationNotes}
              </p>
            ) : null}
          </div>
        </ResultSection>
      ) : null}

      {data.recommendedActions && data.recommendedActions.length > 0 ? (
        <ResultSection title="Recommended next steps">
          <ActionList items={data.recommendedActions} icon={ListTodoIcon} />
        </ResultSection>
      ) : null}

      <p className="flex flex-wrap items-center gap-2 text-[12px] text-sh-text-muted">
        <ShieldCheckIcon className="size-3.5 text-sh-accent-green" aria-hidden />
        Confidence
        <span
          className={cn(SOLID_PILL, "capitalize", CONFIDENCE_SOLID[data.confidence])}
        >
          {data.confidence}
        </span>
        {data.sourcesChecked && data.sourcesChecked.length > 0 ? (
          <span className={cn(SOLID_PILL, "bg-sh-text text-sh-bg")}>
            {data.sourcesChecked.length} source
            {data.sourcesChecked.length === 1 ? "" : "s"} checked
          </span>
        ) : null}
      </p>
    </div>
  )
}
