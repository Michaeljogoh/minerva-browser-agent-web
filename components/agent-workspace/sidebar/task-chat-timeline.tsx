"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
  GitBranchIcon,
  PlayIcon,
  ShieldAlertIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { NowLine } from "@/components/agent-workspace/status/now-line"
import { RunPhaseStepper } from "@/components/agent-workspace/status/run-phase-stepper"
import { useRunClock } from "@/components/agent-workspace/status/use-run-clock"
import { formatElapsed } from "@/lib/run-phase"
import { humanStepLabel, stepHost } from "@/lib/step-copy"
import type { ReasoningStep } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

const RECENT = 4

function stepIconClass(type: ReasoningStep["type"]): string {
  switch (type) {
    case "approval":
      return "text-sh-warning"
    case "error":
      return "text-sh-error"
    case "action":
      return "text-sh-accent-green"
    default:
      return "text-sh-text-muted"
  }
}

function StepIcon({ type }: { type: ReasoningStep["type"] }) {
  const className = cn("size-3.5 shrink-0", stepIconClass(type))
  switch (type) {
    case "action":
      return <PlayIcon className={className} aria-hidden />
    case "observation":
      return <EyeIcon className={className} aria-hidden />
    case "screenshot":
      return <CameraIcon className={className} aria-hidden />
    case "approval":
      return <ShieldAlertIcon className={className} aria-hidden />
    case "error":
      return <TriangleAlertIcon className={className} aria-hidden />
    default:
      return <GitBranchIcon className={className} aria-hidden />
  }
}

type TaskChatTimelineProps = {
  className?: string
}

export function TaskChatTimeline({ className }: TaskChatTimelineProps) {
  const status = useAgentStore((s) => s.status)
  const reasoningSteps = useAgentStore((s) => s.reasoningSteps)
  const result = useAgentStore((s) => s.result)
  const [expanded, setExpanded] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement>(null)
  const elapsed = useRunClock(status, result?.totalExecutionTimeMs)

  const showCompletion = status === "complete" && result != null
  const hasFlow = status !== "idle" || reasoningSteps.length > 0

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [reasoningSteps.length, status, showCompletion])

  if (!hasFlow) {
    return null
  }

  const earlier = reasoningSteps.slice(0, -1).reverse()
  const visibleEarlier = expanded ? earlier : earlier.slice(0, RECENT)
  const hiddenCount = earlier.length - visibleEarlier.length
  const sites = new Set(
    reasoningSteps.map(stepHost).filter((h): h is string => h != null),
  )
  const actionCount = reasoningSteps.filter((s) => s.type === "action").length

  return (
    <div
      className={cn(
        "flex flex-col gap-3 font-sans text-[13px] tracking-tight",
        className,
      )}
    >
      <section
        aria-label="Live run"
        className="motion-rise overflow-hidden rounded-2xl border border-sh-border bg-sh-surface-raised"
      >
        <div className="flex flex-col gap-4 p-4">
          <RunPhaseStepper />
          <NowLine />
        </div>
        <div className="flex items-center gap-3 border-t border-sh-border bg-sh-surface/60 px-4 py-2 font-mono text-[11px] tabular-nums text-sh-text-muted">
          <span>{formatElapsed(elapsed)}</span>
          <span aria-hidden>·</span>
          <span>
            {actionCount} {actionCount === 1 ? "action" : "actions"}
          </span>
          {sites.size > 0 ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {sites.size} {sites.size === 1 ? "site" : "sites"}
              </span>
            </>
          ) : null}
        </div>
      </section>

      {earlier.length > 0 ? (
        <div>
          <ul className="flex flex-col gap-1.5" aria-label="Earlier steps">
            <AnimatePresence initial={false}>
              {visibleEarlier.map((step, i) => (
                <motion.li
                  key={step.id}
                  layout="position"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: Math.max(0.45, 1 - i * 0.14), y: 0 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-start gap-2 text-[12px] leading-snug text-sh-text-muted"
                >
                  <span className="mt-0.5">
                    <StepIcon type={step.type} />
                  </span>
                  <span className="min-w-0">{humanStepLabel(step)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {hiddenCount > 0 || expanded ? (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="mt-2 inline-flex min-h-8 cursor-pointer items-center gap-1 text-[11.5px] font-semibold text-sh-accent-green hover:underline"
            >
              <ChevronDownIcon
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  expanded && "rotate-180",
                )}
                aria-hidden
              />
              {expanded ? "Show fewer" : `Show ${hiddenCount} earlier`}
            </button>
          ) : null}
        </div>
      ) : null}

      {showCompletion && result ? (
        <div className="motion-rise flex flex-col gap-2.5 rounded-2xl border border-primary/30 bg-sh-success-fill p-4">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-sh-accent-green-ink dark:text-sh-text">
            <span
              aria-hidden
              className="motion-pop flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <CheckIcon className="size-3" strokeWidth={3} />
            </span>
            Finished in {(result.totalExecutionTimeMs / 1000).toFixed(1)}s
            <span className="font-normal text-sh-text-muted">
              · {actionCount} actions · {Math.max(sites.size, 1)}{" "}
              {sites.size === 1 || sites.size === 0 ? "site" : "sites"}
            </span>
          </p>
          <p className="text-[13px] leading-relaxed text-pretty text-sh-text">
            {result.summary}
          </p>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  )
}
