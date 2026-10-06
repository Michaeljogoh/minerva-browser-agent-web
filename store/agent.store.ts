import { create } from "zustand"

import {
  APPROVAL_TTL_MS,
  isSessionActive,
  type AgentStore,
  type AgentStoreState,
  type ReasoningStep,
} from "@/lib/types/agent"
import {
  connectAgentSocket,
  disconnectAgentSocket,
} from "@/lib/socket"
import { agentErrorToastCopy, taskCompleteToastCopy } from "@/lib/toast-copy"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { startTaskModel } from "@/store/model-settings.store"
import {
  mergeTaskProgress,
  targetProgressForStepCount,
  TASK_PROGRESS,
} from "@/lib/task-progress"
import {
  parseAgentActionPayload,
  parseAgentErrorPayload,
  parseAgentObservationPayload,
  parseAgentReasoningPayload,
  parseBrowserReadyPayload,
  parseHumanApprovalRequiredPayload,
  parseLiveViewPayload,
  parseScreenshotPayload,
  parseTaskCompletePayload,
  parseTaskPausedPayload,
  parseTaskResumedPayload,
  parseTaskStoppedPayload,
  SERVER_INBOUND_EVENTS,
} from "@/lib/types/events"

/** Events ignored after stop (activeRunId === 0). task_stopped still clears state. */
const RUN_SESSION_EVENTS = new Set<string>(
  SERVER_INBOUND_EVENTS.filter((event) => event !== "task_stopped"),
)

export function stoppedSessionPatch(): Pick<
  AgentStoreState,
  | "activeRunId"
  | "status"
  | "pendingApproval"
  | "liveUrl"
  | "liveViewKey"
  | "liveViewDisconnected"
  | "sessionId"
  | "latestScreenshotUrl"
  | "currentStep"
  | "reasoningSteps"
  | "replayActive"
  | "replayVisibleSteps"
  | "taskProgress"
