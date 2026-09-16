"use client"

import { Button } from "@/components/ui/button"
import { SquareTerminalIcon } from "lucide-react"

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
      variant="ghost"
      size="xs"
      aria-label={active ? "Hide sessions panel" : "Show sessions panel"}
      aria-pressed={active}
      className="gap-1.5 rounded-full border-transparent bg-sh-accent-green font-mono text-[10px] uppercase tracking-wide text-sh-bg hover:bg-sh-accent-green hover:text-sh-bg dark:text-white  dark:hover:bg-sh-accent-green"
      onClick={onToggle}
    >
      <SquareTerminalIcon className="size-3.5 shrink-0" />
      Sessions
    </Button>
  )
}
