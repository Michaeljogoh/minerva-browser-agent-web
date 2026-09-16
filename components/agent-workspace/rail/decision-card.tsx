"use client"

import type { ReasoningStep } from "@/lib/types/agent"
import { cn } from "@/lib/utils"

type TypeVisual = {
  label: string
  /** Timeline node styles */
  node: string
  /** Header label styles — filled badge vs plain text */
  labelClass: string
  filledLabel: boolean
}

const typeVisual: Record<ReasoningStep["type"], TypeVisual> = {
  action: {
    label: "Action",
    node: "size-2.5 bg-[#3B82F6]",
    labelClass: "text-[#3B82F6]",
    filledLabel: false,
  },
  observation: {
    label: "Observation",
    node: "size-2.5 bg-sh-accent-green",
    labelClass: "text-sh-accent-green",
    filledLabel: false,
  },
  reasoning: {
    label: "Reasoning",
    node: "size-2 border-[1.5px] border-sh-text-muted bg-transparent",
    labelClass: "text-sh-text-muted",
    filledLabel: false,
  },
  error: {
    label: "Error",
    node: "size-2.5 bg-(--sh-error)",
    labelClass: "bg-(--sh-error) text-white",
    filledLabel: true,
  },
  approval: {
    label: "Approval",
    node: "size-2.5 bg-(--sh-warning)",
    labelClass: "bg-(--sh-warning) text-sh-bg",
    filledLabel: true,
  },
  screenshot: {
    label: "Screenshot",
    node: "size-2.5 bg-[#8B5CF6]",
    labelClass: "text-[#8B5CF6]",
    filledLabel: false,
  },
}

function stepHeadline(step: ReasoningStep): string {
  switch (step.type) {
    case "action":
      return step.tool ? step.tool : step.content
    case "observation":
      return step.tool ?? step.content
    case "screenshot":
      return "Page screenshot captured"
    default:
      return step.content
  }
}

type DecisionCardProps = {
  step: ReasoningStep
  className?: string
}

export function DecisionCard({ step, className }: DecisionCardProps) {
  const visual = typeVisual[step.type]
  const headline = stepHeadline(step)
  const durationMs = step.metadata?.executionTimeMs
  const observationFailed =
    step.type === "observation" && step.metadata?.confidence === 0
  const observationStatus = observationFailed ? "Failed:" : "Success:"
  const observationStatusClass = observationFailed
    ? "text-(--sh-error)"
    : "text-sh-accent-green"

  const ariaLine =
    step.type === "observation"
      ? `${observationStatus} ${headline}`
      : headline

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
          "rounded-lg border border-sh-border bg-sh-surface px-3.5 py-3 font-mono",
          "transition-[border-color,background-color] duration-150 ease-out",
          step.type === "error" && "border-(--sh-error)/25 bg-(--sh-error)/5",
          step.type === "approval" &&
            "border-(--sh-warning)/30 bg-(--sh-warning)/5",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "font-mono text-[10px] font-semibold tracking-wide uppercase",
              visual.filledLabel
                ? "inline-flex items-center rounded-md px-2 py-0.5"
                : "pt-0.5",
              visual.labelClass,
            )}
          >
            {visual.label}
          </span>
          <time
            dateTime={new Date(step.timestamp).toISOString()}
            className="shrink-0 pt-0.5 font-mono text-[10px] tabular-nums text-sh-text-muted"
          >
            {new Date(step.timestamp).toLocaleTimeString()}
          </time>
        </div>

        {step.type === "observation" ? (
          <p className="mt-2 text-[13px] leading-snug">
            <span className={cn("font-medium", observationStatusClass)}>
              {observationStatus}
            </span>{" "}
            <span className="text-sh-text-muted">{headline}</span>
          </p>
        ) : (
          <p
            className={cn(
              "mt-2 text-[13px] leading-snug text-sh-text",
              step.type === "action" && "text-[15px] font-semibold tracking-tight",
            )}
          >
            {headline}
          </p>
        )}

        {step.type === "screenshot" && step.screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={step.screenshotUrl}
            alt="Page screenshot"
            className="mt-2.5 max-h-28 w-full rounded-md border border-sh-border object-cover object-top"
          />
        ) : null}

        {durationMs != null ? (
          <p className="mt-2 font-mono text-[10px] text-sh-text-muted">
            {durationMs}ms
          </p>
        ) : null}
      </div>
    </article>
  )
}