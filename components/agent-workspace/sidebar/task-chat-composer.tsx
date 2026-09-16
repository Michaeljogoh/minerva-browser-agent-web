"use client"

import * as React from "react"

import { TaskComposerControls } from "@/components/agent-workspace/sidebar/task-composer-controls"
import { isGoalEditable, isSessionActive } from "@/lib/types/agent"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import { ArrowUpIcon, SquareIcon } from "lucide-react"

export function TaskChatComposer({ className }: { className?: string }) {
  const goal = useAgentStore((s) => s.goal)
  const submittedGoal = useAgentStore((s) => s.submittedGoal)
  const status = useAgentStore((s) => s.status)
  const stepMode = useAgentStore((s) => s.stepMode)
  const isConnected = useAgentStore((s) => s.isConnected)
  const error = useAgentStore((s) => s.error)
  const setGoal = useAgentStore((s) => s.setGoal)
  const startTask = useAgentStore((s) => s.startTask)
  const stopTask = useAgentStore((s) => s.stopTask)
  const resumeTask = useAgentStore((s) => s.resumeTask)
  const injectGuidance = useAgentStore((s) => s.injectGuidance)

  const [guidance, setGuidance] = React.useState("")
  const [goalError, setGoalError] = React.useState<string | null>(null)

  const canEditGoal = isGoalEditable(status)
  const active = isSessionActive(status)
  const isPaused = status === "paused"
  const isComposing = canEditGoal && !isPaused && status === "idle"
  const isFollowUp = submittedGoal.trim().length > 0
  const stopDisabled = !active || (status === "error" && error?.fatal)
  const showStop =
    status === "connecting" ||
    status === "running" ||
    status === "approval_pending"

  const handleRun = () => {
    if (!goal.trim()) {
      setGoalError("Enter a prompt before running.")
      return
    }
    setGoalError(null)
    startTask()
  }

  const handlePrimaryAction = () => {
    if (showStop) {
      stopTask()
      return
    }
    if (isPaused) {
      if (guidance.trim()) {
        injectGuidance(guidance)
        setGuidance("")
        return
      }
      resumeTask()
      return
    }
    handleRun()
  }

  const primaryDisabled = showStop
    ? stopDisabled
    : isPaused
      ? false
      : !goal.trim() || !isConnected || active

  const primaryLabel = showStop
    ? "Stop"
    : isPaused
      ? guidance.trim()
        ? "Send"
        : stepMode
          ? "Continue"
          : "Resume"
      : "Run"

  return (
    <div
      className={cn(
        "shrink-0 border-t border-sh-border bg-sh-bg p-3",
        className,
      )}
    >
      {status === "connecting" ? (
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] text-sh-text-muted">
          <Spinner className="size-3" />
          Initializing browser session…
        </div>
      ) : null}

      {error && status !== "running" ? (
        <p className="mb-2 rounded-md border border-[var(--sh-error)] bg-sh-surface px-2 py-1.5 font-mono text-xs text-[var(--sh-error)]">
          {error.message}
        </p>
      ) : null}

      <div
        className={cn(
          "rounded-xl border border-sh-border bg-sh-surface shadow-sm",
          showStop && "opacity-90",
        )}
      >
        <Textarea
          value={isPaused ? guidance : goal}
          onChange={(e) => {
            if (isPaused) {
              setGuidance(e.target.value)
              return
            }
            setGoal(e.target.value)
            if (e.target.value.trim()) {
              setGoalError(null)
            }
          }}
          disabled={!canEditGoal && !isPaused}
          aria-invalid={goalError != null}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !primaryDisabled) {
              e.preventDefault()
              handlePrimaryAction()
            }
          }}
          className={cn(
            "resize-none rounded-none border-0 bg-transparent px-3 font-mono leading-[1.45] text-sh-text shadow-none placeholder:text-sh-text-muted focus-visible:ring-0",
            isFollowUp ? "min-h-12 pt-2.5 pb-1.5" : "min-h-20 pt-3 pb-2",
            isComposing
              ? "!text-[12px] placeholder:!text-[12px]"
              : "text-xs placeholder:text-xs",
            goalError && !isPaused && "text-[var(--sh-error)]",
          )}
          placeholder={
            isPaused
              ? "Add guidance while paused, or resume without a message…"
              : isFollowUp
                ? "Add a follow-up"
                : "Plan, Build, / for skills, @ for context"
          }
        />

        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <TaskComposerControls />
          <Button
            type="button"
            size="icon-sm"
            variant={showStop ? "destructive" : "default"}
            className={cn(
              "size-8 shrink-0 rounded-full",
              !showStop && "bg-sh-text text-sh-bg hover:bg-sh-text/90",
            )}
            disabled={primaryDisabled}
            aria-label={primaryLabel}
            onClick={handlePrimaryAction}
          >
            {showStop ? (
              <SquareIcon className="size-3.5 fill-current" />
            ) : (
              <ArrowUpIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {goalError && !isPaused ? (
        <p role="alert" className="mt-2 font-mono text-xs text-[var(--sh-error)]">
          {goalError}
        </p>
      ) : null}
    </div>
  )
}
