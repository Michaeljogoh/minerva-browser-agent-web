"use client"

import { motion, useReducedMotion } from "framer-motion"
import { CheckIcon, TriangleAlertIcon } from "lucide-react"

import { activePhaseId, runPhases } from "@/lib/run-phase"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

const EASE = [0.32, 0.72, 0, 1] as const

export function RunPhaseStepper({ className }: { className?: string }) {
  const status = useAgentStore((s) => s.status)
  const steps = useAgentStore((s) => s.reasoningSteps)
  const reduce = useReducedMotion()

  const phases = runPhases(steps, status)
  const activeId = activePhaseId(status)
  const activeIndex = Math.max(
    0,
    phases.findIndex((p) => p.id === activeId),
  )
  const failed = status === "error"

  return (
    <ol
      aria-label="Run progress"
      className={cn("flex items-start", className)}
    >
      {phases.map((phase, i) => {
        const done = i < activeIndex || (status === "complete" && i === activeIndex)
        const active = i === activeIndex && status !== "complete"
        const warn = active && phase.id === "review"
        const bad = active && failed
        const last = i === phases.length - 1
        return (
          <li
            key={phase.id}
            aria-current={active ? "step" : undefined}
            className={cn("flex min-w-0 items-start", !last && "flex-1")}
          >
            <div className="flex flex-col items-center gap-1.5">
              <motion.span
                initial={false}
                animate={{ scale: active && !reduce ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className={cn(
                  "relative grid size-6 place-items-center rounded-full border text-[10px] font-semibold transition-colors duration-300",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && !warn && !bad && "border-primary bg-sh-steer-fill text-sh-accent-green",
                  warn && "border-sh-warning bg-sh-warning-fill text-sh-warning",
                  bad && "border-sh-error bg-sh-error-fill text-sh-error",
                  !done && !active && "border-sh-border bg-sh-surface text-sh-text-muted",
                )}
              >
                {done ? (
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  >
                    <CheckIcon className="size-3" strokeWidth={3} aria-hidden />
                  </motion.span>
                ) : bad ? (
                  <TriangleAlertIcon className="size-3" aria-hidden />
                ) : (
                  i + 1
                )}
                {active && !bad && !reduce ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 animate-ping rounded-full opacity-30",
                      warn ? "bg-sh-warning" : "bg-primary",
                    )}
                  />
                ) : null}
              </motion.span>
              <span
                className={cn(
                  "text-[10.5px] font-semibold tracking-wide transition-colors duration-300",
                  active || done ? "text-sh-text" : "text-sh-text-muted",
                )}
              >
                {phase.label}
              </span>
            </div>
            {!last ? (
              <div
                aria-hidden
                className="mx-2 mt-3 h-px flex-1 overflow-hidden bg-sh-border"
              >
                <motion.div
                  className="h-full origin-left bg-primary"
                  initial={false}
                  animate={{ scaleX: i < activeIndex ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
                />
              </div>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
