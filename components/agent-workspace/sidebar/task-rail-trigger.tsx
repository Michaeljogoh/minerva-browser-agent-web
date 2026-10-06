"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useShortcutLabel } from "@/hooks/use-shortcut-label"
import { cn } from "@/lib/utils"
import { BotMessageSquareIcon, BrainCircuitIcon } from "lucide-react"

type TaskRailTriggerProps = {
  open: boolean
  onToggle: () => void
  /** Navbar keeps chat icon; sidebar header uses agent branding. */
  appearance?: "chat" | "agent"
}

export function TaskRailTrigger({
  open,
  onToggle,
  appearance = "chat",
}: TaskRailTriggerProps) {
  const shortcut = useShortcutLabel("L", { alt: true })
  const isAgent = appearance === "agent"
  const label = isAgent ? "Agent" : "Chat"

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn("rounded-full text-sh-text", open && "bg-sh-surface text-sh-accent-green")}
            aria-label={open ? `Hide ${label.toLowerCase()} panel` : `Show ${label.toLowerCase()} panel`}
            aria-pressed={open}
            onClick={onToggle}
          >
            {isAgent ? (
              <BrainCircuitIcon className="size-[18px]" />
            ) : (
              <BotMessageSquareIcon className="size-[18px]" />
            )}
          </Button>
        }
      />
      <TooltipContent
        side="bottom"
        showArrow={false}
        className="rounded-lg border border-sh-border bg-sh-surface-raised px-2.5 py-1.5 font-sans text-xs text-sh-text"
      >
        Toggle {label} ({shortcut})
      </TooltipContent>
    </Tooltip>
  )
}
