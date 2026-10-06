"use client"

import type { ReasoningStep } from "@/lib/types/agent"
import { humanStepLabel } from "@/lib/step-copy"
import { cn } from "@/lib/utils"

type TypeVisual = {
  label: string
  node: string
  labelClass: string
  filledLabel: boolean
}

const typeVisual: Record<ReasoningStep["type"], TypeVisual> = {
  action: {
    label: "Did",
    node: "size-2.5 bg-sh-steer",
    labelClass: "text-sh-steer",
    filledLabel: false,
  },
  observation: {
    label: "Looked",
    node: "size-2.5 bg-sh-accent-green",
    labelClass: "text-sh-accent-green",
    filledLabel: false,
  },
  reasoning: {
    label: "Thought",
    node: "size-2 border-[1.5px] border-sh-text-muted bg-transparent",
    labelClass: "text-sh-text-muted",
    filledLabel: false,
  },
  error: {
    label: "Problem",
    node: "size-2.5 bg-sh-error",
    labelClass: "bg-sh-error text-sh-on-error",
    filledLabel: true,
  },
  approval: {
    label: "Needs you",
    node: "size-2.5 bg-sh-warning",
    labelClass: "bg-sh-warning-fill text-sh-warning",
    filledLabel: true,
  },
  screenshot: {
    label: "Checked",
    node: "size-2.5 bg-sh-text-muted",
    labelClass: "text-sh-text-muted",
    filledLabel: false,
  },
}

type DecisionCardProps = {
  step: ReasoningStep
  className?: string
}

export function DecisionCard({ step, className }: DecisionCardProps) {
  const visual = typeVisual[step.type]
  const headline = humanStepLabel(step)
  const durationMs = step.metadata?.executionTimeMs
  const observationFailed =
    step.type === "observation" && step.metadata?.confidence === 0

  const ariaLine = observationFailed ? `Couldn’t finish: ${headline}` : headline

  return (
    <article
      aria-label={`${visual.label}: ${ariaLine}`}
      className={cn("relative pl-6 motion-card-enter", className)}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px] ring-sh-bg",
          visual.node,
        )}
      />
      <div
        className={cn(
          "rounded-xl border border-sh-border bg-sh-surface-raised px-3.5 py-3",
          "transition-[border-color,background-color] duration-150 ease-out",
          step.type === "error" && "border-sh-error/25 bg-sh-error-fill",
          step.type === "approval" && "border-sh-warning/30 bg-sh-warning-fill/80",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "font-sans text-[11px] font-semibold tracking-wide",
              visual.filledLabel
                ? "inline-flex items-center rounded-full px-2 py-0.5"
                : "pt-0.5",
              visual.labelClass,
            )}
          >
            {visual.label}
          </span>
          <time
            dateTime={new Date(step.timestamp).toISOString()}
            className="shrink-0 pt-0.5 font-sans text-[11px] tabular-nums text-sh-text-muted"
          >
            {new Date(step.timestamp).toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}
          </time>
        </div>

        <p className="mt-2 font-sans text-[13px] leading-snug text-sh-text">
          {observationFailed ? `Couldn’t finish: ${headline}` : headline}
        </p>

        {step.type === "screenshot" && step.screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={step.screenshotUrl}
            alt="Page screenshot"
            width={640}
            height={200}
            className="mt-2.5 max-h-28 w-full rounded-lg border border-sh-border object-cover object-top"
          />
        ) : null}

        {durationMs != null ? (
          <p className="mt-2 font-sans text-[11px] tabular-nums text-sh-text-muted">
            {(durationMs / 1000).toFixed(1)}s
          </p>
        ) : null}
      </div>
    </article>
  )
}
