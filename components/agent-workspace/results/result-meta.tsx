"use client"

import type * as React from "react"
import { ArrowRightIcon, CheckIcon, FootprintsIcon, TimerIcon } from "lucide-react"

import {
  ActionList,
  ResultSection,
} from "@/components/agent-workspace/results/result-primitives"
import { formatDuration, TASK_TYPE_LABEL } from "@/lib/format-task-result"
import type { TaskResult } from "@/lib/types/task-results"

type ResultMetaProps = {
  result: TaskResult
}

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof TimerIcon
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-sh-surface px-2.5 text-[12px] font-medium text-sh-text-muted">
      <Icon className="size-3.5 text-sh-accent-green" aria-hidden />
      {children}
    </span>
  )
}

export function ResultMeta({ result }: ResultMetaProps) {
  return (
    <header className="motion-rise flex items-start gap-4">
      <span
        aria-hidden
        className="motion-pop flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
      >
        <CheckIcon className="size-5" strokeWidth={2.5} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <p className="text-[12px] font-semibold text-sh-accent-green">
          Ready for your review
          <span className="font-medium text-sh-text-muted">
            {" "}
            · {TASK_TYPE_LABEL[result.taskType] ?? "Job"}
          </span>
        </p>
        <h2 className="max-w-[65ch] text-[18px] leading-snug font-semibold tracking-tight text-pretty text-sh-text">
          {result.summary}
        </h2>
        <div className="flex flex-wrap gap-2">
          <MetaChip icon={FootprintsIcon}>
            {result.totalSteps} step{result.totalSteps === 1 ? "" : "s"}
          </MetaChip>
          <MetaChip icon={TimerIcon}>
            {formatDuration(result.totalExecutionTimeMs)}
          </MetaChip>
        </div>
      </div>
    </header>
  )
}

export function ResultFollowUps({ result }: ResultMetaProps) {
  const followUps = result.followUpActions ?? []
  if (followUps.length === 0) {
    return null
  }
  return (
    <ResultSection title="Suggested follow-ups" className="motion-rise">
      <ActionList items={followUps} icon={ArrowRightIcon} />
    </ResultSection>
  )
}
