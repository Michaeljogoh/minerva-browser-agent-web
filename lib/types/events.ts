import type { TaskResult, TaskType } from "@/lib/types/task-results"

/** Client → server (api/docs/backend-prd.md §12) */

export interface StartTaskPayload {
  goal: string
  taskType?: TaskType
  usePlanner?: boolean
}

export interface ApproveActionPayload {
  approvalId: string
  approved: boolean
  answer?: string
}

export interface InjectGuidancePayload {
  message: string
}

export type ClientOutboundEvent =
  | { event: "start_task"; payload: StartTaskPayload }
  | { event: "stop_task"; payload: Record<string, never> }
  | { event: "pause_task"; payload: Record<string, never> }
  | { event: "resume_task"; payload: Record<string, never> }
  | { event: "inject_guidance"; payload: InjectGuidancePayload }
  | { event: "approve_action"; payload: ApproveActionPayload }

/** Server → client */

export interface BrowserReadyPayload {
  liveUrl: string
  sessionId: string
}

export interface AgentReasoningPayload {
  timestamp: number
  thought: string
}

export interface AgentActionPayload {
  timestamp: number
  tool: string
  args: Record<string, unknown>
  reasoning: string
}

export interface AgentObservationPayload {
  timestamp: number
  tool: string
  result: unknown
  success: boolean
}

export interface ScreenshotPayload {
  url: string
  timestamp: number
}

export interface HumanApprovalRequiredPayload {
  approvalId: string
  question: string
  context: string
}

export interface AgentErrorPayload {
  timestamp: number
  error: string
  recoverable?: boolean
  fatal?: boolean
}

export interface TaskCompletePayload {
  timestamp: number
  summary: string
  /** Full TaskResult from the done tool (see stagehand.tools.ts). */
  data: TaskResult
}

export interface TaskPausedPayload {
  timestamp: number
}

export interface TaskResumedPayload {
  timestamp: number
}

export interface TaskStoppedPayload {
  timestamp: number
}

export type ServerInboundEventName =
  | "browser_ready"
  | "agent_reasoning"
  | "agent_action"
  | "agent_observation"
  | "screenshot"
  | "human_approval_required"
  | "agent_error"
  | "task_complete"
  | "task_paused"
  | "task_resumed"
  | "task_stopped"

/** All server → client events (backend-prd.md §12). */
export const SERVER_INBOUND_EVENTS = [
  "browser_ready",
  "agent_reasoning",
  "agent_action",
  "agent_observation",
  "screenshot",
  "human_approval_required",
  "agent_error",
  "task_complete",
  "task_paused",
  "task_resumed",
  "task_stopped",
] as const satisfies readonly ServerInboundEventName[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object"
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function parseBrowserReadyPayload(
  payload: unknown,
): BrowserReadyPayload | null {
  if (!isRecord(payload)) return null
  if (!isString(payload.liveUrl) || !isString(payload.sessionId)) return null
  return { liveUrl: payload.liveUrl, sessionId: payload.sessionId }
}

export function parseAgentReasoningPayload(
  payload: unknown,
): AgentReasoningPayload | null {
  if (!isRecord(payload)) return null
  if (!isNumber(payload.timestamp) || !isString(payload.thought)) return null
  return { timestamp: payload.timestamp, thought: payload.thought }
}

export function parseAgentActionPayload(
  payload: unknown,
): AgentActionPayload | null {
  if (!isRecord(payload)) return null
  if (
    !isNumber(payload.timestamp) ||
    !isString(payload.tool) ||
    !isRecord(payload.args) ||
    !isString(payload.reasoning)
  ) {
    return null
  }
  return {
    timestamp: payload.timestamp,
    tool: payload.tool,
    args: payload.args,
    reasoning: payload.reasoning,
  }
}

export function parseAgentObservationPayload(
  payload: unknown,
): AgentObservationPayload | null {
  if (!isRecord(payload)) return null
  if (
    !isNumber(payload.timestamp) ||
    !isString(payload.tool) ||
    typeof payload.success !== "boolean"
  ) {
    return null
  }
  return {
    timestamp: payload.timestamp,
    tool: payload.tool,
    result: payload.result,
    success: payload.success,
  }
}

export function parseScreenshotPayload(
  payload: unknown,
): ScreenshotPayload | null {
  if (!isRecord(payload)) return null
  if (!isString(payload.url) || !isNumber(payload.timestamp)) return null
  return { url: payload.url, timestamp: payload.timestamp }
}

export function parseHumanApprovalRequiredPayload(
  payload: unknown,
): HumanApprovalRequiredPayload | null {
  if (!isRecord(payload)) return null
  if (
    !isString(payload.approvalId) ||
    !isString(payload.question) ||
    !isString(payload.context)
  ) {
    return null
  }
  return {
    approvalId: payload.approvalId,
    question: payload.question,
    context: payload.context,
  }
}

export function parseAgentErrorPayload(
  payload: unknown,
): AgentErrorPayload | null {
  if (!isRecord(payload)) return null
  if (!isNumber(payload.timestamp) || !isString(payload.error)) return null
  return {
    timestamp: payload.timestamp,
    error: payload.error,
    recoverable:
      typeof payload.recoverable === "boolean" ? payload.recoverable : undefined,
    fatal: typeof payload.fatal === "boolean" ? payload.fatal : undefined,
  }
}

export function parseTaskCompletePayload(
  payload: unknown,
): TaskCompletePayload | null {
  if (!isRecord(payload)) return null
  if (
    !isNumber(payload.timestamp) ||
    !isString(payload.summary) ||
    !isRecord(payload.data)
  ) {
    return null
  }
  const data = payload.data
  if (
    !isString(data.taskType) ||
    !isString(data.summary) ||
    !isRecord(data.extractedData) ||
    !isNumber(data.completedAt) ||
    !isNumber(data.totalSteps) ||
    !isNumber(data.totalExecutionTimeMs)
  ) {
    return null
  }
  return {
    timestamp: payload.timestamp,
    summary: payload.summary,
    data: data as unknown as TaskResult,
  }
}

function parseTimestampPayload(
  payload: unknown,
): { timestamp: number } | null {
  if (!isRecord(payload)) return null
  if (!isNumber(payload.timestamp)) return null
  return { timestamp: payload.timestamp }
}

export function parseTaskPausedPayload(
  payload: unknown,
): TaskPausedPayload | null {
  return parseTimestampPayload(payload)
}

export function parseTaskResumedPayload(
  payload: unknown,
): TaskResumedPayload | null {
  return parseTimestampPayload(payload)
}

export function parseTaskStoppedPayload(
  payload: unknown,
): TaskStoppedPayload | null {
  return parseTimestampPayload(payload)
}
