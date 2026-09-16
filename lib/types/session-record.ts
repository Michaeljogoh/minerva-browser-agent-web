import type { ReasoningStep } from "@/lib/types/agent"
import type { TaskResult, TaskType } from "@/lib/types/task-results"

export type SessionRecordStatus = "complete" | "stopped" | "error" | "running"

export type SessionRecordSummary = {
  id: string
  goal: string
  taskType: TaskType | null
  status: SessionRecordStatus
  startedAt: string
  endedAt: string | null
  error: string | null
  createdAt: string
}

export type SessionRecord = SessionRecordSummary & {
  steps: ReasoningStep[]
  result: TaskResult | null
}
