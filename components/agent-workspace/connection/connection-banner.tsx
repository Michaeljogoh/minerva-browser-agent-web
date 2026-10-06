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
      className="flex shrink-0 items-center gap-2 border-b border-sh-warning/40 bg-sh-warning-fill px-4 py-2"
    >
      {showReconnecting ? <Spinner className="size-3.5 text-sh-warning" /> : null}
      <p className="font-sans text-[13px] text-sh-text">
        {showReconnecting
          ? "Connection lost. Reconnecting…"
          : "Disconnected. You can still read the timeline until we’re back."}
      </p>
      {currentStep > 0 ? (
        <span className="ml-auto font-sans text-[12px] text-sh-text-muted">
          {currentStep} moves kept
        </span>
      ) : null}
    </div>
  )
}
