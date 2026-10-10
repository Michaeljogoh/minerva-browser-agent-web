import type { TaskType } from "@/lib/types/task-results"

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  month_end_exception: "Month-end exceptions",
  tax_code_delta: "Tax research brief",
  commerce_reconciliation: "Commerce reconciliation",
  bank_rec_diff: "Bank reconciliation",
  receipt_chase: "Receipt chase",
  quick_answer: "Quick answer",
}

export function formatUsd(amount?: number): string {
  if (amount == null || Number.isNaN(amount)) {
    return "-"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value?: string): string {
  if (!value) {
    return "-"
  }
  return value
}

export function formatDuration(ms: number): string {
  const seconds = Math.max(1, Math.round(ms / 1000))
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest === 0 ? `${minutes}m` : `${minutes}m ${rest}s`
}
