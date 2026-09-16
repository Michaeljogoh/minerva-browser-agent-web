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
import { useTimelineScroll } from "@/hooks/use-timeline-scroll"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import * as React from "react"

export type LeftRailMode = "agent" | "sessions"

type Filter = "all" | "actions" | "errors"

function matchesFilter(stepType: ReasoningStepType, filter: Filter): boolean {
  if (filter === "all") {
    return true
  }
  if (filter === "actions") {
    return (
      stepType === "action" ||
      stepType === "observation" ||
      stepType === "reasoning"
    )
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
  const [filter, setFilter] = React.useState<Filter>("all")
  const { scrollRef, onScroll, scrollToBottom, showNewPill } =
    useTimelineScroll(steps.length)

  const filtered = steps
    .slice(0, replayActive ? replayVisibleSteps : steps.length)
    .filter((step) => matchesFilter(step.type, filter))

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-sh-border px-3">
        <div className="flex min-w-0 items-center gap-1">
          <AgentRailTrigger open onToggle={onToggle} />
          <p className="font-mono text-[11px] uppercase tracking-wide text-sh-text-muted">
            Agent
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-sh-surface px-2 py-0.5 font-mono text-[10px] tabular-nums text-sh-text-muted ring-1 ring-sh-border">
          Step {currentStep}
        </span>
      </div>

      <div className="shrink-0 border-b border-sh-border p-2.5">
        <div
          role="tablist"
          aria-label="Filter agent steps"
          className="flex gap-0.5 rounded-full bg-sh-surface p-0.5 ring-1 ring-sh-border"
        >
          {(["all", "actions", "errors"] as const).map((value) => {
            const active = filter === value
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                className={cn(
                  "flex-1 rounded-full px-2.5 py-1.5 font-mono text-[10px] capitalize",
                  "transition-[background-color,color,transform] duration-150 ease-out",
                  "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sh-accent-green/50",
                  active
                    ? "bg-sh-text text-sh-bg dark:bg-sh-accent-green dark:text-white"
                    : "text-sh-text-muted hover:text-sh-text",
                )}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            )
          })}
        </div>
      </div>

      {!isConnected && steps.length > 0 ? (
        <p className="border-b border-sh-border px-3 py-1.5 font-mono text-[10px] text-sh-text-muted">
          Timeline read-only — reconnect to send controls
        </p>
      ) : null}

      {replayActive ? (
        <p className="border-b border-sh-border bg-sh-surface px-3 py-1.5 font-mono text-[10px] text-sh-accent-green">
          Replaying timeline · step {replayVisibleSteps} / {steps.length}
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
                "before:absolute before:top-3 before:bottom-3 before:left-1.5 before:w-px before:border",
            )}
          >
            {filtered.length === 0 ? (
              <li className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
                <span className="mb-2 inline-flex size-8 items-center justify-center rounded-full bg-sh-surface ring-1 ring-sh-border">
                  <span className="size-1.5 rounded-full bg-sh-accent-green" />
                </span>
                <p className="font-sans text-xs text-sh-text">
                  Waiting for the first step
                </p>
                <p className="mt-1 max-w-48 font-mono text-[10px] leading-relaxed text-sh-text-muted">
                  Actions, observations, and screenshots will stream here as the
                  agent runs.
                </p>
              </li>
            ) : (
              filtered.map((step) => (
                <li key={step.id}>
                  <DecisionCard step={step} />
                </li>
              ))
            )}
          </ul>
        </div>

        {showNewPill ? (
          <Button
            type="button"
            size="xs"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-sh-text px-3 font-mono text-[10px] text-sh-bg shadow-sm transition-transform duration-150 ease-out active:scale-[0.97] hover:bg-sh-text/90 dark:bg-sh-accent-green dark:text-white dark:hover:bg-sh-accent-green"
            onClick={scrollToBottom}
          >
            New messages
          </Button>
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
  const title = mode === "sessions" ? "Sessions" : "Agent timeline"

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
