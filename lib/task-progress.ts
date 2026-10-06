import type { AgentStatus } from "@/lib/types/agent"

/** Progress milestones (0–100). Only moves forward during a run. */
export const TASK_PROGRESS = {
  START: 5,
  CONNECTING: 12,
  BROWSER_READY: 22,
  STEP_CAP: 90,
  DONE: 100,
} as const

export function mergeTaskProgress(current: number, target: number): number {
  const next = Math.max(current, target)
  return Math.min(TASK_PROGRESS.DONE, next)
}

/** Map step count to a smooth curve — early steps move the bar more. */
export function targetProgressForStepCount(stepCount: number): number {
  if (stepCount <= 0) {
    return TASK_PROGRESS.BROWSER_READY
  }
  const t = 1 - Math.exp(-stepCount / 14)
  const span = TASK_PROGRESS.STEP_CAP - TASK_PROGRESS.BROWSER_READY
  return TASK_PROGRESS.BROWSER_READY + t * span
}

export function targetProgressForStatus(
  status: AgentStatus,
  stepCount: number,
): number {
  switch (status) {
    case "idle":
      return 0
    case "connecting":
      return TASK_PROGRESS.CONNECTING
    case "complete":
      return TASK_PROGRESS.DONE
    case "running":
    case "paused":
    case "approval_pending":
      return targetProgressForStepCount(stepCount)
    case "error":
      return targetProgressForStepCount(stepCount)
    default:
      return targetProgressForStepCount(stepCount)
  }
}

export function taskProgressLabel(
  status: AgentStatus,
  percent: number,
): string {
  switch (status) {
    case "connecting":
      return "Starting browser session"
    case "running":
      return `Job in progress, ${Math.round(percent)}%`
    case "paused":
      return `Paused at ${Math.round(percent)}%`
    case "approval_pending":
      return `Waiting on you, ${Math.round(percent)}%`
    case "complete":
      return "Job complete"
    case "error":
      return `Stopped at ${Math.round(percent)}%`
    default:
      return "Job progress"
  }
}

export function showTaskProgressBar(status: AgentStatus): boolean {
  return (
    status === "connecting" ||
    status === "running" ||
    status === "paused" ||
    status === "approval_pending" ||
    status === "complete" ||
    status === "error"
  )
}
