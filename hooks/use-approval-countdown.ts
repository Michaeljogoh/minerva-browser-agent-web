"use client"

import { useEffect, useState } from "react"

export function useApprovalCountdown(timeoutAt: number | null): number {
  const [remainingMs, setRemainingMs] = useState(0)

  useEffect(() => {
    if (timeoutAt == null) {
      setRemainingMs(0)
      return
    }

    const tick = () => {
      setRemainingMs(Math.max(0, timeoutAt - Date.now()))
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [timeoutAt])

  return remainingMs
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
