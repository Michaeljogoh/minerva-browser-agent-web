"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ActivityIcon } from "lucide-react"

type ActivityRailTriggerProps = {
  active: boolean
  onToggle: () => void
}

export function ActivityRailTrigger({
  active,
  onToggle,
}: ActivityRailTriggerProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "secondary"}
      size="xs"
      aria-label={active ? "Hide activity" : "Show activity"}
      aria-pressed={active}
      className={cn(
        "gap-1.5 font-sans text-[12px] font-semibold",
        !active && "bg-sh-surface text-sh-text ring-1 ring-sh-border hover:bg-sh-surface-raised",
      )}
      onClick={onToggle}
    >
      <ActivityIcon className="size-3.5 shrink-0" />
      Activity
    </Button>
  )
}
