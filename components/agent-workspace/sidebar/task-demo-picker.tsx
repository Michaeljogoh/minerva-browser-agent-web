"use client"

import { QUICK_TESTS, TASK_TEMPLATES } from "@/lib/constants/task-templates"
import { isGoalEditable } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import {
  ArrowRightIcon,
  ClipboardCheckIcon,
  ZapIcon,
  ScaleIcon,
  Table2Icon,
} from "lucide-react"

const DEMO_ICONS = {
  D1: ScaleIcon,
  D2: Table2Icon,
  D3: ClipboardCheckIcon,
} as const

export function TaskDemoPicker({ className }: { className?: string }) {
  const status = useAgentStore((s) => s.status)
  const setGoal = useAgentStore((s) => s.setGoal)
  const setTaskType = useAgentStore((s) => s.setTaskType)
  const editable = isGoalEditable(status)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="space-y-2">
        <p className="px-0.5 font-sans text-[11px] font-semibold tracking-wide text-sh-text-muted uppercase">
          Quick tests
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TESTS.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={!editable}
              title={t.proves}
              onClick={() => {
                setGoal(t.goal)
                setTaskType(undefined)
              }}
              className="group inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-sh-border bg-sh-surface-raised px-3 py-1.5 font-sans text-[12px] font-medium text-sh-text transition-[border-color,background-color,transform] duration-150 ease-out hover:border-primary/50 hover:bg-sh-steer-fill active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-sh-steer/35 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <ZapIcon className="size-3 text-sh-accent-green" aria-hidden />
              {t.label}
            </button>
          ))}
        </div>
        <p className="px-0.5 font-sans text-[11.5px] leading-snug text-sh-text-muted">
          Short, no sign-in. Each one checks a different part of the run.
        </p>
      </div>
    </div>
  )
}
