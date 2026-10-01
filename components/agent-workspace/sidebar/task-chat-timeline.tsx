"use client"

import * as React from "react"
import {
  CameraIcon,
  CheckIcon,
  EyeIcon,
  GitBranchIcon,
  Loader2Icon,
  PlayIcon,
  ShieldAlertIcon,
  TriangleAlertIcon,
} from "lucide-react"

import type { ReasoningStep } from "@/lib/types/agent"
import { humanStepLabel } from "@/lib/step-copy"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

function stepIconClass(type: ReasoningStep["type"] | "initializing"): string {
  switch (type) {
    case "approval":
      return "text-sh-warning"
    case "error":
      return "text-sh-error"
    default:
      return "text-sh-text-muted"
  }
}

function StepIcon({
  type,
}: {
  type: ReasoningStep["type"] | "initializing"
}) {
  const className = cn("size-3.5 shrink-0", stepIconClass(type))

  switch (type) {
    case "initializing":
      return <Loader2Icon className={cn(className, "animate-spin")} aria-hidden />
    case "reasoning":
      return <GitBranchIcon className={className} aria-hidden />
    case "action":
      return <PlayIcon className={className} aria-hidden />
    case "observation":
      return <EyeIcon className={className} aria-hidden />
    case "screenshot":
      return <CameraIcon className={className} aria-hidden />
    case "approval":
      return <ShieldAlertIcon className={className} aria-hidden />
    case "error":
      return <TriangleAlertIcon className={className} aria-hidden />
    default:
      return <GitBranchIcon className={className} aria-hidden />
  }
}

type TaskChatTimelineProps = {
  className?: string
}

export function TaskChatTimeline({ className }: TaskChatTimelineProps) {
  const status = useAgentStore((s) => s.status)
  const reasoningSteps = useAgentStore((s) => s.reasoningSteps)
  const result = useAgentStore((s) => s.result)
  const endRef = React.useRef<HTMLDivElement>(null)

  const showInitializing = status === "connecting"
  const showAgentThinking =
    status === "running" && reasoningSteps.length === 0 && !result
  const showCompletion = status === "complete" && result != null
  const hasFlow =
    showInitializing ||
    showAgentThinking ||
    reasoningSteps.length > 0 ||
    showCompletion

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [reasoningSteps.length, status, showCompletion])

  if (!hasFlow) {
    return null
  }

  const workedSeconds =
    result != null ? (result.totalExecutionTimeMs / 1000).toFixed(1) : null

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 font-sans text-[13px] tracking-tight",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5" aria-live="polite">
        {showInitializing ? (
          <div className="flex items-center gap-2 text-[12px] text-sh-text">
            <StepIcon type="initializing" />
            <span>Starting cloud browser session…</span>
          </div>
        ) : null}

        {showAgentThinking ? (
          <div className="flex items-center gap-2 text-[12px] text-sh-text-muted">
            <StepIcon type="initializing" />
            <span>Agent is planning the first step…</span>
          </div>
        ) : null}

        {reasoningSteps.map((step, index) => {
          const isLatest =
            index === reasoningSteps.length - 1 &&
            !showCompletion &&
            status !== "idle"
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-2 text-[12px] leading-snug text-sh-text",
                !isLatest && "text-sh-text-muted",
              )}
            >
              <span className="mt-0.5">
                <StepIcon type={step.type} />
              </span>
              <span className="min-w-0">{humanStepLabel(step)}</span>
            </div>
          )
        })}
      </div>

      {showCompletion && result ? (
        <div className="flex flex-col gap-2">
          <div className="h-px w-full bg-sh-border" />
          <p className="text-[13px] leading-relaxed text-sh-text">
            {result.summary}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-sh-text-muted">
            <CheckIcon className="size-3.5 text-sh-accent-green" aria-hidden />
            Finished in {workedSeconds}s
          </p>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  )
}
