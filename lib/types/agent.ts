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

/** Connecting, running, or awaiting approval — stop is available. */
export function isTaskBusy(status: AgentStatus): boolean {
  return (
    status === "connecting" ||
    status === "running" ||
    status === "approval_pending"
  )
}

export function isGoalEditable(status: AgentStatus): boolean {
  return status === "idle" || status === "complete" || status === "error"
}

export function isLiveBrowserInteractive(
  status: AgentStatus,
  pendingApproval: ApprovalRequest | null,
): boolean {
  return status === "approval_pending" && pendingApproval?.kind === "login"
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

export type ApprovalKind = "approval" | "login" | "connect" | "connect_input"

/** Pending ask_human — server TTL is 5 minutes (APPROVAL_TTL_MS). */
export interface ApprovalRequest {
  approvalId: string
  question: string
  context: string
  timestamp: number
  timeoutAt: number
  kind?: ApprovalKind
  connectUrl?: string
  appName?: string
  /** connect_input: label and hint for the value the user types. */
  inputLabel?: string
  inputPlaceholder?: string
}

export interface AgentError {
  message: string
  timestamp: number
  recoverable?: boolean
  fatal?: boolean
}

export const APPROVAL_TTL_MS = 5 * 60 * 1000

export const TAX_DELTA_DEFAULT_GOAL =
  "Research https://www.irs.gov for new revenue procedures about Section 179 or bonus depreciation from the last 30 days. Also check California https://www.cdtfa.ca.gov and New York https://www.tax.ny.gov, plus Shopify tax docs at https://help.shopify.com. Tell me if a California/New York Shopify seller like Lakeside Manufacturing would be affected."

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
  /** Bumps on every live URL event so the iframe remounts even if the src is unchanged. */
  liveViewKey: number
  liveViewDisconnected: boolean
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
  /** Monotonic 0–100 job progress; holds when paused or waiting on approval. */
  taskProgress: number
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
  refreshLiveView: () => void
  markLiveViewDisconnected: () => void
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
