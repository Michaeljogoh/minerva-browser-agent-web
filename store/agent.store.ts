import { create } from "zustand"

import {
  APPROVAL_TTL_MS,
  type AgentStore,
  type ReasoningStep,
} from "@/lib/types/agent"
import {
  connectAgentSocket,
  disconnectAgentSocket,
} from "@/lib/socket"
import type { AgentStoreState } from "@/lib/types/agent"
import {
  parseAgentActionPayload,
  parseAgentErrorPayload,
  parseAgentObservationPayload,
  parseAgentReasoningPayload,
  parseBrowserReadyPayload,
  parseHumanApprovalRequiredPayload,
  parseScreenshotPayload,
  parseTaskCompletePayload,
  parseTaskPausedPayload,
  parseTaskResumedPayload,
  parseTaskStoppedPayload,
} from "@/lib/types/events"

const RUN_SESSION_EVENTS = new Set([
  "browser_ready",
  "agent_reasoning",
  "agent_action",
  "agent_observation",
  "screenshot",
  "human_approval_required",
  "task_paused",
  "task_resumed",
  "agent_error",
  "task_complete",
])

function stoppedSessionPatch(): Pick<
  AgentStoreState,
  | "activeRunId"
  | "status"
  | "pendingApproval"
  | "liveUrl"
  | "sessionId"
  | "latestScreenshotUrl"
  | "currentStep"
  | "reasoningSteps"
  | "replayActive"
  | "replayVisibleSteps"
> {
  return {
    activeRunId: 0,
    status: "idle",
    pendingApproval: null,
    liveUrl: null,
    sessionId: null,
    latestScreenshotUrl: null,
    currentStep: 0,
    reasoningSteps: [],
    replayActive: false,
    replayVisibleSteps: 0,
  }
}

function createStepId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function appendStep(
  steps: ReasoningStep[],
  step: Omit<ReasoningStep, "id">,
): ReasoningStep[] {
  return [...steps, { ...step, id: createStepId() }]
}

function withAppendedStep(
  state: { currentStep: number; reasoningSteps: ReasoningStep[] },
  step: Omit<ReasoningStep, "id">,
): Pick<AgentStore, "currentStep" | "reasoningSteps"> {
  return {
    currentStep: state.currentStep + 1,
    reasoningSteps: appendStep(state.reasoningSteps, step),
  }
}

