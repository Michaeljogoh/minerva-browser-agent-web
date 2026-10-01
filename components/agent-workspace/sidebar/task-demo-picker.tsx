"use client"

import { TASK_TEMPLATES } from "@/lib/constants/task-templates"
import { isGoalEditable } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import {
  ClipboardCheckIcon,
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
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="space-y-1.5 px-0.5">
        <p className="font-sans text-[12px] font-semibold leading-snug tracking-tight text-sh-text">
          Pick a job you already do
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-sh-text-muted">
          Watch every site it opens. Pause, steer, or take over to sign in.
          Nothing posts, files, or refunds without you.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {TASK_TEMPLATES.map((template) => {
          const Icon = DEMO_ICONS[template.id as keyof typeof DEMO_ICONS] ?? ScaleIcon
          return (
            <button
              key={template.id}
              type="button"
              disabled={!editable}
              onClick={() => {
                setGoal(template.goal)
                setTaskType(template.taskType)
              }}
              className="group rounded-2xl border border-sh-border bg-sh-surface-raised px-3 py-3 text-left shadow-[0_1px_0_rgba(10,15,13,0.03)] transition-[border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-sh-steer/40 hover:bg-sh-steer-fill/50 hover:shadow-[0_8px_24px_-16px_rgba(0,166,126,0.45)] focus-visible:ring-2 focus-visible:ring-sh-steer/35 disabled:opacity-50 dark:shadow-none dark:hover:shadow-none"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sh-steer-fill text-sh-steer">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-[12px] font-medium tracking-tight text-sh-text">
                    {template.label}
                  </span>
                  <span className="mt-0.5 block font-sans text-[11px] leading-snug text-sh-text-muted">
                    {template.description}
                  </span>
                  <span className="mt-1.5 block font-sans text-[11px] text-sh-steer">
                    {template.outcome}
                  </span>
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
