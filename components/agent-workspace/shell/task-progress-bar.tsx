"use client"

import * as React from "react"

import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import {
  showTaskProgressBar,
  TASK_PROGRESS,
  taskProgressLabel,
} from "@/lib/task-progress"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

/** Slow creep while the browser session opens; holds when paused or waiting. */
function useDisplayedProgress(stored: number, status: string): number {
  const [display, setDisplay] = React.useState(stored)

  React.useEffect(() => {
    setDisplay((prev) => Math.max(prev, stored))
  }, [stored])

  React.useEffect(() => {
    if (status !== "connecting") {
      return
    }
    const id = window.setInterval(() => {
      setDisplay((prev) => {
        const floor = Math.max(prev, stored)
        if (floor >= TASK_PROGRESS.BROWSER_READY - 1) {
          return floor
        }
        return Math.min(TASK_PROGRESS.BROWSER_READY - 1, floor + 0.35)
      })
    }, 450)
    return () => window.clearInterval(id)
  }, [status, stored])

  React.useEffect(() => {
    if (status === "idle") {
      setDisplay(0)
    }
  }, [status])

  return Math.round(display * 10) / 10
}

export function TaskProgressBar() {
  const status = useAgentStore((s) => s.status)
  const taskProgress = useAgentStore((s) => s.taskProgress)
  const value = useDisplayedProgress(taskProgress, status)

  if (!showTaskProgressBar(status)) {
    return null
  }

  const label = taskProgressLabel(status, value)

  const indicatorClass =
    status === "complete"
      ? "bg-sh-accent-green"
      : status === "error"
        ? "bg-sh-error"
        : status === "paused" || status === "approval_pending"
          ? "bg-sh-warning"
          : "bg-gradient-to-r from-sh-accent-green to-emerald-400"

  return (
    <div
      className="shrink-0 border-b bg-sh-bg"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={label}
    >
      <Progress value={value} className="gap-0">
        <ProgressTrack
          className={cn(
            "h-1.5 rounded-none bg-sh-border",
            (status === "paused" || status === "approval_pending") &&
              "opacity-90",
          )}
        >
          <ProgressIndicator
            className={cn(
              "rounded-none transition-[width,background-color] duration-700 ease-out",
              indicatorClass,
              (status === "running" || status === "connecting") &&
                "motion-sheen",
            )}
          />
        </ProgressTrack>
      </Progress>
      <p className="sr-only">{label}</p>
    </div>
  )
}
