"use client"

import { BankRecResultView } from "@/components/agent-workspace/results/bank-rec-result"
import { MonthEndResultView } from "@/components/agent-workspace/results/month-end-result"
import { ReceiptChaseResultView } from "@/components/agent-workspace/results/receipt-chase-result"
import { ResultMeta } from "@/components/agent-workspace/results/result-meta"
import { TaxDeltaResultView } from "@/components/agent-workspace/results/tax-delta-result"
import type {
  BankRecDiffResult,
  MonthEndExceptionReport,
  ReceiptChaseResult,
  TaskResult,
  TaxCodeDeltaBriefResult,
} from "@/lib/types/task-results"
import { useAgentStore } from "@/store/agent.store"

function TaskResultBody({ result }: { result: TaskResult }) {
  switch (result.taskType) {
    case "month_end_exception":
      return (
        <MonthEndResultView
          data={result.extractedData as MonthEndExceptionReport}
        />
      )
    case "tax_code_delta":
      return (
        <TaxDeltaResultView
          data={result.extractedData as TaxCodeDeltaBriefResult}
        />
      )
    case "bank_rec_diff":
      return (
        <BankRecResultView data={result.extractedData as BankRecDiffResult} />
      )
    case "receipt_chase":
      return (
        <ReceiptChaseResultView
          data={result.extractedData as ReceiptChaseResult}
        />
      )
    default:
      return null
  }
}

function hasTaskResultBody(result: TaskResult): boolean {
  switch (result.taskType) {
    case "month_end_exception":
    case "tax_code_delta":
    case "bank_rec_diff":
    case "receipt_chase":
      return true
    default:
      return false
  }
}

type ResultSummaryProps = {
  /** When true, skip summary/duration meta (shown by the chat timeline instead). */
  hideMeta?: boolean
}

export function ResultSummary({ hideMeta = false }: ResultSummaryProps) {
  const status = useAgentStore((s) => s.status)
  const result = useAgentStore((s) => s.result)

  if (status !== "complete" || !result) {
    return null
  }

  if (hideMeta && !hasTaskResultBody(result)) {
    return null
  }

  return (
    <div className="max-h-96 space-y-3 overflow-y-auto rounded-none border border-sh-border bg-sh-surface p-3">
      {hideMeta ? null : <ResultMeta result={result} />}
      <TaskResultBody result={result} />
    </div>
  )
}