> {
  return {
    activeRunId: 0,
    status: "idle",
    taskProgress: 0,
    pendingApproval: null,
    liveUrl: null,
    liveViewKey: 0,
    liveViewDisconnected: false,
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
  state: {
    currentStep: number
    reasoningSteps: ReasoningStep[]
    taskProgress: number
  },
  step: Omit<ReasoningStep, "id">,
): Pick<AgentStore, "currentStep" | "reasoningSteps" | "taskProgress"> {
  const currentStep = state.currentStep + 1
  return {
    currentStep,
    reasoningSteps: appendStep(state.reasoningSteps, step),
    taskProgress: mergeTaskProgress(
      state.taskProgress,
      targetProgressForStepCount(currentStep),
    ),
  }
}

function latestScreenshotUrl(
  steps: ReasoningStep[],
  limit = steps.length,
): string | null {
  const end = Math.min(limit, steps.length)
  for (let i = end - 1; i >= 0; i -= 1) {
    const url = steps[i]?.screenshotUrl
    if (url) return url
  }
  return null
}

const initialState = {
  socket: null,
  isConnected: false,
  connectionPhase: "disconnected" as const,
  sessionId: null,
  liveUrl: null,
  liveViewKey: 0,
  liveViewDisconnected: false,
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
  taskProgress: 0,
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
    const { goal, taskType, socket, isConnected, activeRunId } = get()
    const trimmedGoal = goal.trim()
    if (!trimmedGoal) return
    if (!socket || !isConnected) return

    set({
      ...stoppedSessionPatch(),
      activeRunId: activeRunId + 1,
      submittedGoal: trimmedGoal,
      goal: "",
      status: "connecting",
      viewMode: "live",
      result: null,
      error: null,
      taskProgress: TASK_PROGRESS.START,
    })

    const model = startTaskModel()
    socket.emit("start_task", {
      goal: trimmedGoal,
      ...(taskType ? { taskType } : {}),
      ...(model ? { model } : {}),
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
      viewMode: "live",
    })
  },

  refreshLiveView: () => {
    const { socket, sessionId, status } = get()
    if (!socket?.connected || !sessionId) return
    if (!isSessionActive(status)) return
    socket.emit("refresh_live_view", {})
  },

  markLiveViewDisconnected: () => {
    if (get().liveViewDisconnected) return
    set({ liveViewDisconnected: true })
  },

  handleServerEvent: (event, payload) => {
    if (RUN_SESSION_EVENTS.has(event) && get().activeRunId === 0) {
      return
    }

    switch (event) {
      case "browser_ready": {
        const parsed = parseBrowserReadyPayload(payload)
        if (!parsed) return
        set((state) => ({
          liveUrl: parsed.liveUrl,
          sessionId: parsed.sessionId,
          status: "running" as const,
          viewMode: "live" as const,
          liveViewKey: state.liveViewKey + 1,
          liveViewDisconnected: false,
          taskProgress: mergeTaskProgress(
            state.taskProgress,
            TASK_PROGRESS.BROWSER_READY,
          ),
        }))
        return
      }

      case "live_view": {
        const parsed = parseLiveViewPayload(payload)
        if (!parsed) return
        set((state) => ({
          liveUrl: parsed.liveUrl,
          sessionId: parsed.sessionId,
          liveViewKey: state.liveViewKey + 1,
          liveViewDisconnected: false,
        }))
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
            content: `${parsed.tool} ${parsed.success ? "succeeded" : "failed"}`,
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
          kind: parsed.kind,
          connectUrl: parsed.connectUrl,
          appName: parsed.appName,
        }
        set((state) => ({
          pendingApproval: approval,
          status: "approval_pending",
          viewMode: parsed.kind === "login" ? ("live" as const) : state.viewMode,
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
        const toast = agentErrorToastCopy(parsed.error, {
          fatal: parsed.fatal,
          recoverable: parsed.recoverable,
        })
        gooeyToast.error(toast.title, { description: toast.description })
        set((state) => {
          const approvalRejected =
            parsed.error.includes("approvalId") ||
            parsed.error.includes("Unknown or expired approval")
          const clearApproval = parsed.fatal || approvalRejected
          return {
            error: agentError,
            status:
              parsed.fatal || state.status === "connecting"
                ? "error"
                : state.status,
            pendingApproval: clearApproval ? null : state.pendingApproval,
          }
        })
        return
      }

      case "task_complete": {
        const parsed = parseTaskCompletePayload(payload)
        if (!parsed) return
        const successToast = taskCompleteToastCopy(parsed.data)
        gooeyToast.success(successToast.title, {
          description: successToast.description,
        })
        set((state) => ({
          result: parsed.data,
          status: "complete",
          pendingApproval: null,
          taskType: parsed.data.taskType,
          viewMode: "screenshot",
          taskProgress: mergeTaskProgress(
            state.taskProgress,
            TASK_PROGRESS.DONE,
          ),
        }))
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
    const screenshot = latestScreenshotUrl(reasoningSteps, nextCount)

    set({
      replayVisibleSteps: nextCount,
      ...(screenshot ? { latestScreenshotUrl: screenshot } : {}),
    })
  },

  loadSessionRecord: (record) => {
    const screenshot = latestScreenshotUrl(record.steps)
    if (record.status === "error" && record.error) {
      const toast = agentErrorToastCopy(record.error, { fatal: true })
      gooeyToast.error(toast.title, { description: toast.description })
    }
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
      liveViewDisconnected: false,
      pendingApproval: null,
      replayActive: false,
      replayVisibleSteps: record.steps.length,
      viewMode: screenshot ? "screenshot" : "live",
      latestScreenshotUrl: screenshot,
      taskProgress:
        record.status === "complete"
          ? TASK_PROGRESS.DONE
          : mergeTaskProgress(0, targetProgressForStepCount(record.steps.length)),
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
