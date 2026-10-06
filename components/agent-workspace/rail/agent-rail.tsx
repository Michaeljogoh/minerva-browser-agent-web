"use client"

import type { ReasoningStepType } from "@/lib/types/agent"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { AgentRailTrigger } from "@/components/agent-workspace/rail/agent-rail-trigger"
import { DecisionCard } from "@/components/agent-workspace/rail/decision-card"
import { SessionsPanel } from "@/components/agent-workspace/rail/sessions-panel"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRunClock } from "@/components/agent-workspace/status/use-run-clock"
import { useTimelineScroll } from "@/hooks/use-timeline-scroll"
import { formatElapsed } from "@/lib/run-phase"
import { humanStatusLabel, statusChipClass } from "@/lib/status-copy"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import { ActivityIcon, ArrowDownIcon } from "lucide-react"
import * as React from "react"

export type LeftRailMode = "agent" | "sessions"

type Filter = "all" | "needs_you" | "problems"

function matchesFilter(stepType: ReasoningStepType, filter: Filter): boolean {
  if (filter === "all") {
    return true
  }
  if (filter === "needs_you") {
    return stepType === "approval"
  }
  return stepType === "error"
}

type AgentTimelineContentProps = {
  className?: string
  onToggle: () => void
}

function AgentTimelineContent({
  className,
  onToggle,
}: AgentTimelineContentProps) {
  const steps = useAgentStore((s) => s.reasoningSteps)
  const replayActive = useAgentStore((s) => s.replayActive)
  const replayVisibleSteps = useAgentStore((s) => s.replayVisibleSteps)
  const currentStep = useAgentStore((s) => s.currentStep)
  const isConnected = useAgentStore((s) => s.isConnected)
  const status = useAgentStore((s) => s.status)
  const pendingApproval = useAgentStore((s) => s.pendingApproval)
  const result = useAgentStore((s) => s.result)
  const elapsed = useRunClock(status, result?.totalExecutionTimeMs)
  const live = status === "connecting" || status === "running"
  const [filter, setFilter] = React.useState<Filter>("all")
  const { scrollRef, onScroll, scrollToBottom, showNewPill } =
    useTimelineScroll(steps.length)

  const visibleSteps = steps.slice(
    0,
    replayActive ? replayVisibleSteps : steps.length,
  )
  const filtered = visibleSteps.filter((step) =>
    matchesFilter(step.type, filter),
  )
  const counts: Record<Filter, number> = {
    all: visibleSteps.length,
    needs_you: visibleSteps.filter((s) => s.type === "approval").length,
    problems: visibleSteps.filter((s) => s.type === "error").length,
  }
  const latestId = steps.at(-1)?.id

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-sh-border px-3">
        <div className="flex min-w-0 items-center gap-1">
          <AgentRailTrigger open onToggle={onToggle} />
          <p className="font-sans text-[13px] font-semibold text-sh-text">
            Activity
          </p>
        </div>
        {status === "idle" ? (
          <span className="inline-flex h-6 items-center rounded-full bg-sh-surface px-2.5 font-sans text-[11.5px] font-medium text-sh-text-muted">
            Waiting
          </span>
        ) : (
          <span
            key={status}
            className={cn(
              "motion-crossfade inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-sans text-[11.5px] font-semibold tabular-nums",
              statusChipClass(status),
            )}
          >
            {live ? (
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
            ) : null}
            {humanStatusLabel(status, pendingApproval)}
            <span className="font-mono font-normal opacity-70">
              {formatElapsed(elapsed)}
              {currentStep > 0 ? ` · ${currentStep}` : ""}
            </span>
          </span>
        )}
      </div>

      <div className="shrink-0 border-b border-sh-border p-2.5">
        <div
          role="tablist"
          aria-label="Filter activity"
          className="flex gap-0.5 rounded-full bg-sh-surface p-0.5 ring-1 ring-sh-border"
        >
          {(
            [
              ["all", "All"],
              ["needs_you", "Needs you"],
              ["problems", "Problems"],
            ] as const
          ).map(([value, label]) => {
            const active = filter === value
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                className={cn(
                  "flex-1 rounded-full px-2.5 py-1.5 font-sans text-[11px] font-semibold",
                  "transition-[background-color,color,transform] duration-150 ease-out",
                  "active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-sh-steer/40",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "cursor-pointer text-sh-text-muted hover:text-sh-text",
                )}
                onClick={() => setFilter(value)}
              >
                {label}
                {counts[value] > 0 ? (
                  <span
                    className={cn(
                      "ml-1 tabular-nums",
                      active ? "opacity-80" : "text-sh-text-muted",
                    )}
                  >
                    {counts[value]}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {!isConnected && steps.length > 0 ? (
        <p className="border-b border-sh-border px-3 py-1.5 font-sans text-[12px] text-sh-text-muted">
          Timeline is read-only until we reconnect
        </p>
      ) : null}

      {replayActive ? (
        <p className="border-b border-sh-border bg-sh-surface px-3 py-1.5 font-sans text-[12px] text-sh-steer">
          Replaying · move {replayVisibleSteps} of {steps.length}
        </p>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="no-scrollbar absolute inset-0 overflow-y-auto px-3 py-3"
        >
          <ul
            aria-label="Agent reasoning timeline"
            className={cn(
              "relative flex list-none flex-col gap-3",
              filtered.length > 0 &&
                "before:absolute before:top-3 before:bottom-3 before:left-1.5 before:w-px before:bg-gradient-to-b before:from-sh-border before:via-sh-border before:to-transparent",
            )}
          >
            {filtered.length === 0 ? (
              <li className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
                <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-sh-steer-fill text-sh-accent-green">
                  <ActivityIcon className="size-4" aria-hidden />
                </span>
                <p className="font-sans text-[13px] text-sh-text">
                  Waiting for the first move
                </p>
                <p className="mt-1 max-w-48 font-sans text-[12px] leading-relaxed text-sh-text-muted">
                  You’ll see each visit and click here in plain language.
                </p>
              </li>
            ) : (
              filtered.map((step) => (
                <li key={step.id}>
                  <DecisionCard
                    step={step}
                    latest={step.id === latestId && live}
                  />
                </li>
              ))
            )}
          </ul>
        </div>

        {showNewPill ? (
          <div className="motion-dock-enter absolute bottom-3 left-1/2 -translate-x-1/2">
            <Button
              type="button"
              size="xs"
              className="h-7 px-3 text-[12px] shadow-lg shadow-black/15"
              onClick={scrollToBottom}
            >
              <ArrowDownIcon data-icon="inline-start" />
              New activity
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

type AgentRailProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: LeftRailMode
  activeSessionId: string | null
  onSessionActivated: (id: string) => void
}

export function AgentRail({
  open,
  onOpenChange,
  mode,
  activeSessionId,
  onSessionActivated,
}: AgentRailProps) {
  const isMobile = useIsMobile()
  const title = mode === "sessions" ? "Past jobs" : "Activity"

  const body =
    mode === "sessions" ? (
      <SessionsPanel
        className="h-full"
        onClose={() => onOpenChange(false)}
        activeSessionId={activeSessionId}
        onSessionActivated={onSessionActivated}
      />
    ) : (
      <AgentTimelineContent
        className="h-full"
        onToggle={() => onOpenChange(false)}
      />
    )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-full max-w-[min(100vw,var(--agent-rail-width))] gap-0 border-sh-border bg-sh-bg p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          {body}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      aria-hidden={!open}
      inert={!open ? true : undefined}
      className={cn(
        "h-full shrink-0 overflow-hidden border-r border-sh-border bg-sh-bg motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-in-out",
        open ? "w-(--agent-rail-width)" : "pointer-events-none w-0 border-r-0",
      )}
    >
      <aside
        aria-label={title}
        data-state={open ? "expanded" : "collapsed"}
        data-mode={mode}
        className="flex h-full w-(--agent-rail-width) flex-col"
      >
        {body}
      </aside>
    </div>
  )
}
