"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
        "rounded-none border-sh-border font-mono text-[10px] capitalize",
        status === "missing" || status === "rejected" || status === "unmatched"
          ? "border-[var(--sh-error)] text-[var(--sh-error)]"
          : status === "proposed_match" ||
              status === "proposed" ||
              status === "found"
            ? "border-[var(--sh-warning)] text-[var(--sh-warning)]"
            : status === "cleared" ||
                status === "posted" ||
                status === "approved"
              ? "border-sh-accent-green text-sh-accent-green"
              : undefined,
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
      className="rounded-none border-[var(--sh-warning)] font-mono text-[10px] text-[var(--sh-warning)]"
    >
      tax
    </Badge>
  )
}
