"use client"

import { Button } from "@/components/ui/button"
import { isSessionActive } from "@/lib/types/agent"
import { useAgentStore } from "@/store/agent.store"
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react"

type SessionControlsProps = {
  compact?: boolean
}

export function SessionControls({ compact = false }: SessionControlsProps) {
  const status = useAgentStore((s) => s.status)
  const pauseTask = useAgentStore((s) => s.pauseTask)
  const resumeTask = useAgentStore((s) => s.resumeTask)
  const stopTask = useAgentStore((s) => s.stopTask)

  if (!isSessionActive(status)) {
    return null
  }

  const size = compact ? "xs" : "sm"

  return (
    <div className="flex items-center gap-1.5">
      {status === "running" ? (
        <Button
          type="button"
          variant="outline"
          size={size}
          onClick={pauseTask}
        >
          <PauseIcon data-icon="inline-start" className="size-3.5" />
          Pause
        </Button>
      ) : null}
      {status === "paused" ? (
        <Button type="button" size={size} onClick={resumeTask}>
          <PlayIcon data-icon="inline-start" className="size-3.5" />
          Resume
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={stopTask}
      >
        <SquareIcon data-icon="inline-start" className="size-3 fill-current" />
        Stop
      </Button>
    </div>
  )
}
