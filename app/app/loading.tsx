import { cookies } from "next/headers"

import { WorkspaceSkeleton } from "@/components/agent-workspace/shell/workspace-skeleton"
import {
  AGENT_RAIL_COOKIE_NAME,
  TASK_RAIL_COOKIE_NAME,
  parseAgentRailCookie,
  parseTaskRailCookie,
} from "@/lib/rail-persistence"

export default async function WorkspaceLoading() {
  const cookieStore = await cookies()

  return (
    <WorkspaceSkeleton
      agentRailOpen={parseAgentRailCookie(
        cookieStore.get(AGENT_RAIL_COOKIE_NAME)?.value,
      )}
      taskRailOpen={parseTaskRailCookie(
        cookieStore.get(TASK_RAIL_COOKIE_NAME)?.value,
      )}
    />
  )
}
