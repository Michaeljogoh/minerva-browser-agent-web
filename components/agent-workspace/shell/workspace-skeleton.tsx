import type { CSSProperties } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function HeaderSkeleton() {
  return (
    <header
      aria-hidden
      className="flex h-(--header-height) shrink-0 items-center gap-3 border-b border-sh-border px-4"
    >
      <Skeleton className="h-5 w-28 bg-sh-surface-raised" />
      <Skeleton className="h-5 w-16 bg-sh-surface-raised" />
      <Skeleton className="ml-auto h-7 w-14 bg-sh-surface-raised" />
    </header>
  )
}

function AgentRailSkeleton({ open }: { open: boolean }) {
  if (!open) {
    return null
  }

  return (
    <aside
      aria-hidden
      className="hidden w-(--agent-rail-width) shrink-0 flex-col border-r border-sh-border bg-sh-surface md:flex"
    >
      <div className="flex h-(--header-height) items-center border-b border-sh-border px-4">
        <Skeleton className="h-4 w-16 bg-sh-surface-raised" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-16 w-full bg-sh-surface-raised"
          />
        ))}
      </div>
    </aside>
  )
}

function TaskSidebarSkeleton({ open }: { open: boolean }) {
  if (!open) {
    return null
  }

  return (
    <aside
      aria-hidden
      className="hidden w-(--sidebar-width) shrink-0 flex-col border-l border-sh-border bg-sh-surface md:flex"
    >
      <div className="flex h-(--header-height) items-center border-b border-sh-border px-4">
        <Skeleton className="h-4 w-16 bg-sh-surface-raised" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Skeleton className="h-24 w-full bg-sh-surface-raised" />
        <Skeleton className="mt-auto h-20 w-full bg-sh-surface-raised" />
      </div>
    </aside>
  )
}

type WorkspaceSkeletonProps = {
  agentRailOpen?: boolean
  taskRailOpen?: boolean
}

export function WorkspaceSkeleton({
  agentRailOpen = false,
  taskRailOpen = true,
}: WorkspaceSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading agent workspace"
      className="flex h-svh min-h-svh flex-col bg-sh-bg"
      style={
        {
          "--header-height": "40px",
          "--sidebar-width": "380px",
          "--agent-rail-width": "280px",
        } as CSSProperties
      }
    >
      <HeaderSkeleton />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AgentRailSkeleton open={agentRailOpen} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Skeleton className="m-4 min-h-70 flex-1 rounded-lg bg-sh-surface-raised" />
          <Skeleton className="mx-4 mb-4 h-12 rounded-lg bg-sh-surface-raised" />
        </div>
        <TaskSidebarSkeleton open={taskRailOpen} />
      </div>
    </div>
  )
}
