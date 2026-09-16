import { WorkspaceFallback } from "@/components/agent-workspace/shell/workspace-fallback"

export default function NotFound() {
  return (
    <WorkspaceFallback
      title="Page not found"
      description="This route does not exist. Minerva Agent lives on the workspace home page."
      action={{
        label: "Back to workspace",
        href: "/",
      }}
    />
  )
}
