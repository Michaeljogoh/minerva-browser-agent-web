"use client"

import * as React from "react"

import { isSessionActive, type AgentStatus } from "@/lib/types/agent"

/** Elapsed ms for the current run; freezes when the run ends. */
export function useRunClock(status: AgentStatus, finalMs?: number | null): number {
  const startRef = React.useRef<number | null>(null)
  const [elapsed, setElapsed] = React.useState(0)
  const active = isSessionActive(status)

  React.useEffect(() => {
    if (status === "idle") {
      startRef.current = null
      setElapsed(0)
      return
    }
    if (!active) {
      return
    }
    if (startRef.current == null) {
      startRef.current = Date.now()
    }
    const tick = () => setElapsed(Date.now() - (startRef.current ?? Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [status, active])

  return !active && finalMs != null ? finalMs : elapsed
}
