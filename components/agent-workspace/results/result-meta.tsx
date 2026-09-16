"use client"

import type { TaskResult } from "@/lib/types/task-results"

type ResultMetaProps = {
  result: TaskResult
}

export function ResultMeta({ result }: ResultMetaProps) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-wide text-sh-accent-green">
        Task complete
      </p>
      <p className="font-sans text-sm text-sh-text">{result.summary}</p>
      <p className="font-mono text-[10px] text-sh-text-muted">
        {result.totalSteps} steps ·{" "}
        {Math.round(result.totalExecutionTimeMs / 1000)}s
      </p>
      {result.followUpActions && result.followUpActions.length > 0 ? (
        <ul className="list-inside list-disc space-y-0.5 font-sans text-xs text-sh-text-muted">
          {result.followUpActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
