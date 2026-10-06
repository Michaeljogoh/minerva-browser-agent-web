"use client"

import { Button } from "@/components/ui/button"
import { HistoryIcon } from "lucide-react"

type SessionsRailTriggerProps = {
  active: boolean
  onToggle: () => void
}

export function SessionsRailTrigger({
  active,
  onToggle,
}: SessionsRailTriggerProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="xs"
      aria-label={active ? "Hide past jobs" : "Show past jobs"}
      aria-pressed={active}
      className="h-7 gap-1.5 px-2.5 text-[12px]"
      onClick={onToggle}
    >
      <HistoryIcon className="size-3.5 shrink-0" />
      Past jobs
    </Button>
  )
}
