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
      <div className="space-y-1.5 px-0.5">
        <p className="font-sans text-[14px] font-semibold leading-snug tracking-tight text-sh-text">
          Pick a job you already do
        </p>
        <p className="font-sans text-[12px] leading-relaxed text-sh-text-muted">
          Watch every site it opens. Pause, steer, or take over to sign in.
          Nothing posts, files, or refunds without you.
        </p>
      </div>
      <div className="motion-stagger flex flex-col gap-2.5">
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
              className="group cursor-pointer rounded-2xl border border-sh-border bg-sh-surface-raised p-3.5 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-[color-mix(in_srgb,var(--sh-border),var(--sh-accent-green)_45%)] active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-sh-steer/35 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sh-steer-fill text-sh-accent-green transition-colors duration-150 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-sans text-[13px] font-semibold tracking-tight text-sh-text">
                    {template.label}
                    <ArrowRightIcon
                      className="size-3.5 shrink-0 -translate-x-1 text-sh-accent-green opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-1 block font-sans text-[12px] leading-snug text-sh-text-muted">
                    {template.description}
                  </span>
                  <span className="mt-2 block font-sans text-[11.5px] font-medium text-sh-accent-green">
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
