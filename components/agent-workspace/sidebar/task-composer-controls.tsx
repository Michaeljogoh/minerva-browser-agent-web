"use client"

import { TASK_TEMPLATES } from "@/lib/constants/task-templates"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isSessionActive } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"
import {
  ChevronDownIcon,
  InfinityIcon,
  Settings2Icon,
  ZapIcon,
} from "lucide-react"

const SPEED_OPTIONS = [
  { value: 0.5, label: "0.5× Slow" },
  { value: 1, label: "1.0× Normal" },
  { value: 1.5, label: "1.5× Fast" },
  { value: 2, label: "2.0× Faster" },
  { value: 2.5, label: "2.5× Very fast" },
  { value: 3, label: "3.0× Max" },
] as const

function ComposerPill({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      disabled={disabled}
      className={cn(
        "h-7 gap-1 rounded-full bg-sh-bg px-2.5 font-mono text-[10px] text-sh-text-muted hover:bg-sh-surface-raised hover:text-sh-text disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export function TaskComposerControls() {
  const status = useAgentStore((s) => s.status)
  const taskType = useAgentStore((s) => s.taskType)
  const speed = useAgentStore((s) => s.speed)
  const stepMode = useAgentStore((s) => s.stepMode)
  const setGoal = useAgentStore((s) => s.setGoal)
  const setTaskType = useAgentStore((s) => s.setTaskType)
  const setSpeed = useAgentStore((s) => s.setSpeed)
  const setStepMode = useAgentStore((s) => s.setStepMode)
  const reset = useAgentStore((s) => s.reset)

  const active = isSessionActive(status)
  const selectedTask =
    TASK_TEMPLATES.find((template) => template.taskType === taskType)?.label ??
    "Task"
  const speedLabel =
    SPEED_OPTIONS.find((option) => option.value === speed)?.label ??
    `${speed.toFixed(1)}×`

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={active}
          className="outline-none"
          render={
            <ComposerPill disabled={active}>
              <InfinityIcon className="size-3.5 shrink-0" />
              <span className="max-w-24 truncate">{selectedTask}</span>
              <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
            </ComposerPill>
          }
        />
        <DropdownMenuContent
          align="start"
          className="min-w-44 rounded-lg border-sh-border bg-sh-surface p-1 text-sh-text shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
              Task
            </DropdownMenuLabel>
            {TASK_TEMPLATES.map((template) => (
              <DropdownMenuItem
                key={template.id}
                className="rounded-md font-mono text-xs focus:bg-sh-surface-raised"
                onClick={() => {
                  setGoal(template.goal)
                  setTaskType(template.taskType)
                }}
              >
                {template.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={active}
          className="outline-none"
          render={
            <ComposerPill disabled={active}>
              <ZapIcon className="size-3.5 shrink-0" />
              <span className="max-w-28 truncate">{speedLabel}</span>
              <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
            </ComposerPill>
          }
        />
        <DropdownMenuContent
          align="start"
          className="min-w-40 rounded-lg border-sh-border bg-sh-surface p-1 text-sh-text shadow-lg"
        >
          <DropdownMenuRadioGroup
            value={String(speed)}
            onValueChange={(value) => setSpeed(Number(value))}
          >
            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
              Speed
            </DropdownMenuLabel>
            {SPEED_OPTIONS.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={String(option.value)}
                className="rounded-md font-mono text-xs focus:bg-sh-surface-raised"
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={active && status !== "complete" && status !== "error"}
          className="outline-none"
          render={
            <ComposerPill
              disabled={active && status !== "complete" && status !== "error"}
              aria-label="Task settings"
            >
              <Settings2Icon className="size-3.5 shrink-0" />
              <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
            </ComposerPill>
          }
        />
        <DropdownMenuContent
          align="start"
          className="min-w-44 rounded-lg border-sh-border bg-sh-surface p-1 text-sh-text shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wide text-sh-text-muted">
              Settings
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={stepMode}
              disabled={active}
              className="rounded-md font-sans text-xs focus:bg-sh-surface-raised"
              onCheckedChange={setStepMode}
            >
              Step mode
            </DropdownMenuCheckboxItem>
            {status === "complete" || status === "error" ? (
              <>
                <DropdownMenuSeparator className="bg-sh-border" />
                <DropdownMenuItem
                  className="rounded-md font-mono text-xs focus:bg-sh-surface-raised"
                  onClick={reset}
                >
                  New task
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
