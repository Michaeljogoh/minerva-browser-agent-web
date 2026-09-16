import type { Socket } from "socket.io-client"

import type { TaskResult, TaskType } from "@/lib/types/task-results"

import type { SessionRecord } from "@/lib/types/session-record"

export type AgentStatus =
  | "idle"
  | "connecting"
  | "running"
  | "paused"
  | "approval_pending"
  | "complete"
  | "error"

export function isSessionActive(status: AgentStatus): boolean {
  return (
    status === "connecting" ||
    status === "running" ||
    status === "paused" ||
    status === "approval_pending"
  )
}

export function isGoalEditable(status: AgentStatus): boolean {
  return status === "idle" || status === "complete" || status === "error"
}

export type ReasoningStepType =
  | "reasoning"
  | "action"
  | "observation"
  | "error"
  | "screenshot"
  | "approval"

export interface ReasoningStep {
  id: string
  timestamp: number
  type: ReasoningStepType
  content: string
  tool?: string
  args?: Record<string, unknown>
  result?: unknown
  screenshotUrl?: string
  metadata?: {
    confidence?: number
    retryCount?: number
    executionTimeMs?: number
  }
}

/** Pending ask_human — server TTL is 5 minutes (APPROVAL_TTL_MS). */
export interface ApprovalRequest {
  approvalId: string
  question: string
  context: string
  timestamp: number
  timeoutAt: number
}

export interface AgentError {
  message: string
  timestamp: number
  recoverable?: boolean
  fatal?: boolean
}

export const APPROVAL_TTL_MS = 5 * 60 * 1000

export const TAX_DELTA_DEFAULT_GOAL =
  "Check IRS.gov for new revenue procedures about Section 179 or bonus depreciation published in the last 30 days. Cross-reference against Lakeside Manufacturing's 2025 depreciation schedule and tell me if they're affected."

export type ViewMode = "live" | "screenshot"

export type ConnectionPhase =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"

export interface AgentStoreState {
  socket: Socket | null
  isConnected: boolean
  connectionPhase: ConnectionPhase
  sessionId: string | null
  liveUrl: string | null
  status: AgentStatus
  goal: string
  submittedGoal: string
  taskType?: TaskType
  currentStep: number
  reasoningSteps: ReasoningStep[]
  pendingApproval: ApprovalRequest | null
  latestScreenshotUrl: string | null
  viewMode: ViewMode
  result: TaskResult | null
  error: AgentError | null
  stepMode: boolean
  speed: number
  replayActive: boolean
  replayVisibleSteps: number
  /** Non-zero while a task run is active; cleared on stop to ignore stale socket events. */
  activeRunId: number
}

export interface AgentStoreActions {
  connect: () => void
  disconnect: () => void
  setGoal: (goal: string) => void
  setTaskType: (taskType: TaskType | undefined) => void
  startTask: () => void
  stopTask: () => void
  pauseTask: () => void
  resumeTask: () => void
  injectGuidance: (message: string) => void
  approveAction: (approved: boolean, answer?: string) => void
  handleServerEvent: (event: string, payload: unknown) => void
  setViewMode: (viewMode: ViewMode) => void
  setStepMode: (stepMode: boolean) => void
  setSpeed: (speed: number) => void
  startReplay: () => void
  stopReplay: () => void
  tickReplay: () => void
  loadSessionRecord: (record: SessionRecord) => void
  reset: () => void
}

export type AgentStore = AgentStoreState & AgentStoreActions
