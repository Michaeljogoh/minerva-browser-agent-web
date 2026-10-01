import { WorkspaceFallback } from "@/components/agent-workspace/shell/workspace-fallback"

export default function NotFound() {
  return (
    <WorkspaceFallback
      title="Page not found"
      description="This route does not exist. Browser Agents lives on the workspace home page."
      action={{
        label: "Back to workspace",
        href: "/",
      }}
    />
  )
}
