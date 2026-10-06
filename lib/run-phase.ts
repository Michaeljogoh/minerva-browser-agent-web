import type { AgentStatus, ReasoningStep } from "@/lib/types/agent"

export type RunPhaseId = "starting" | "working" | "review" | "done"

export interface RunPhase {
  id: RunPhaseId
  label: string
}

const STARTING: RunPhase = { id: "starting", label: "Starting" }
const WORKING: RunPhase = { id: "working", label: "Working" }
const REVIEW: RunPhase = { id: "review", label: "Needs you" }
const DONE: RunPhase = { id: "done", label: "Done" }

/** The review phase only shows when the run has asked for a human at some point. */
export function runPhases(steps: ReasoningStep[], status: AgentStatus): RunPhase[] {
  const asked =
    status === "approval_pending" || steps.some((s) => s.type === "approval")
  return asked ? [STARTING, WORKING, REVIEW, DONE] : [STARTING, WORKING, DONE]
}

export function activePhaseId(status: AgentStatus): RunPhaseId {
  switch (status) {
    case "connecting":
      return "starting"
    case "approval_pending":
      return "review"
    case "complete":
      return "done"
    default:
      return "working"
  }
}

export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}
