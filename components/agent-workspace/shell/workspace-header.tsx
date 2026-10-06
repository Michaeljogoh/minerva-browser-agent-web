"use client"

import { BrandLogo } from "@/components/agent-workspace/shell/brand-logo"
import { humanStatusLabel, statusChipClass } from "@/lib/status-copy"
import { SessionControls } from "@/components/agent-workspace/shell/session-controls"
import { ConnectionStatus } from "@/components/agent-workspace/connection/connection-status"
import { ThemeToggle } from "@/components/agent-workspace/shell/theme-toggle"
import { TaskRailTrigger } from "@/components/agent-workspace/sidebar/task-rail-trigger"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

type WorkspaceHeaderProps = {
  taskRailOpen: boolean
  onTaskRailToggle: () => void
}

export function WorkspaceHeader({
  taskRailOpen,
  onTaskRailToggle,
}: WorkspaceHeaderProps) {
  const status = useAgentStore((s) => s.status)
  const pendingApproval = useAgentStore((s) => s.pendingApproval)
  const statusLabel = humanStatusLabel(status, pendingApproval)
  const showStatusChip =
    status !== "running" &&
    status !== "idle" &&
    status !== "error" &&
    status !== "complete"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-sh-border bg-sh-bg">
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        Agent status: {statusLabel}
      </span>
      <div className="flex w-full items-center gap-2.5 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <BrandLogo />
          {showStatusChip ? (
            <span
              key={status}
              className={cn(
                "motion-crossfade inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-sans text-[11.5px] font-semibold tracking-tight",
                statusChipClass(status),
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full bg-current",
                  status === "connecting" && "motion-live-dot",
                )}
              />
              {statusLabel}
            </span>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SessionControls compact />
          <ThemeToggle />
          <TaskRailTrigger open={taskRailOpen} onToggle={onTaskRailToggle} />
          <ConnectionStatus />
        </div>
      </div>
    </header>
  )
}
