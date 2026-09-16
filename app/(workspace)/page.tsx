import { cookies } from "next/headers"

import { WorkspaceShell } from "@/components/agent-workspace/shell/workspace-shell"
import {
  AGENT_RAIL_COOKIE_NAME,
  TASK_RAIL_COOKIE_NAME,
  parseAgentRailCookie,
  parseTaskRailCookie,
} from "@/lib/rail-persistence"

export default async function WorkspacePage() {
  const cookieStore = await cookies()

  return (
    <WorkspaceShell
      initialAgentRailOpen={parseAgentRailCookie(
        cookieStore.get(AGENT_RAIL_COOKIE_NAME)?.value,
      )}
      initialTaskRailOpen={parseTaskRailCookie(
        cookieStore.get(TASK_RAIL_COOKIE_NAME)?.value,
      )}
    />
  )
}
