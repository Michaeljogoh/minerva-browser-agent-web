"use client"

import { type AgentStatus } from "@/lib/types/agent"
import { ConnectionStatus } from "@/components/agent-workspace/connection/connection-status"
import { ThemeToggle } from "@/components/agent-workspace/shell/theme-toggle"
import { TaskRailTrigger } from "@/components/agent-workspace/sidebar/task-rail-trigger"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

const statusColors: Partial<Record<AgentStatus, string>> = {
  running: "text-sh-accent-green border-sh-accent-green",
  complete: "text-sh-accent-green border-sh-accent-green",
  connecting: "text-[var(--sh-warning)] border-[var(--sh-warning)]",
  approval_pending: "text-[var(--sh-warning)] border-[var(--sh-warning)]",
  error: "text-[var(--sh-error)] border-[var(--sh-error)]",
}

type WorkspaceHeaderProps = {
  taskRailOpen: boolean
  onTaskRailToggle: () => void
}

export function WorkspaceHeader({
  taskRailOpen,
  onTaskRailToggle,
}: WorkspaceHeaderProps) {
  const status = useAgentStore((s) => s.status)
  const currentStep = useAgentStore((s) => s.currentStep)

  const statusLabel = status.replace("_", " ")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-sh-border bg-sh-bg">
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        Agent status: {statusLabel}
      </span>
      <div className="flex w-full items-center gap-2 px-3">
        <span className="font-sans text-sm tracking-tight text-sh-text">
          Minerva Agent
        </span>
        <Badge
          variant="outline"
          className={cn(
            "rounded-none font-mono text-[10px] capitalize",
            statusColors[status],
          )}
        >
          {statusLabel}
        </Badge>
        {currentStep > 0 ? (
          <span className="font-mono text-[10px] text-sh-text-muted">
            · step {currentStep}
          </span>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <TaskRailTrigger open={taskRailOpen} onToggle={onTaskRailToggle} />
          <ConnectionStatus />
        </div>
      </div>
    </header>
  )
}
