"use client"

import * as React from "react"
import {
  CheckIcon,
  ExternalLinkIcon,
  LogInIcon,
  PencilIcon,
  PlugIcon,
  ShieldAlertIcon,
  XIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [inputValue, setInputValue] = React.useState("")

  const remainingMs = useApprovalCountdown(pendingApproval?.timeoutAt ?? null)

  useFocusTrap(panelRef, Boolean(pendingApproval))

  React.useEffect(() => {
    if (pendingApproval) {
      setShowModify(false)
      setModifyAnswer("")
      setInputValue("")
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
            "This review timed out after 5 minutes. Stop the job or start a new one.",
          timestamp: Date.now(),
          recoverable: false,
        },
      })
    }
  }, [pendingApproval, remainingMs])

  if (!pendingApproval) {
    return null
  }

  const kind = pendingApproval.kind ?? "approval"
  const isLogin = kind === "login"
  const isConnect = kind === "connect"
  const isConnectInput = kind === "connect_input"
  const isHandoff = isLogin || isConnect || isConnectInput
  const title = isLogin
    ? "Your turn: sign in"
    : isConnect || isConnectInput
      ? "Connect this app"
      : "Needs your review"
  const approveLabel = isLogin
    ? "I’m signed in"
    : isConnect
      ? "I’ve connected"
      : isConnectInput
        ? "Continue"
        : "Approve"
  const rejectLabel =
    isLogin || isConnect || isConnectInput ? "Skip for now" : "Don’t do this"

  const handleReject = () => {
    approveAction(false)
    setShowModify(false)
  }

  const handleApprove = () => {
    if (isConnectInput) {
      const value = inputValue.trim()
      if (!value) return
      approveAction(true, value)
      setShowModify(false)
      return
    }
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
        "motion-dock-enter relative overflow-hidden rounded-2xl border bg-sh-surface-raised",
        isHandoff
          ? "border-sh-steer/30 bg-sh-steer-fill"
          : "border-sh-warning/30 bg-sh-warning-fill",
        className,
      )}
    >
      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              "motion-pop flex size-9 shrink-0 items-center justify-center rounded-xl",
              isHandoff
                ? "bg-primary text-primary-foreground"
                : "bg-sh-warning/15 text-sh-warning",
            )}
          >
            {isLogin ? (
              <LogInIcon className="size-4" aria-hidden />
            ) : isConnect || isConnectInput ? (
              <PlugIcon className="size-4" aria-hidden />
            ) : (
              <ShieldAlertIcon className="size-4" aria-hidden />
            )}
          </span>
          <div className="min-w-0">
            <p
              id="task-approval-title"
              className="font-sans text-[13.5px] font-semibold text-sh-text"
            >
              {title}
            </p>
            <p className="mt-0.5 font-sans text-[12px] tabular-nums text-sh-text-muted">
              This waits {formatCountdown(remainingMs)}
            </p>
          </div>
        </div>

        {pendingApproval.connectUrl ? (
          <a
            href={pendingApproval.connectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "self-start")}
          >
            <ExternalLinkIcon data-icon="inline-start" aria-hidden />
            Open secure {pendingApproval.appName ?? "app"} connection
          </a>
        ) : null}

        {isLogin ? (
          <p className="font-sans text-[13px] leading-relaxed text-sh-text-muted">
            The live browser is unlocked. Sign in there, and never paste a
            password in this chat.
          </p>
        ) : null}

        <p className="font-sans text-[13px] leading-snug text-sh-text">
          {pendingApproval.question}
        </p>

        {pendingApproval.context ? (
          <div className="rounded-lg bg-sh-bg/70 px-2.5 py-2">
            <p
              className={cn(
                "font-sans text-[12px] leading-relaxed text-sh-text-muted",
                !expandedContext && "line-clamp-3",
              )}
            >
              {pendingApproval.context}
            </p>
            {pendingApproval.context.length > 140 ? (
              <button
                type="button"
                className="mt-1.5 font-sans text-[12px] text-sh-steer hover:underline"
                onClick={() => setExpandedContext((v) => !v)}
              >
                {expandedContext ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
        ) : null}

        {isConnectInput ? (
          <label className="flex flex-col gap-1.5">
            <span className="font-sans text-[12px] font-medium text-sh-text">
              {pendingApproval.inputLabel ?? "Value"}
            </span>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApprove()
              }}
              placeholder={pendingApproval.inputPlaceholder}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              className="h-9 rounded-lg border-sh-border bg-sh-bg font-sans text-[13px] shadow-none"
            />
          </label>
        ) : null}

        {timedOut ? (
          <div className="flex flex-col gap-2">
            <p className="font-sans text-[13px] text-sh-error" role="alert">
              This review expired. Stop the job or start a new one.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={stopTask}
              >
                Stop job
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={reset}
              >
                New job
              </Button>
            </div>
          </div>
        ) : null}

        {showModify ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={modifyAnswer}
              onChange={(e) => setModifyAnswer(e.target.value)}
              aria-label="What the agent should do instead"
              className="min-h-16 rounded-lg border-sh-border bg-sh-bg font-sans text-[13px] shadow-none"
              placeholder="Describe what it should do instead…"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={!modifyAnswer.trim()}
                onClick={handleModifySubmit}
              >
                Send change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
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
              disabled={timedOut || (isConnectInput && !inputValue.trim())}
              onClick={handleApprove}
            >
              <CheckIcon data-icon="inline-start" className="size-3.5" />
              {approveLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={timedOut}
              onClick={handleReject}
            >
              <XIcon data-icon="inline-start" className="size-3.5" />
              {rejectLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={timedOut}
              onClick={() => setShowModify(true)}
            >
              <PencilIcon data-icon="inline-start" className="size-3.5" />
              Change this
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
