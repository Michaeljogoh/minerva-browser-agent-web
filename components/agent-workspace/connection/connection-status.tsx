"use client"

import type { ConnectionPhase } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

type ConnectionStatusProps = {
  className?: string
}

const labels: Record<ConnectionPhase, string> = {
  disconnected: "Disconnected",
  connecting: "Connecting…",
  connected: "Connected",
  reconnecting: "Reconnecting…",
}

function connectionDotClass(phase: ConnectionPhase): string {
  switch (phase) {
    case "connected":
      return "bg-sh-accent-green"
    case "connecting":
    case "reconnecting":
      return "bg-[var(--sh-warning)] motion-safe:animate-pulse"
    default:
      return "bg-sh-text-muted"
  }
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const connectionPhase = useAgentStore((state) => state.connectionPhase)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-sh-border bg-sh-surface px-2.5 py-1 font-mono text-xs text-sh-text-muted",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", connectionDotClass(connectionPhase))} />
      {labels[connectionPhase]}
    </span>
  )
}
