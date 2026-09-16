/** Mirrors api/src/common/schemas/task-result.schemas.ts */

export type Confidence = "high" | "medium" | "low"

export type TaskType =
  | "month_end_exception"
  | "tax_code_delta"
  | "bank_rec_diff"
  | "receipt_chase"

export interface TaxCodeDeltaBriefResult {
  query: {
    topics: string[]
    lookbackDays: number
    clientName: string
    taxYear: number
  }
  findings: Array<{
    title: string
    date: string
    sourceUrl: string
    summary: string
  }>
  clientFacts: {
    equipmentSpendUsd?: number
    depreciationNotes?: string
    sourceUrl?: string
  }
  impact: {
    affected: boolean
    rationale: string
    estimatedSavingsUsd?: number
  }
  confidence: Confidence
}

export interface MonthEndExceptionReport {
  clientName: string
  period: string
  exceptions: Array<{
    id: string
    source: "bank_feed" | "fixed_assets" | "register" | "other"
    description: string
    amountUsd?: number
    date?: string
    proposedCategory?: string
    taxSensitive: boolean
    taxNote?: string
    taxSourceUrl?: string
    status: "proposed" | "approved" | "rejected" | "skipped"
    confidence: Confidence
  }>
  taxBrief?: TaxCodeDeltaBriefResult
  totals: {
    exceptionCount: number
    approvedCount: number
    rejectedCount: number
    taxFlagCount: number
  }
}

export interface BankRecDiffResult {
  clientName: string
  period: string
  rows: Array<{
    id: string
    side: "bank" | "books" | "matched"
    description: string
    amountUsd: number
    date: string
    proposedMatchId?: string
    status: "unmatched" | "proposed_match" | "cleared" | "rejected"
    confidence: Confidence
  }>
  totals: {
    bankOnlyCount: number
    booksOnlyCount: number
    matchedCount: number
    clearedCount: number
  }
}

export interface ReceiptChaseResult {
  clientName: string
  period: string
  items: Array<{
    id: string
    vendor?: string
    amountUsd?: number
    date?: string
    source: "inbox" | "stripe" | "upload" | "other"
    sourceUrl?: string
    proposedCategory?: string
    status: "found" | "proposed" | "posted" | "rejected" | "missing"
    confidence: Confidence
  }>
  totals: {
    foundCount: number
    postedCount: number
    missingCount: number
  }
}

export type TaskExtractedData =
  | MonthEndExceptionReport
  | TaxCodeDeltaBriefResult
  | BankRecDiffResult
  | ReceiptChaseResult

export interface TaskResult {
  taskType: TaskType
  summary: string
  extractedData: TaskExtractedData
  followUpActions?: string[]
  completedAt: number
  totalSteps: number
  totalExecutionTimeMs: number
}
