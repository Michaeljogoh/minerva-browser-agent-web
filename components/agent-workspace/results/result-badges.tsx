"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ERROR_STATUSES = new Set([
  "missing",
  "rejected",
  "unmatched",
  "mismatch",
  "missing_payout",
  "blocked",
])
const WARNING_STATUSES = new Set([
  "proposed_match",
  "proposed",
  "found",
  "needs_review",
])
const SUCCESS_STATUSES = new Set([
  "cleared",
  "posted",
  "approved",
  "matched",
  "ready",
])

function statusBadgeTone(status: string): string | undefined {
  if (ERROR_STATUSES.has(status)) {
    return "border-transparent bg-sh-error/10 text-sh-error"
  }
  if (WARNING_STATUSES.has(status)) {
    return "border-transparent bg-sh-warning-fill text-sh-warning"
  }
  if (SUCCESS_STATUSES.has(status)) {
    return "border-transparent bg-sh-success-fill text-sh-accent-green"
  }
  return undefined
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-sh-border font-sans text-[11px] capitalize",
        statusBadgeTone(status),
        className,
      )}
    >
      {status.replace("_", " ")}
    </Badge>
  )
}

export function TaxSensitiveBadge() {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-transparent bg-sh-warning-fill font-sans text-[11px] text-sh-warning"
    >
      Tax-sensitive
    </Badge>
  )
}
