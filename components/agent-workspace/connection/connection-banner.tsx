"use client"

import { isSessionActive } from "@/lib/types/agent"
import { Spinner } from "@/components/ui/spinner"
import { useAgentStore } from "@/store/agent.store"

export function ConnectionBanner() {
  const connectionPhase = useAgentStore((s) => s.connectionPhase)
  const status = useAgentStore((s) => s.status)
  const currentStep = useAgentStore((s) => s.currentStep)

  const showReconnecting = connectionPhase === "reconnecting"
  const showDisconnected =
    connectionPhase === "disconnected" &&
    (isSessionActive(status) || currentStep > 0)

  if (!showReconnecting && !showDisconnected) {
    return null
  }

  return (
    <div
      role="status"
      className="flex shrink-0 items-center gap-2 border-b border-[var(--sh-warning)] bg-sh-surface px-3 py-1.5"
    >
      {showReconnecting ? <Spinner className="size-3 text-[var(--sh-warning)]" /> : null}
      <p className="font-mono text-xs text-sh-text">
        {showReconnecting
          ? "Connection lost — reconnecting to the agent server…"
          : "Disconnected from the agent server. Timeline is read-only until reconnected."}
      </p>
      {currentStep > 0 ? (
        <span className="ml-auto font-mono text-[10px] text-sh-text-muted">
          {currentStep} steps preserved
        </span>
      ) : null}
    </div>
  )
}
