import { io, type Socket } from "socket.io-client"

import { getGatewayApiKey } from "@/lib/gateway-auth"
import { isSessionActive, type ConnectionPhase } from "@/lib/types/agent"
import { SERVER_INBOUND_EVENTS } from "@/lib/types/events"
import { agentErrorToastCopy, connectionErrorToastCopy } from "@/lib/toast-copy"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { stoppedSessionPatch, useAgentStore } from "@/store/agent.store"

const MAX_RECONNECT_DELAY_MS = 30_000

let socket: Socket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempt = 0
let intentionalDisconnect = false
/** One toast per outage; the connection banner covers the ongoing retry state. */
let outageToastShown = false

export function getBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set")
  }
  return url
}

function clearReconnectTimer(): void {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

function patchConnectionState(
  patch: Partial<{
    socket: Socket | null
    isConnected: boolean
    connectionPhase: ConnectionPhase
  }>,
): void {
  useAgentStore.setState(patch)
}

function scheduleReconnect(): void {
  if (intentionalDisconnect || reconnectTimer !== null || !socket) {
    return
  }

  const delay = Math.min(
    1000 * 2 ** reconnectAttempt,
    MAX_RECONNECT_DELAY_MS,
  )
  reconnectAttempt += 1

  patchConnectionState({
    isConnected: false,
    connectionPhase: "reconnecting",
  })

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (!intentionalDisconnect && socket && !socket.connected) {
      socket.connect()
    }
  }, delay)
}

function attachInboundListeners(activeSocket: Socket): void {
  const handleServerEvent = useAgentStore.getState().handleServerEvent

  for (const event of SERVER_INBOUND_EVENTS) {
    activeSocket.on(event, (payload: unknown) => {
      handleServerEvent(event, payload)
    })
  }
}

function bindLifecycleListeners(activeSocket: Socket): void {
  activeSocket.on("connect", () => {
    reconnectAttempt = 0
    outageToastShown = false
    clearReconnectTimer()
    patchConnectionState({
      socket: activeSocket,
      isConnected: true,
      connectionPhase: "connected",
    })
  })

  activeSocket.on("disconnect", () => {
    if (intentionalDisconnect) {
      patchConnectionState({
        isConnected: false,
        connectionPhase: "disconnected",
      })
      return
    }

    const { status, pendingApproval } = useAgentStore.getState()
    if (isSessionActive(status)) {
      const message =
        "Connection lost. The running task was stopped on the server. Start a new task to continue."
      const toast = agentErrorToastCopy(message, { fatal: true })
      gooeyToast.error(toast.title, { description: toast.description })
      outageToastShown = true
      useAgentStore.setState({
        ...stoppedSessionPatch(),
        error: {
          message,
          timestamp: Date.now(),
          recoverable: true,
        },
      })
    } else if (pendingApproval) {
      useAgentStore.setState({ pendingApproval: null })
    }

    scheduleReconnect()
  })

  activeSocket.on("connect_error", (err: Error) => {
    const message = err.message || "Could not connect to the server"
    if (!outageToastShown) {
      outageToastShown = true
      const toast = connectionErrorToastCopy()
      gooeyToast.error(toast.title, { description: toast.description })
    }
    useAgentStore.setState({
      isConnected: false,
      error: {
        message,
        timestamp: Date.now(),
        recoverable: true,
      },
    })

    if (!intentionalDisconnect) {
      scheduleReconnect()
    }
  })
}

export function connectAgentSocket(): Socket {
  if (typeof window === "undefined") {
    throw new Error("connectAgentSocket must run in the browser")
  }

  intentionalDisconnect = false
  clearReconnectTimer()

  if (socket?.connected) {
    patchConnectionState({
      socket,
      isConnected: true,
      connectionPhase: "connected",
    })
    return socket
  }

  if (!socket) {
    const authToken = getGatewayApiKey()
    socket = io(getBackendUrl(), {
      autoConnect: false,
      reconnection: false,
      transports: ["websocket", "polling"],
      ...(authToken
        ? {
            auth: { token: authToken },
            extraHeaders: { "x-api-key": authToken },
          }
        : {}),
    })

    attachInboundListeners(socket)
    bindLifecycleListeners(socket)
  }

  patchConnectionState({
    socket,
    isConnected: false,
    connectionPhase: "connecting",
  })

  socket.connect()
  return socket
}

export function disconnectAgentSocket(): void {
  intentionalDisconnect = true
  clearReconnectTimer()
  reconnectAttempt = 0
  outageToastShown = false

  socket?.removeAllListeners()
  socket?.disconnect()
  socket = null

  patchConnectionState({
    socket: null,
    isConnected: false,
    connectionPhase: "disconnected",
  })
}
