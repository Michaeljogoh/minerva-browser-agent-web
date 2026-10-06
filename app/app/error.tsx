"use client"

import { useEffect } from "react"

import { WorkspaceFallback } from "@/components/agent-workspace/shell/workspace-fallback"

type WorkspaceErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function WorkspaceError({ error, reset }: WorkspaceErrorProps) {
  useEffect(() => {
    console.error("[workspace]", error)
  }, [error])

  return (
    <WorkspaceFallback
      title="Something went wrong"
      description="The agent workspace failed to load. You can try again or return to the home page."
      action={{
        label: "Try again",
        onClick: reset,
      }}
    />
  )
}
