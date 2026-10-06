"use client"

import { Button } from "@/components/ui/button"
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
      variant={active ? "default" : "outline"}
      size="xs"
      aria-label={active ? "Hide activity" : "Show activity"}
      aria-pressed={active}
      className="h-7 gap-1.5 px-2.5 text-[12px]"
      onClick={onToggle}
    >
      <ActivityIcon className="size-3.5 shrink-0" />
      Activity
    </Button>
  )
}
