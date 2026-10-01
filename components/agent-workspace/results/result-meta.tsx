"use client"

import type { TaskResult } from "@/lib/types/task-results"

type ResultMetaProps = {
  result: TaskResult
}

export function ResultMeta({ result }: ResultMetaProps) {
  return (
    <div className="space-y-2">
      <p className="font-sans text-[11px] font-medium tracking-wide text-sh-accent-green uppercase">
        Ready for your review
      </p>
      <p className="font-sans text-[14px] leading-snug font-medium text-sh-text">
        {result.summary}
      </p>
      <p className="font-sans text-[11px] text-sh-text-muted">
        {result.totalSteps} moves ·{" "}
        {Math.round(result.totalExecutionTimeMs / 1000)}s
      </p>
      {result.followUpActions && result.followUpActions.length > 0 ? (
        <ul className="list-inside list-disc space-y-0.5 font-sans text-[12px] text-sh-text-muted">
          {result.followUpActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
