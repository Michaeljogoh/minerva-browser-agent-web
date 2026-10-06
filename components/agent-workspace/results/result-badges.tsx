"use client"

import {
  TONE_FILL,
  type ResultTone,
} from "@/components/agent-workspace/results/result-primitives"
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

function statusTone(status: string): ResultTone {
  if (ERROR_STATUSES.has(status)) {
    return "error"
  }
  if (WARNING_STATUSES.has(status)) {
    return "warning"
  }
  if (SUCCESS_STATUSES.has(status)) {
    return "success"
  }
  return "neutral"
}

const PILL =
  "h-6 gap-1.5 rounded-full border-transparent px-2.5 font-sans text-[11.5px] font-semibold"

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
      className={cn(PILL, "capitalize", TONE_FILL[statusTone(status)], className)}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {status.replaceAll("_", " ")}
    </Badge>
  )
}

export function TaxSensitiveBadge() {
  return (
    <Badge
      variant="outline"
      className={cn(PILL, TONE_FILL.warning)}
    >
      Tax-sensitive
    </Badge>
  )
}
