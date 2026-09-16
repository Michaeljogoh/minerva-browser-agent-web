"use client"

import * as React from "react"

import { useAgentStore } from "@/store/agent.store"

const BASE_STEP_MS = 900

export function useSessionReplay() {
  const replayActive = useAgentStore((s) => s.replayActive)
  const speed = useAgentStore((s) => s.speed)
  const tickReplay = useAgentStore((s) => s.tickReplay)

  React.useEffect(() => {
    if (!replayActive) {
      return
    }

    const delay = Math.max(120, BASE_STEP_MS / speed)
    const timer = window.setInterval(() => {
      tickReplay()
    }, delay)

    return () => window.clearInterval(timer)
  }, [replayActive, speed, tickReplay])
}
