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
            className={cn("rounded-full text-sh-text cursor-pointer", open && "bg-sh-surface")}
            aria-label={open ? "Hide activity panel" : "Show activity panel"}
            aria-pressed={open}
            onClick={onToggle}
          >
            <BrainCircuitIcon className="size-5 cursor-pointer" />
          </Button>
        }
      />
      <TooltipContent
        side="bottom"
        showArrow={false}
        className="rounded-none border border-sh-border bg-sh-surface px-2.5 py-1.5 font-sans text-xs text-sh-text shadow-none"
      >
        Toggle activity ({shortcut})
      </TooltipContent>
    </Tooltip>
  )
}
