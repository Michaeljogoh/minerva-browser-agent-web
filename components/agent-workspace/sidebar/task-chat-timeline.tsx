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

import { TaskApprovalCard } from "@/components/agent-workspace/sidebar/task-approval-card"
import type { ReasoningStep } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

function stepLabel(step: ReasoningStep): string {
  switch (step.type) {
    case "reasoning":
      return step.content.trim() || "Planning next moves"
    case "action":
      return step.tool ? `Action: ${step.tool}` : "Action"
    case "observation":
      return "Observing"
    case "screenshot":
      return "Screenshotting"
    case "approval":
      return "Waiting for approval"
    case "error":
      return step.content.trim() || "Error"
    default:
      return step.content
  }
}

/** Semantic tones for agent activity kinds — aligned with decision-card. */
function stepTone(type: ReasoningStep["type"] | "initializing"): string {
  switch (type) {
    case "action":
      // Execute / do — blue-500, shared with agent rail Action nodes
      return "text-[#3B82F6]"
    case "observation":
      // Understood / sense — brand success green
      return "text-sh-accent-green"
    case "screenshot":
      // Capture / media — violet-500, distinct from action + observe
      return "text-[#8B5CF6]"
    case "approval":
      return "text-(--sh-warning)"
    case "error":
      return "text-(--sh-error)"
    case "initializing":
      return "text-sh-text"
    default:
      return "text-sh-text-muted"
  }
}

function StepIcon({
  type,
}: {
  type: ReasoningStep["type"] | "initializing"
}) {
  const className = cn("size-3.5 shrink-0", stepTone(type))

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
  const pendingApproval = useAgentStore((s) => s.pendingApproval)
  const endRef = React.useRef<HTMLDivElement>(null)

  const showInitializing =
    status === "connecting" ||
    (status === "running" && reasoningSteps.length === 0 && !result)

  const showCompletion = status === "complete" && result != null
  const showApproval = pendingApproval != null
  const hasFlow =
    showInitializing ||
    reasoningSteps.length > 0 ||
    showApproval ||
    showCompletion

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [
    reasoningSteps.length,
    status,
    pendingApproval?.approvalId,
    showCompletion,
  ])

  if (!hasFlow) {
    return null
  }

  const workedSeconds =
    result != null
      ? (result.totalExecutionTimeMs / 1000).toFixed(1)
      : null

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1.5" aria-live="polite">
        {showInitializing ? (
          <div className="flex items-center gap-2 text-[13px] text-sh-text">
            <StepIcon type="initializing" />
            <span className="font-sans">
              Initializing
              <span className="text-sh-text-muted">…</span>
            </span>
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
                "flex items-start gap-2 text-[13px] leading-snug",
                stepTone(step.type),
                !isLatest && "opacity-70",
              )}
            >
              <span className="mt-0.5">
                <StepIcon type={step.type} />
              </span>
              <span className="min-w-0 font-sans">{stepLabel(step)}</span>
            </div>
          )
        })}
      </div>

      {showApproval ? <TaskApprovalCard /> : null}

      {showCompletion && result ? (
        <div className="flex flex-col gap-3">
          <div className="h-px w-full bg-sh-border/80" />
          <p className="font-sans text-[13px] leading-relaxed text-sh-text">
            {result.summary}
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-sh-text-muted">
            <CheckIcon className="size-3 text-sh-accent-green" aria-hidden />
            Worked for {workedSeconds}s
          </p>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  )
}
