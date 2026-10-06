"use client"

import type * as React from "react"
import {
  Building2Icon,
  CalendarDaysIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type ResultTone = "neutral" | "success" | "warning" | "error"

/** Tinted fill + matching ink; used for icon tiles and status pills. */
export const TONE_FILL: Record<ResultTone, string> = {
  neutral: "bg-sh-surface text-sh-text-muted",
  success: "bg-sh-success-fill text-sh-accent-green",
  warning: "bg-sh-warning-fill text-sh-warning",
  error: "bg-sh-error-fill text-sh-error",
}

const TONE_TEXT: Record<ResultTone, string> = {
  neutral: "text-sh-text",
  success: "text-sh-accent-green",
  warning: "text-sh-warning",
  error: "text-sh-error",
}

const TONE_ICON: Record<ResultTone, LucideIcon> = {
  neutral: CircleIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  error: CircleAlertIcon,
}

/** Tone that only escalates when there is something to act on. */
export function toneWhen(count: number, tone: ResultTone): ResultTone {
  return count > 0 ? tone : "neutral"
}

export function IconTile({
  icon: Icon,
  tone = "neutral",
  className,
}: {
  icon: LucideIcon
  tone?: ResultTone
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg",
        TONE_FILL[tone],
        className,
      )}
    >
      <Icon className="size-3.5" />
    </span>
  )
}

export function ResultContext({
  clientName,
  period,
  children,
}: {
  clientName: string
  period: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sh-text">
          <Building2Icon className="size-3.5 text-sh-text-muted" aria-hidden />
          {clientName}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-sh-text-muted">
          <CalendarDaysIcon className="size-3.5" aria-hidden />
          {period}
        </span>
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}

export type StatItem = {
  label: string
  value: string
  icon: LucideIcon
  tone?: ResultTone
}

const STAT_COLUMNS = {
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 xl:grid-cols-4",
} as const

export function StatGrid({ items }: { items: StatItem[] }) {
  const columns = items.length >= 4 ? STAT_COLUMNS[4] : STAT_COLUMNS[3]
  return (
    <dl className={cn("grid gap-3", columns)}>
      {items.map(({ label, value, icon, tone = "neutral" }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-xl border border-sh-border bg-sh-surface-raised p-4"
        >
          <dt className="flex items-center gap-2 text-[12px] font-medium text-sh-text-muted">
            <IconTile icon={icon} tone={tone} className="size-6 rounded-md" />
            {label}
          </dt>
          <dd
            className={cn(
              "font-mono text-[20px] font-semibold tracking-tight tabular-nums",
              TONE_TEXT[tone],
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function CountChip({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sh-surface px-1.5 font-mono text-[11px] font-medium tabular-nums text-sh-text-muted">
      {count}
    </span>
  )
}

export function ResultSection({
  title,
  count,
  action,
  className,
  children,
}: {
  title: string
  count?: number
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <header className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold tracking-tight text-sh-text">
          {title}
          {count != null ? <CountChip count={count} /> : null}
        </h3>
        {action}
      </header>
      {children}
    </section>
  )
}

const LIST_PANEL: Record<ResultTone, string> = {
  neutral: "border-sh-border bg-sh-surface-raised",
  success: "border-transparent bg-sh-success-fill",
  warning: "border-transparent bg-sh-warning-fill",
  error: "border-transparent bg-sh-error-fill",
}

export function ActionList({
  items,
  tone = "neutral",
  icon,
}: {
  items: string[]
  tone?: ResultTone
  icon?: LucideIcon
}) {
  const Icon = icon ?? TONE_ICON[tone]
  const iconColor = tone === "neutral" ? "text-sh-accent-green" : TONE_TEXT[tone]

  return (
    <ul
      className={cn(
        "flex flex-col gap-2.5 rounded-xl border px-4 py-3.5",
        LIST_PANEL[tone],
      )}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-[13px] leading-relaxed text-sh-text"
        >
          <Icon
            className={cn("mt-[3px] size-3.5 shrink-0", iconColor)}
            aria-hidden
          />
          <span className="min-w-0 text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Shared table styling so every report table reads the same. */
export const resultTable = {
  frame: "overflow-hidden rounded-xl border border-sh-border bg-sh-surface-raised",
  /** Stacked tables share column widths so they line up section to section. */
  fixed: "min-w-[640px] table-fixed",
  headRow: "border-sh-border bg-sh-surface/70 hover:bg-sh-surface/70",
  head: "h-9 px-4 text-[11.5px] font-medium text-sh-text-muted",
  row: "border-sh-border transition-colors duration-150 hover:bg-sh-surface/60",
  cell: "px-4 py-3 text-[13px] text-sh-text",
  num: "px-4 py-3 text-right font-mono text-[12.5px] tabular-nums text-sh-text",
  muted: "font-mono text-[11.5px] text-sh-text-muted",
  warnRow: "bg-sh-warning-fill/45 hover:bg-sh-warning-fill/70",
  errorRow: "bg-sh-error-fill/45 hover:bg-sh-error-fill/70",
  successRow: "bg-sh-success-fill/45 hover:bg-sh-success-fill/70",
} as const

export function ResultTableFrame({ children }: { children: React.ReactNode }) {
  return <div className={resultTable.frame}>{children}</div>
}