const initialState = {
  socket: null,
  isConnected: false,
  connectionPhase: "disconnected" as const,
  sessionId: null,
  liveUrl: null,
  status: "idle" as const,
  goal: "",
  submittedGoal: "",
  taskType: undefined,
  currentStep: 0,
  reasoningSteps: [] as ReasoningStep[],
  pendingApproval: null,
  latestScreenshotUrl: null,
  viewMode: "live" as const,
  result: null,
  error: null,
  stepMode: false,
  speed: 1,
  replayActive: false,
  replayVisibleSteps: 0,
  activeRunId: 0,
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  ...initialState,

  connect: () => {
    connectAgentSocket()
  },

  disconnect: () => {
    disconnectAgentSocket()
    set({ status: "idle" })
  },

  setGoal: (goal) => set({ goal }),

  setTaskType: (taskType) => set({ taskType }),

  startTask: () => {
    const { goal, taskType, socket, isConnected } = get()
    const trimmedGoal = goal.trim()
    if (!trimmedGoal) return
    if (!socket || !isConnected) return

    set({
      activeRunId: get().activeRunId + 1,
      submittedGoal: trimmedGoal,
      goal: "",
      status: "connecting",
      sessionId: null,
      liveUrl: null,
      currentStep: 0,
      reasoningSteps: [],
      pendingApproval: null,
      latestScreenshotUrl: null,
      viewMode: "live",
      result: null,
      error: null,
      replayActive: false,
      replayVisibleSteps: 0,
    })

    socket.emit("start_task", {
      goal: trimmedGoal,
      ...(taskType ? { taskType } : {}),
    })
  },

  stopTask: () => {
    const { socket, activeRunId, status } = get()
    if (activeRunId === 0 && status === "idle") {
      return
    }

    set(stoppedSessionPatch())

    if (socket?.connected) {
      socket.emit("stop_task", {})
    }
  },

  pauseTask: () => {
    const { socket, status } = get()
    if (!socket?.connected) return
    if (status !== "running" && status !== "approval_pending") return
    socket.emit("pause_task", {})
  },

  resumeTask: () => {
    const { socket, status } = get()
    if (!socket?.connected) return
    if (status !== "paused") return
    socket.emit("resume_task", {})
  },

  injectGuidance: (message) => {
    const { socket } = get()
    if (!socket?.connected || !message.trim()) return
    socket.emit("inject_guidance", { message: message.trim() })
  },

  approveAction: (approved, answer) => {
    const { socket, pendingApproval } = get()
    if (!socket?.connected || !pendingApproval) return

    socket.emit("approve_action", {
      approvalId: pendingApproval.approvalId,
      approved,
      ...(answer !== undefined ? { answer } : {}),
    })

    set({
      pendingApproval: null,
      status: "running",
    })
  },

  handleServerEvent: (event, payload) => {
    if (RUN_SESSION_EVENTS.has(event) && get().activeRunId === 0) {
      return
    }

    switch (event) {
      case "browser_ready": {
        const parsed = parseBrowserReadyPayload(payload)
        if (!parsed) return
        set({
          liveUrl: parsed.liveUrl,
          sessionId: parsed.sessionId,
          status: "running",
          viewMode: "live",
        })
        return
      }

      case "agent_reasoning": {
        const parsed = parseAgentReasoningPayload(payload)
        if (!parsed) return
        set((state) =>
          withAppendedStep(state, {
            timestamp: parsed.timestamp,
            type: "reasoning",
            content: parsed.thought,
          }),
        )
        return
      }

      case "agent_action": {
        const parsed = parseAgentActionPayload(payload)
        if (!parsed) return
        set((state) =>
          withAppendedStep(state, {
            timestamp: parsed.timestamp,
            type: "action",
            content: parsed.reasoning || parsed.tool,
            tool: parsed.tool,
            args: parsed.args,
          }),
        )
        return
      }

      case "agent_observation": {
        const parsed = parseAgentObservationPayload(payload)
        if (!parsed) return
        set((state) =>
          withAppendedStep(state, {
            timestamp: parsed.timestamp,
            type: "observation",
            content: parsed.success
              ? `${parsed.tool} succeeded`
              : `${parsed.tool} failed`,
            tool: parsed.tool,
            result: parsed.result,
            metadata: { confidence: parsed.success ? 1 : 0 },
          }),
        )
        const { stepMode, status } = get()
        if (parsed.success && stepMode && status === "running") {
          get().pauseTask()
        }
        return
      }

      case "screenshot": {
        const parsed = parseScreenshotPayload(payload)
        if (!parsed) return
        set((state) => ({
          latestScreenshotUrl: parsed.url,
          ...withAppendedStep(state, {
            timestamp: parsed.timestamp,
            type: "screenshot",
            content: "Page screenshot captured",
            screenshotUrl: parsed.url,
          }),
        }))
        return
      }

      case "human_approval_required": {
        const parsed = parseHumanApprovalRequiredPayload(payload)
        if (!parsed) return
        const timestamp = Date.now()
        const approval = {
          approvalId: parsed.approvalId,
          question: parsed.question,
          context: parsed.context,
          timestamp,
          timeoutAt: timestamp + APPROVAL_TTL_MS,
        }
        set((state) => ({
          pendingApproval: approval,
          status: "approval_pending",
          ...withAppendedStep(state, {
            timestamp,
            type: "approval",
            content: parsed.question,
          }),
        }))
        return
      }

      case "task_paused": {
        const parsed = parseTaskPausedPayload(payload)
        if (!parsed) return
        set({ status: "paused" })
        return
      }

      case "task_resumed": {
        const parsed = parseTaskResumedPayload(payload)
        if (!parsed) return
        set({ status: "running" })
        return
      }

      case "agent_error": {
        const parsed = parseAgentErrorPayload(payload)
        if (!parsed) return
        const agentError = {
          message: parsed.error,
          timestamp: parsed.timestamp,
          recoverable: parsed.recoverable,
          fatal: parsed.fatal,
        }
        set((state) => {
          const approvalRejected =
            parsed.error.includes("approvalId") ||
            parsed.error.includes("Unknown or expired approval")
          return {
            error: agentError,
            status: parsed.fatal ? "error" : state.status,
            pendingApproval:
              parsed.fatal || approvalRejected ? null : state.pendingApproval,
            ...withAppendedStep(state, {
              timestamp: parsed.timestamp,
              type: "error",
              content: parsed.error,
            }),
          }
        })
        return
      }

      case "task_complete": {
        const parsed = parseTaskCompletePayload(payload)
        if (!parsed) return
        set({
          result: parsed.data,
          status: "complete",
          pendingApproval: null,
          taskType: parsed.data.taskType,
        })
        return
      }

      case "task_stopped": {
        const parsed = parseTaskStoppedPayload(payload)
        if (!parsed) return
        set(stoppedSessionPatch())
        return
      }

      default:
        return
    }
  },

  setViewMode: (viewMode) => set({ viewMode }),

  setStepMode: (stepMode) => set({ stepMode }),

  setSpeed: (speed) => set({ speed }),

  startReplay: () => {
    const { reasoningSteps } = get()
    if (reasoningSteps.length === 0) {
      return
    }
    set({ replayActive: true, replayVisibleSteps: 0 })
  },

  stopReplay: () => {
    const { reasoningSteps } = get()
    set({
      replayActive: false,
      replayVisibleSteps: reasoningSteps.length,
    })
  },

  tickReplay: () => {
    const { replayVisibleSteps, reasoningSteps } = get()
    if (replayVisibleSteps >= reasoningSteps.length) {
      get().stopReplay()
      return
    }
    const nextCount = replayVisibleSteps + 1
    const latestScreenshot = [...reasoningSteps]
      .slice(0, nextCount)
      .reverse()
      .find((step) => step.screenshotUrl)?.screenshotUrl

    set({
      replayVisibleSteps: nextCount,
      ...(latestScreenshot ? { latestScreenshotUrl: latestScreenshot } : {}),
    })
  },

  loadSessionRecord: (record) => {
    set({
      activeRunId: 0,
      goal: "",
      submittedGoal: record.goal,
      taskType: record.taskType ?? undefined,
      reasoningSteps: record.steps,
      currentStep: record.steps.length,
      result: record.result,
      status: record.status === "complete" ? "complete" : "error",
      error: record.error
        ? {
            message: record.error,
            timestamp: Date.now(),
            recoverable: false,
            fatal: record.status === "error",
          }
        : null,
      liveUrl: null,
      sessionId: null,
      pendingApproval: null,
      replayActive: false,
      replayVisibleSteps: record.steps.length,
      viewMode: record.steps.some((step) => step.screenshotUrl)
        ? "screenshot"
        : "live",
      latestScreenshotUrl:
        [...record.steps].reverse().find((step) => step.screenshotUrl)
          ?.screenshotUrl ?? null,
    })
  },

  reset: () =>
    set({
      ...initialState,
      socket: get().socket,
      isConnected: get().isConnected,
      connectionPhase: get().connectionPhase,
    }),
}))
