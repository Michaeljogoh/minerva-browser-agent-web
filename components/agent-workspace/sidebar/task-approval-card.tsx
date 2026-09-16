"use client"

import * as React from "react"
import { CheckIcon, PencilIcon, ShieldAlertIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  formatCountdown,
  useApprovalCountdown,
} from "@/hooks/use-approval-countdown"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

type TaskApprovalCardProps = {
  className?: string
}

export function TaskApprovalCard({ className }: TaskApprovalCardProps) {
  const pendingApproval = useAgentStore((s) => s.pendingApproval)
  const approveAction = useAgentStore((s) => s.approveAction)
  const stopTask = useAgentStore((s) => s.stopTask)
  const reset = useAgentStore((s) => s.reset)

  const panelRef = React.useRef<HTMLDivElement>(null)
  const [expandedContext, setExpandedContext] = React.useState(false)
  const [showModify, setShowModify] = React.useState(false)
  const [modifyAnswer, setModifyAnswer] = React.useState("")
  const [timedOut, setTimedOut] = React.useState(false)

  const remainingMs = useApprovalCountdown(pendingApproval?.timeoutAt ?? null)

  useFocusTrap(panelRef, Boolean(pendingApproval))

  React.useEffect(() => {
    if (pendingApproval) {
      setShowModify(false)
      setModifyAnswer("")
      setExpandedContext(false)
      setTimedOut(false)
    }
  }, [pendingApproval?.approvalId])

  React.useEffect(() => {
    if (
      pendingApproval &&
      remainingMs === 0 &&
      Date.now() >= pendingApproval.timeoutAt
    ) {
      setTimedOut(true)
      useAgentStore.setState({
        pendingApproval: null,
        status: "running",
        error: {
          message:
            "Approval timed out after 5 minutes. Stop the task or start a new one.",
          timestamp: Date.now(),
          recoverable: false,
        },
      })
    }
  }, [pendingApproval, remainingMs])

  if (!pendingApproval) {
    return null
  }

  const handleReject = () => {
    approveAction(false)
    setShowModify(false)
  }

  const handleApprove = () => {
    approveAction(true)
    setShowModify(false)
  }

  const handleModifySubmit = () => {
    const answer = modifyAnswer.trim()
    if (!answer) {
      return
    }
    approveAction(false, answer)
    setShowModify(false)
    setModifyAnswer("")
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-approval-title"
      className={cn(
        "motion-dock-enter relative overflow-hidden rounded-xl border border-(--sh-warning)/35 bg-sh-surface-raised/90 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md",
        "ring-1 ring-(--sh-warning)/15",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--sh-warning)/60 to-transparent"
      />

      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--sh-warning)/15 text-(--sh-warning)">
              <ShieldAlertIcon className="size-3.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p
                id="task-approval-title"
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-(--sh-warning)"
              >
                Approval required
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-sh-text-muted">
                Expires in {formatCountdown(remainingMs)}
              </p>
            </div>
          </div>
        </div>

        <p className="font-sans text-[13px] leading-snug text-sh-text">
          {pendingApproval.question}
        </p>

        <div className="rounded-lg border border-sh-border/70 bg-sh-bg/60 px-2.5 py-2">
          <p
            className={cn(
              "font-mono text-[11px] leading-relaxed text-sh-text-muted",
              !expandedContext && "line-clamp-3",
            )}
          >
            {pendingApproval.context}
          </p>
          {pendingApproval.context.length > 140 ? (
            <button
              type="button"
              className="mt-1.5 font-mono text-[10px] text-sh-accent-link transition-opacity hover:opacity-80"
              onClick={() => setExpandedContext((v) => !v)}
            >
              {expandedContext ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>

        {timedOut ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs text-(--sh-error)" role="alert">
              Approval window expired — stop the task or start a new one.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="rounded-full font-mono"
                onClick={stopTask}
              >
                Stop task
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="rounded-full font-mono"
                onClick={reset}
              >
                New task
              </Button>
            </div>
          </div>
        ) : null}

        {showModify ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={modifyAnswer}
              onChange={(e) => setModifyAnswer(e.target.value)}
              aria-label="Modification instructions for the agent"
              className="min-h-16 rounded-lg border-sh-border bg-sh-bg font-mono text-xs shadow-none"
              placeholder="Describe what the agent should do differently…"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="xs"
                className="rounded-full font-mono active:scale-[0.97]"
                disabled={!modifyAnswer.trim()}
                onClick={handleModifySubmit}
              >
                Send modification
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="rounded-full font-mono"
                onClick={() => setShowModify(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-0.5">
            <Button
              type="button"
              size="sm"
              className="rounded-full bg-sh-text font-mono text-sh-bg hover:bg-sh-text/90 active:scale-[0.97]"
              disabled={timedOut}
              onClick={handleApprove}
            >
              <CheckIcon data-icon="inline-start" className="size-3.5" />
              Approve
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-full font-mono active:scale-[0.97]"
              disabled={timedOut}
              onClick={handleReject}
            >
              <XIcon data-icon="inline-start" className="size-3.5" />
              Reject
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-sh-border bg-transparent font-mono active:scale-[0.97]"
              disabled={timedOut}
              onClick={() => setShowModify(true)}
            >
              <PencilIcon data-icon="inline-start" className="size-3.5" />
              Modify
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
