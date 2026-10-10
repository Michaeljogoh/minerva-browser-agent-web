"use client"

import type { QuickAnswerResult } from "@/lib/types/task-results"

/** Lookups and Q&A: the markdown summary is the answer; facts are a small key/value list. */
export function QuickAnswerResultView({ data }: { data: QuickAnswerResult }) {
  if (data.facts.length === 0) {
    return null
  }
  return (
    <dl className="grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 rounded-xl border border-sh-border bg-sh-surface-raised px-4 py-3.5 text-[13px]">
      {data.facts.map((fact) => (
        <div key={fact.label} className="col-span-2 grid grid-cols-subgrid">
          <dt className="text-sh-text-muted">{fact.label}</dt>
          <dd className="min-w-0 font-medium break-words text-sh-text">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
