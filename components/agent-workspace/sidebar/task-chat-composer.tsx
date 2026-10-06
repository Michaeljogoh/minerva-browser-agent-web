"use client"

import * as React from "react"

import { TaskComposerControls } from "@/components/agent-workspace/sidebar/task-composer-controls"
import { SessionControls } from "@/components/agent-workspace/shell/session-controls"
import { isGoalEditable, isSessionActive } from "@/lib/types/agent"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import { ArrowUpIcon } from "lucide-react"

export function TaskChatComposer({ className }: { className?: string }) {
  const goal = useAgentStore((s) => s.goal)
  const submittedGoal = useAgentStore((s) => s.submittedGoal)
  const status = useAgentStore((s) => s.status)
  const isConnected = useAgentStore((s) => s.isConnected)
  const setGoal = useAgentStore((s) => s.setGoal)
  const startTask = useAgentStore((s) => s.startTask)
  const resumeTask = useAgentStore((s) => s.resumeTask)
  const injectGuidance = useAgentStore((s) => s.injectGuidance)

  const [guidance, setGuidance] = React.useState("")
  const [goalError, setGoalError] = React.useState<string | null>(null)

  const canEditGoal = isGoalEditable(status)
  const isPaused = status === "paused"
  const canSteer =
    status === "running" || status === "paused" || status === "approval_pending"
  const isFollowUp = submittedGoal.trim().length > 0
  const hasGuidance = guidance.trim().length > 0
  const showRun = canEditGoal
  const sessionLive = isSessionActive(status)

  const handleRun = () => {
    if (!goal.trim()) {
      setGoalError("Describe the job, or pick a demo above.")
      return
    }
    setGoalError(null)
    startTask()
  }

  const handleSendGuidance = () => {
    if (!hasGuidance) {
      return
    }
    injectGuidance(guidance)
    setGuidance("")
    if (isPaused) {
      resumeTask()
    }
  }

  const handlePrimaryAction = () => {
    if (canSteer) {
      if (hasGuidance) {
        handleSendGuidance()
        return
      }
      if (isPaused) {
        resumeTask()
      }
      return
    }
    handleRun()
  }

  const primaryDisabled = showRun
    ? !goal.trim() || !isConnected || sessionLive
    : canSteer
      ? !hasGuidance && !isPaused
      : true

  const primaryLabel = canSteer
    ? hasGuidance
      ? isPaused
        ? "Send and resume"
        : "Send direction"
      : "Resume"
    : isFollowUp
      ? "Run follow-up"
      : "Run"

  return (
    <div
      className={cn(
        "shrink-0 border-t border-sh-border bg-sh-bg p-4",
        className,
      )}
    >
      {status === "connecting" ? (
        <div className="mb-2 flex items-center gap-2 font-sans text-[12px] text-sh-text-muted">
          <Spinner className="size-3.5" />
          Starting cloud browser for this job…
        </div>
      ) : null}

      <div
        className={cn(
          "rounded-2xl border border-sh-border bg-sh-surface-raised transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-within:border-[color-mix(in_srgb,var(--sh-border),var(--sh-accent-green)_55%)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--sh-accent-green)_12%,transparent)]",
          goalError && !canSteer && "border-sh-error/50",
        )}
      >
        <Textarea
          value={canSteer ? guidance : goal}
          onChange={(e) => {
            if (canSteer) {
              setGuidance(e.target.value)
              return
            }
            setGoal(e.target.value)
            if (e.target.value.trim()) {
              setGoalError(null)
            }
          }}
          disabled={!canEditGoal && !canSteer}
          aria-invalid={goalError != null}
          aria-label={
            canSteer
              ? "Direction for the agent while it works"
              : "Job for the agent"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !primaryDisabled) {
              e.preventDefault()
              handlePrimaryAction()
            }
          }}
          className={cn(
            "min-h-16 resize-none rounded-none border-0 bg-transparent px-3.5 pt-3.5 pb-1.5 font-sans text-[13px] leading-relaxed text-sh-text shadow-none placeholder:text-sh-text-muted focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent",
          )}
          placeholder={
            canSteer
              ? isPaused
                ? "Tell it what to do next, or resume as-is…"
                : ""
              : isFollowUp
                ? "Ask a follow-up, or pick another job"
                : "Pick a demo, or describe the accounting job"
          }
        />

        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <TaskComposerControls />
          <div className="flex items-center gap-1.5">
            <SessionControls compact />
            {showRun || hasGuidance ? (
              <Button
                type="button"
                size="sm"
                className="h-8 px-3.5 text-[12.5px]"
                disabled={primaryDisabled}
                aria-label={primaryLabel}
                onClick={handlePrimaryAction}
              >
                <ArrowUpIcon data-icon="inline-start" className="size-3.5" />
                {primaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {goalError && !canSteer ? (
        <p role="alert" className="motion-crossfade mt-2 font-sans text-[12px] text-sh-error">
          {goalError}
        </p>
      ) : null}
    </div>
  )
}
