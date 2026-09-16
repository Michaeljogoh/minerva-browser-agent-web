"use client"

import * as React from "react"

import { ConnectionBanner } from "@/components/agent-workspace/connection/connection-banner"
import {
  AgentRail,
  type LeftRailMode,
} from "@/components/agent-workspace/rail/agent-rail"
import { BrowserStage } from "@/components/agent-workspace/stage/browser-stage"
import { TaskSidebar } from "@/components/agent-workspace/sidebar/task-sidebar"
import { WorkspaceHeader } from "@/components/agent-workspace/shell/workspace-header"
import { useAgentRail } from "@/hooks/use-agent-rail"
import { useAgentSocket } from "@/hooks/use-agent-socket"
import { useSessionReplay } from "@/hooks/use-session-replay"
import { useTaskRail } from "@/hooks/use-task-rail"

type WorkspaceShellProps = {
  initialAgentRailOpen?: boolean
  initialTaskRailOpen?: boolean
}

export function WorkspaceShell({
  initialAgentRailOpen,
  initialTaskRailOpen,
}: WorkspaceShellProps) {
  useAgentSocket()
  useSessionReplay()

  const [leftRailMode, setLeftRailMode] =
    React.useState<LeftRailMode>("agent")
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    null,
  )

  const toggleAgentModeRef = React.useRef<() => void>(() => {})

  const { open: agentRailOpen, setOpen: setAgentRailOpen } = useAgentRail(
    initialAgentRailOpen,
    () => toggleAgentModeRef.current(),
  )
  const { open: taskRailOpen, setOpen: setTaskRailOpen, toggle: toggleTaskRail } =
    useTaskRail(initialTaskRailOpen)

  const toggleAgentMode = React.useCallback(() => {
    if (agentRailOpen && leftRailMode === "agent") {
      setAgentRailOpen(false)
      return
    }
    setLeftRailMode("agent")
    setAgentRailOpen(true)
  }, [agentRailOpen, leftRailMode, setAgentRailOpen])

  const toggleSessionsMode = React.useCallback(() => {
    if (agentRailOpen && leftRailMode === "sessions") {
      setAgentRailOpen(false)
      return
    }
    setLeftRailMode("sessions")
    setAgentRailOpen(true)
  }, [agentRailOpen, leftRailMode, setAgentRailOpen])

  toggleAgentModeRef.current = toggleAgentMode

  return (
    <div
      aria-label="Minerva Agent Workspace"
      className="flex h-svh min-h-svh flex-col bg-sh-bg"
      style={
        {
          "--sidebar-width": "380px",
          "--header-height": "40px",
          "--agent-rail-width": "280px",
        } as React.CSSProperties
      }
    >
      <a
        href="#browser-stage"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:border focus:border-sh-border focus:bg-sh-surface focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-sh-text"
      >
        Skip to live browser
      </a>
      <ConnectionBanner />
      <WorkspaceHeader
        taskRailOpen={taskRailOpen}
        onTaskRailToggle={toggleTaskRail}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AgentRail
          open={agentRailOpen}
          onOpenChange={setAgentRailOpen}
          mode={leftRailMode}
          activeSessionId={activeSessionId}
          onSessionActivated={(id) => {
            setActiveSessionId(id)
            setLeftRailMode("agent")
            setAgentRailOpen(true)
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <BrowserStage />
        </div>
        <TaskSidebar
          open={taskRailOpen}
          onOpenChange={setTaskRailOpen}
          agentModeActive={agentRailOpen && leftRailMode === "agent"}
          onAgentRailToggle={toggleAgentMode}
          sessionsModeActive={agentRailOpen && leftRailMode === "sessions"}
          onSessionsToggle={toggleSessionsMode}
        />
      </div>
    </div>
  )
}
