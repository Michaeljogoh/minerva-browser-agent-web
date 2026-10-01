import type { TaskResult } from "@/lib/types/task-results"
import { formatAgentErrorMessage } from "@/lib/format-error"

const TASK_TYPE_LABEL: Record<TaskResult["taskType"], string> = {
  month_end_exception: "Month-end exceptions",
  tax_code_delta: "Tax research brief",
  commerce_reconciliation: "Commerce reconciliation",
  bank_rec_diff: "Bank reconciliation",
  receipt_chase: "Receipt chase",
}

export function agentErrorToastCopy(
  rawError: string,
  _opts?: {
    fatal?: boolean
    recoverable?: boolean
  },
): { title: string; description: string } {
  return {
    title: "Error",
    description: formatAgentErrorMessage(rawError),
  }
}

export function taskCompleteToastCopy(result: TaskResult): {
  title: string
  description: string
} {
  const label = TASK_TYPE_LABEL[result.taskType] ?? "Job"
  const seconds = Math.max(1, Math.round(result.totalExecutionTimeMs / 1000))
  const summary = result.summary?.trim()
  const steps =
    result.totalSteps > 0
      ? `${result.totalSteps} step${result.totalSteps === 1 ? "" : "s"}`
      : null

  const details = [steps, `${seconds}s`].filter(Boolean).join(" · ")

  return {
    title: `${label} finished`,
    description: summary
      ? `${summary}${details ? ` (${details})` : ""}`
      : `Open the Report tab to review the results${details ? ` · ${details}` : ""}.`,
  }
}
