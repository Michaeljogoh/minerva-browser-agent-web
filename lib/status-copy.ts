import type { AgentStatus, ApprovalRequest } from "@/lib/types/agent"

/** Plain-language status for accountants, not agent internals. */
export function humanStatusLabel(
  status: AgentStatus,
  pendingApproval: ApprovalRequest | null,
): string {
  if (status === "approval_pending") {
    if (pendingApproval?.kind === "login") return "Your turn to sign in"
    if (pendingApproval?.kind === "connect") return "Connect an app"
    return "Needs your review"
  }
  switch (status) {
    case "idle":
      return "Ready"
    case "connecting":
      return "Opening the browser"
    case "running":
      return "Working"
    case "paused":
      return "Paused — waiting on you"
    case "complete":
      return "Done"
    case "error":
      return "Error"
    default:
      return status
  }
}

export function statusChipClass(status: AgentStatus): string {
  switch (status) {
    case "running":
      return "border-transparent bg-sh-success-fill text-sh-accent-green-ink"
    case "complete":
      return "border-transparent bg-sh-success-fill text-sh-accent-green-ink"
    case "connecting":
      return "border-transparent bg-sh-steer-fill text-sh-accent-green-ink"
    case "paused":
      return "border-transparent bg-sh-steer-fill text-sh-accent-green-ink"
    case "approval_pending":
      return "border-transparent bg-sh-warning-fill text-sh-warning"
    case "error":
      return "border-transparent bg-sh-error/10 text-sh-error"
    default:
      return "border-sh-border bg-sh-surface-raised text-sh-text-muted"
  }
}
