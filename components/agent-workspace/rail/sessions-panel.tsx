"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  CircleAlertIcon,
  CircleDashedIcon,
  HistoryIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react"

import { AgentRailTrigger } from "@/components/agent-workspace/rail/agent-rail-trigger"
import { getSession, listSessions } from "@/lib/api/sessions"
import type {
  SessionRecordStatus,
  SessionRecordSummary,
} from "@/lib/types/session-record"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

type DateBucket = "Today" | "Last 7 Days" | "Last 30 Days" | "Older"

type SessionsPanelProps = {
  className?: string
  onClose: () => void
  activeSessionId: string | null
  onSessionActivated: (id: string) => void
}

function startOfDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function bucketFor(iso: string, now = new Date()): DateBucket {
  const started = new Date(iso)
  const today = startOfDay(now)
  const dayMs = 24 * 60 * 60 * 1000
  const diffDays = Math.floor(
    (today.getTime() - startOfDay(started).getTime()) / dayMs,
  )

  if (diffDays <= 0) return "Today"
  if (diffDays < 7) return "Last 7 Days"
  if (diffDays < 30) return "Last 30 Days"
  return "Older"
}

function groupSessions(
  sessions: SessionRecordSummary[],
): Array<{ label: DateBucket; items: SessionRecordSummary[] }> {
  const order: DateBucket[] = ["Today", "Last 7 Days", "Last 30 Days", "Older"]
  const map = new Map<DateBucket, SessionRecordSummary[]>()
  for (const label of order) {
    map.set(label, [])
  }
  for (const session of sessions) {
    map.get(bucketFor(session.startedAt))!.push(session)
  }
  return order
    .map((label) => ({ label, items: map.get(label) ?? [] }))
    .filter((group) => group.items.length > 0)
}

function formatSessionWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function SessionStatusIcon({ status }: { status: SessionRecordStatus }) {
  switch (status) {
    case "complete":
      return (
        <CheckCircle2Icon
          className="size-4 shrink-0 text-sh-accent-green"
          aria-label="Succeeded"
        />
      )
    case "running":
      return (
        <Loader2Icon
          className="size-4 shrink-0 animate-spin text-(--sh-warning)"
          aria-label="Running"
        />
      )
    case "stopped":
      return (
        <CircleDashedIcon
          className="size-4 shrink-0 text-(--sh-warning)"
          aria-label="Stopped"
        />
      )
    case "error":
      return (
        <XCircleIcon
          className="size-4 shrink-0 text-(--sh-error)"
          aria-label="Failed"
        />
      )
    default:
      return (
        <CircleAlertIcon
          className="size-4 shrink-0 text-sh-text-muted"
          aria-label="Unknown status"
        />
      )
  }
}

export function SessionsPanel({
  className,
  onClose,
  activeSessionId,
  onSessionActivated,
}: SessionsPanelProps) {
  const loadSessionRecord = useAgentStore((s) => s.loadSessionRecord)
  const startReplay = useAgentStore((s) => s.startReplay)

  const [loading, setLoading] = React.useState(true)
  const [loadingId, setLoadingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [sessions, setSessions] = React.useState<SessionRecordSummary[]>([])

  const loadHistory = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await listSessions(40)
      setSessions(records)
    } catch (err) {
      setSessions([])
      setError(
        err instanceof Error ? err.message : "Could not load session history",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  const groups = React.useMemo(() => groupSessions(sessions), [sessions])

  const handleSelect = async (id: string) => {
    setLoadingId(id)
    setError(null)
    try {
      const record = await getSession(id)
      loadSessionRecord(record)
      if (record.status === "complete" && record.steps.length > 0) {
        startReplay()
      }
      onSessionActivated(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load session")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-sh-border px-3">
        <div className="flex min-w-0 items-center gap-1">
          <AgentRailTrigger open onToggle={onClose} />
          <p className="font-sans text-[13px] font-semibold text-sh-text">
            Past jobs
          </p>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex flex-col gap-1 p-1" aria-label="Loading past jobs">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg px-2 py-2.5">
                <span className="size-4 shrink-0 animate-pulse rounded-full bg-sh-surface" />
                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="h-2.5 w-4/5 animate-pulse rounded-md bg-sh-surface" />
                  <span className="h-2 w-1/3 animate-pulse rounded-md bg-sh-surface" />
                </span>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
            <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-sh-surface text-sh-text-muted">
              <HistoryIcon className="size-4" aria-hidden />
            </span>
            <p className="font-sans text-[13px] text-sh-text">
              {error ? "Couldn’t load past jobs" : "No past jobs yet"}
            </p>
            <p className="mt-1 max-w-52 font-sans text-[12px] leading-relaxed text-sh-text-muted">
              {error ?? "Finished jobs are saved here so you can replay them."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <section key={group.label} className="flex flex-col gap-0.5">
                <h3 className="px-2 py-1 font-sans text-[11.5px] font-semibold text-sh-text-muted">
                  {group.label}
                </h3>
                <ul className="flex list-none flex-col gap-0.5">
                  {group.items.map((session) => {
                    const selected = session.id === activeSessionId
                    const busy = loadingId === session.id
                    const stamp = formatSessionWhen(
                      session.endedAt ?? session.startedAt,
                    )
                    return (
                      <li key={session.id}>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void handleSelect(session.id)}
                          className={cn(
                            "flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2.5 text-left transition-[background-color,transform] duration-150 ease-out active:scale-[0.99]",
                            "hover:bg-sh-surface focus-visible:bg-sh-surface focus-visible:ring-2 focus-visible:ring-sh-steer/40 focus-visible:outline-none",
                            selected && "bg-sh-steer-fill hover:bg-sh-steer-fill",
                            busy && "opacity-70",
                          )}
                        >
                          <span className="mt-0.5">
                            {busy ? (
                              <Loader2Icon className="size-4 shrink-0 animate-spin text-sh-text-muted" />
                            ) : (
                              <SessionStatusIcon status={session.status} />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 font-sans text-[12.5px] leading-snug text-sh-text">
                              {session.goal.trim() || "Untitled job"}
                            </span>
                            <span className="mt-1 block font-sans text-[11px] tabular-nums text-sh-text-muted">
                              {stamp}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
            {error ? (
              <p role="alert" className="px-2 font-sans text-[12px] text-sh-error">
                {error}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
