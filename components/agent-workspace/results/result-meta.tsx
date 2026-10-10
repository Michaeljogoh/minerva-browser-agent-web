"use client"

import type * as React from "react"
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  TriangleAlertIcon,
} from "lucide-react"

import {
  ActionList,
  ResultSection,
  TONE_FILL,
  type ResultTone,
} from "@/components/agent-workspace/results/result-primitives"
import { ResultMarkdown } from "@/components/agent-workspace/results/result-markdown"
import { formatDuration, TASK_TYPE_LABEL } from "@/lib/format-task-result"
import type { TaskOutcome, TaskResult } from "@/lib/types/task-results"
import { cn } from "@/lib/utils"

type ResultMetaProps = {
  result: TaskResult
}

const OUTCOME: Record<
  TaskOutcome,
  { label: string; tone: ResultTone; icon: typeof CircleCheckIcon }
> = {
  success: { label: "Completed", tone: "success", icon: CircleCheckIcon },
  partial: {
    label: "Completed with issues",
    tone: "warning",
    icon: TriangleAlertIcon,
  },
  failed: { label: "Failed", tone: "error", icon: CircleXIcon },
}

export function ResultMeta({ result }: ResultMetaProps) {
  const outcome = OUTCOME[result.outcome ?? "success"]
  const Icon = outcome.icon
  const steps = `${result.totalSteps} step${result.totalSteps === 1 ? "" : "s"}`

  return (
    <header className="motion-rise flex flex-col gap-3.5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-sh-text-muted">
        <span
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-semibold",
            TONE_FILL[outcome.tone],
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {outcome.label}
        </span>
        <span>
          {TASK_TYPE_LABEL[result.taskType] ?? "Job"} · {steps} ·{" "}
          {formatDuration(result.totalExecutionTimeMs)}
        </span>
      </p>
      <ResultMarkdown>{result.summary}</ResultMarkdown>
      {result.failureReason && result.outcome !== "success" ? (
        <p className="max-w-[72ch] text-[13px] text-sh-text-muted">
          <span className="font-semibold text-sh-text">Why: </span>
          {result.failureReason}
        </p>
      ) : null}
    </header>
  )
}

export function ResultFollowUps({ result }: ResultMetaProps) {
  const followUps = result.followUpActions ?? []
  if (followUps.length === 0) {
    return null
  }
  return (
    <ResultSection title="Next steps" className="motion-rise">
      <ActionList items={followUps} icon={ArrowRightIcon} />
    </ResultSection>
  )
}
