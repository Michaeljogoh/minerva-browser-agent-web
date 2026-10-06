"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useShortcutLabel } from "@/hooks/use-shortcut-label"
import { cn } from "@/lib/utils"
import { BrainCircuitIcon } from "lucide-react"

type AgentRailTriggerProps = {
  open: boolean
  onToggle: () => void
}

export function AgentRailTrigger({ open, onToggle }: AgentRailTriggerProps) {
  const shortcut = useShortcutLabel("J")

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn("rounded-full text-sh-text", open && "bg-sh-surface text-sh-accent-green")}
            aria-label={open ? "Hide activity panel" : "Show activity panel"}
            aria-pressed={open}
            onClick={onToggle}
          >
            <BrainCircuitIcon className="size-[18px]" />
          </Button>
        }
      />
      <TooltipContent
        side="bottom"
        showArrow={false}
        className="rounded-lg border border-sh-border bg-sh-surface-raised px-2.5 py-1.5 font-sans text-xs text-sh-text"
      >
        Toggle activity ({shortcut})
      </TooltipContent>
    </Tooltip>
  )
}
