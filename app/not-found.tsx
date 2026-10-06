import { WorkspaceFallback } from "@/components/agent-workspace/shell/workspace-fallback"

export default function NotFound() {
  return (
    <WorkspaceFallback
      title="Page not found"
      description="This route does not exist. The workspace lives at /app."
      action={{
        label: "Back to workspace",
        href: "/app",
      }}
    />
  )
}
