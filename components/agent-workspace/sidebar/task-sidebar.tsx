"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { AgentRailTrigger } from "@/components/agent-workspace/rail/agent-rail-trigger"
import { SessionsRailTrigger } from "@/components/agent-workspace/rail/sessions-rail-trigger"
import { ResultSummary } from "@/components/agent-workspace/results/result-summary"
import { TaskChatComposer } from "@/components/agent-workspace/sidebar/task-chat-composer"
import { TaskChatTimeline } from "@/components/agent-workspace/sidebar/task-chat-timeline"
import { TaskRailTrigger } from "@/components/agent-workspace/sidebar/task-rail-trigger"
import { TaskUserMessage } from "@/components/agent-workspace/sidebar/task-user-message"
import { useIsMobile } from "@/hooks/use-mobile"
import { isSessionActive } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

type TaskSidebarContentProps = {
  className?: string
  onToggle: () => void
  agentModeActive: boolean
  onAgentRailToggle: () => void
  sessionsModeActive: boolean
  onSessionsToggle: () => void
}

function TaskSidebarContent({
  className,
  onToggle,
  agentModeActive,
  onAgentRailToggle,
  sessionsModeActive,
  onSessionsToggle,
}: TaskSidebarContentProps) {
  const goal = useAgentStore((s) => s.goal)
  const submittedGoal = useAgentStore((s) => s.submittedGoal)
  const status = useAgentStore((s) => s.status)
  const error = useAgentStore((s) => s.error)
  const stopTask = useAgentStore((s) => s.stopTask)

  const hasDraft = goal.trim().length > 0
  const hasSubmitted = submittedGoal.trim().length > 0
  const isComposing = status === "idle" && hasDraft && !hasSubmitted
  const showSubmittedPrompt = hasSubmitted
  const showEmptyState =
    !hasDraft && !hasSubmitted && status !== "complete" && status !== "error"
  const canStop =
    status === "connecting" ||
    status === "running" ||
    status === "approval_pending"
  const stopDisabled =
    !isSessionActive(status) || (status === "error" && Boolean(error?.fatal))

  return (
    <div className={cn("flex h-full min-h-0 flex-1 flex-col", className)}>
      <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-sh-border px-3">
        <div className="flex min-w-0 items-center gap-1">
          <AgentRailTrigger
            open={agentModeActive}
            onToggle={onAgentRailToggle}
          />
          <p className="font-mono text-[11px] uppercase tracking-wide text-sh-text">
            Agent
          </p>
        </div>
        <div className="flex items-center gap-1">
          <SessionsRailTrigger
            active={sessionsModeActive}
            onToggle={onSessionsToggle}
          />
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
        {isComposing ? null : (
          <>
            {showEmptyState ? (
              <div className="flex h-full min-h-32 items-center justify-center px-4 text-center">
                <p className="font-mono text-xs text-sh-text-muted">
                  Describe what the agent should do, or choose a demo from the
                  dropdown below.
                </p>
              </div>
            ) : null}
            {showSubmittedPrompt ? (
              <div className="flex flex-col gap-3">
                <TaskUserMessage
                  content={submittedGoal.trim()}
                  canStop={canStop}
                  stopDisabled={stopDisabled}
                  onStop={stopTask}
                />
                <TaskChatTimeline />
              </div>
            ) : null}
            {status === "complete" ? (
              <div className={cn(showSubmittedPrompt && "mt-4")}>
                <ResultSummary hideMeta />
              </div>
            ) : null}
          </>
        )}
      </div>

      <TaskChatComposer className="mt-auto shrink-0" />
    </div>
  )
}

type TaskSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentModeActive: boolean
  onAgentRailToggle: () => void
  sessionsModeActive: boolean
  onSessionsToggle: () => void
}

export function TaskSidebar({
  open,
  onOpenChange,
  agentModeActive,
  onAgentRailToggle,
  sessionsModeActive,
  onSessionsToggle,
}: TaskSidebarProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full max-w-[min(100vw,var(--sidebar-width))] gap-0 border-sh-border bg-sh-bg p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Agent</SheetTitle>
          </SheetHeader>
          <TaskSidebarContent
            className="h-full"
            onToggle={() => onOpenChange(false)}
            agentModeActive={agentModeActive}
            onAgentRailToggle={onAgentRailToggle}
            sessionsModeActive={sessionsModeActive}
            onSessionsToggle={onSessionsToggle}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      aria-hidden={!open}
      inert={!open ? true : undefined}
      className={cn(
        "h-full shrink-0 overflow-hidden border-l border-sh-border bg-sh-bg motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-in-out",
        open ? "w-(--sidebar-width)" : "pointer-events-none w-0 border-l-0",
      )}
    >
      <aside
        aria-label="Agent"
        data-state={open ? "expanded" : "collapsed"}
        className="flex h-full min-h-0 w-(--sidebar-width) flex-col"
      >
        <TaskSidebarContent
          onToggle={() => onOpenChange(false)}
          agentModeActive={agentModeActive}
          onAgentRailToggle={onAgentRailToggle}
          sessionsModeActive={sessionsModeActive}
          onSessionsToggle={onSessionsToggle}
        />
      </aside>
    </div>
  )
}
