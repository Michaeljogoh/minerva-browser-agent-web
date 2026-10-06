"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { GlobeIcon } from "lucide-react"

import { humanStepLabel, stepHost } from "@/lib/step-copy"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

/** One large line: what the agent is doing right now. */
export function NowLine({ className }: { className?: string }) {
  const status = useAgentStore((s) => s.status)
  const steps = useAgentStore((s) => s.reasoningSteps)
  const pending = useAgentStore((s) => s.pendingApproval)
  const reduce = useReducedMotion()

  const latest = steps.at(-1)
  let key = "idle"
  let text = ""
  let host: string | null = null
  let tone: "default" | "warn" | "bad" = "default"

  if (status === "connecting") {
    key = "connecting"
    text = "Opening a secure browser"
  } else if (status === "approval_pending") {
    key = `approval-${pending?.approvalId ?? "x"}`
    text = pending?.question ?? "Waiting for your decision"
    tone = "warn"
  } else if (status === "paused") {
    key = "paused"
    text = "Paused. Resume when you're ready"
  } else if (status === "error") {
    key = "error"
    text = latest ? humanStepLabel(latest) : "Something went wrong"
    tone = "bad"
  } else if (status === "complete") {
    key = "complete"
    text = "All done"
  } else if (latest) {
    key = latest.id
    text = humanStepLabel(latest)
    host = stepHost(latest)
  } else {
    key = "planning"
    text = "Planning the first step"
  }

  const working = status === "connecting" || status === "running"

  return (
    <div className={cn("min-h-[3.25rem]", className)} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
        >
          <p
            className={cn(
              "text-[15px] font-semibold leading-snug tracking-tight text-pretty",
              tone === "warn" && "text-sh-warning",
              tone === "bad" && "text-sh-error",
              tone === "default" && "text-sh-text",
            )}
          >
            {text}
            {working ? (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-primary"
              />
            ) : null}
          </p>
          {host ? (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-sh-surface px-2 py-0.5 font-mono text-[11px] text-sh-text-muted">
              <GlobeIcon className="size-3" aria-hidden />
              {host}
            </span>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
