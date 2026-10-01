"use client"

import { TaskApprovalCard } from "@/components/agent-workspace/sidebar/task-approval-card"
import { ActivityRailTrigger } from "@/components/agent-workspace/rail/activity-rail-trigger"
import { AgentRailTrigger } from "@/components/agent-workspace/rail/agent-rail-trigger"
import { SessionsRailTrigger } from "@/components/agent-workspace/rail/sessions-rail-trigger"
import { TaskChatComposer } from "@/components/agent-workspace/sidebar/task-chat-composer"
import { TaskChatTimeline } from "@/components/agent-workspace/sidebar/task-chat-timeline"
import { TaskDemoPicker } from "@/components/agent-workspace/sidebar/task-demo-picker"
import { TaskUserMessage } from "@/components/agent-workspace/sidebar/task-user-message"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { humanStatusLabel } from "@/lib/status-copy"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

type TaskSidebarContentProps = {
  className?: string
  agentModeActive: boolean
  onAgentRailToggle: () => void
  sessionsModeActive: boolean
  onSessionsToggle: () => void
}

function TaskSidebarContent({
  className,
  agentModeActive,
  onAgentRailToggle,
  sessionsModeActive,
  onSessionsToggle,
}: TaskSidebarContentProps) {
  const goal = useAgentStore((s) => s.goal)
  const submittedGoal = useAgentStore((s) => s.submittedGoal)
  const status = useAgentStore((s) => s.status)
  const pendingApproval = useAgentStore((s) => s.pendingApproval)

  const hasDraft = goal.trim().length > 0
  const hasSubmitted = submittedGoal.trim().length > 0
  const isComposing = status === "idle" && hasDraft && !hasSubmitted
  const showSubmittedPrompt = hasSubmitted
  const showEmptyState =
    !hasDraft && !hasSubmitted && status !== "complete" && status !== "error"
  const headerHint = humanStatusLabel(status, pendingApproval)
  const showHint = status !== "idle"

  return (
    <div className={cn("flex h-full min-h-0 flex-1 flex-col font-sans text-[13px] tracking-tight", className)}>
      <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-sh-border px-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <AgentRailTrigger
            open={agentModeActive}
            onToggle={onAgentRailToggle}
          />
          <p className="font-sans text-[12px] font-semibold text-sh-text">Job</p>
          {showHint ? (
            <span className="truncate rounded-full bg-sh-steer-fill px-2 py-0.5 font-sans text-[11px] text-sh-steer">
              {headerHint}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ActivityRailTrigger
            active={agentModeActive}
            onToggle={onAgentRailToggle}
          />
          <SessionsRailTrigger
            active={sessionsModeActive}
            onToggle={onSessionsToggle}
          />
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-3 font-sans text-[13px]">
        {isComposing ? null : (
          <>
            {showEmptyState ? <TaskDemoPicker /> : null}
            {showSubmittedPrompt ? (
              <div className="flex flex-col gap-3">
                <TaskUserMessage content={submittedGoal.trim()} />
                <TaskChatTimeline />
              </div>
            ) : null}
            {status === "complete" ? (
              <p className={cn("font-sans text-[12px] text-sh-text-muted", showSubmittedPrompt && "mt-3")}>
                Open the report in the main view to review numbers before anything is posted.
              </p>
            ) : null}
          </>
        )}
      </div>

      {pendingApproval ? (
        <div className="shrink-0 border-t border-sh-border bg-sh-bg p-3">
          <TaskApprovalCard />
        </div>
      ) : null}

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
          className="w-full max-w-[min(100vw,var(--sidebar-width))] gap-0 border-sh-border bg-sh-bg p-0 font-sans text-[13px] tracking-tight"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Job</SheetTitle>
          </SheetHeader>
          <TaskSidebarContent
            className="h-full"
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
        "h-full shrink-0 overflow-hidden border-l border-sh-border bg-sh-bg motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)]",
        open ? "w-(--sidebar-width)" : "pointer-events-none w-0 border-l-0",
      )}
    >
      <aside
        aria-label="Job"
        data-state={open ? "expanded" : "collapsed"}
        className="flex h-full min-h-0 w-(--sidebar-width) flex-col font-sans text-[13px] tracking-tight"
      >
        <TaskSidebarContent
          agentModeActive={agentModeActive}
          onAgentRailToggle={onAgentRailToggle}
          sessionsModeActive={sessionsModeActive}
          onSessionsToggle={onSessionsToggle}
        />
      </aside>
    </div>
  )
}
