"use client"

import * as React from "react"

import { ModelKeyDialog } from "@/components/agent-workspace/sidebar/model-key-dialog"
import { TASK_TEMPLATES } from "@/lib/constants/task-templates"
import { EXTERNAL_PROVIDER_META } from "@/lib/external-model"
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
  selectActiveModel,
  useModelSettingsStore,
} from "@/store/model-settings.store"
import { ChevronDownIcon, KeyRoundIcon, Settings2Icon } from "lucide-react"

const SPEED_OPTIONS = [
  { value: 0.5, label: "Slower" },
  { value: 1, label: "Normal" },
  { value: 1.5, label: "Faster" },
  { value: 2, label: "Very fast" },
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
        "h-7 gap-1 rounded-full bg-sh-surface px-2.5 font-sans text-[12px] font-medium text-sh-text hover:bg-[color-mix(in_srgb,var(--sh-surface),var(--sh-text)_7%)] hover:text-sh-text focus-visible:ring-2 focus-visible:ring-sh-steer/40 disabled:opacity-50 dark:hover:bg-[color-mix(in_srgb,var(--sh-surface),var(--sh-text)_7%)]",
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
  const modelOptions = useModelSettingsStore((s) => s.options)
  const storedModel = useModelSettingsStore((s) => s.stored)
  const activeModel = useModelSettingsStore(selectActiveModel)
  const hydrateModel = useModelSettingsStore((s) => s.hydrate)
  const setModelActive = useModelSettingsStore((s) => s.setActive)
  const [keyDialogOpen, setKeyDialogOpen] = React.useState(false)

  React.useEffect(() => {
    void hydrateModel()
  }, [hydrateModel])

  const active = isSessionActive(status)
  const storedModelAllowed =
    storedModel != null &&
    (modelOptions?.models[storedModel.provider].includes(storedModel.model) ??
      false)
  const selectedTask =
    TASK_TEMPLATES.find((template) => template.taskType === taskType)?.shortLabel ??
    "Jobs"

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={active}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sh-steer/40"
          render={
            <ComposerPill disabled={active}>
              <span className="max-w-28 truncate">{selectedTask}</span>
              <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
            </ComposerPill>
          }
        />
        <DropdownMenuContent
          align="start"
          className="min-w-64 rounded-xl border-sh-border bg-sh-surface-raised p-1 text-sh-text shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-sans text-[11px] text-sh-text-muted">
              Accounting jobs
            </DropdownMenuLabel>
            {TASK_TEMPLATES.map((template) => (
              <DropdownMenuItem
                key={template.id}
                className="flex flex-col items-start gap-0.5 rounded-lg py-2 font-sans text-xs focus:bg-sh-surface"
                onClick={() => {
                  setGoal(template.goal)
                  setTaskType(template.taskType)
                }}
              >
                <span className="font-sans text-sh-text">{template.label}</span>
                <span className="font-sans text-[11px] text-sh-text-muted">
                  {template.outcome}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={active && status !== "complete" && status !== "error"}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sh-steer/40"
          render={
            <ComposerPill
              disabled={active && status !== "complete" && status !== "error"}
              aria-label="More settings"
            >
              <Settings2Icon className="size-3.5 shrink-0" />
            </ComposerPill>
          }
        />
        <DropdownMenuContent
          align="start"
          className="min-w-64 rounded-xl border-sh-border bg-sh-surface-raised p-1 text-sh-text shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-sans text-[11px] text-sh-text-muted">
              Pace
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={String(speed)}
              onValueChange={(value) => setSpeed(Number(value))}
            >
              {SPEED_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={String(option.value)}
                  disabled={active}
                  className="rounded-lg font-sans text-xs focus:bg-sh-surface"
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator className="bg-sh-border" />
            <DropdownMenuCheckboxItem
              checked={stepMode}
              disabled={active}
              className="rounded-lg font-sans text-xs focus:bg-sh-surface"
              onCheckedChange={setStepMode}
            >
              Pause after each step
            </DropdownMenuCheckboxItem>
            {modelOptions?.enabled ? (
              <>
                <DropdownMenuSeparator className="bg-sh-border" />
                <DropdownMenuLabel className="font-sans text-[11px] text-sh-text-muted">
                  Model
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={activeModel ? "external" : "internal"}
                  onValueChange={(value) => setModelActive(value === "external")}
                >
                  <DropdownMenuRadioItem
                    value="internal"
                    disabled={active}
                    className="rounded-lg font-sans text-xs focus:bg-sh-surface"
                  >
                    Built-in model
                  </DropdownMenuRadioItem>
                  {storedModel ? (
                    <DropdownMenuRadioItem
                      value="external"
                      disabled={active || !storedModelAllowed}
                      className="rounded-lg font-sans text-xs focus:bg-sh-surface"
                    >
                      <span className="truncate">
                        Your {EXTERNAL_PROVIDER_META[storedModel.provider].label}{" "}
                        key · {storedModel.model}
                      </span>
                    </DropdownMenuRadioItem>
                  ) : null}
                </DropdownMenuRadioGroup>
                <DropdownMenuItem
                  disabled={active}
                  className="rounded-lg font-sans text-xs focus:bg-sh-surface"
                  onClick={() => setKeyDialogOpen(true)}
                >
                  {storedModel ? "Manage API key…" : "Use your own API key…"}
                </DropdownMenuItem>
              </>
            ) : null}
            {status === "complete" || status === "error" ? (
              <>
                <DropdownMenuSeparator className="bg-sh-border" />
                <DropdownMenuItem
                  className="rounded-lg font-sans text-xs focus:bg-sh-surface"
                  onClick={reset}
                >
                  New job
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {activeModel ? (
        <ComposerPill
          disabled={active}
          aria-label={`Using your ${EXTERNAL_PROVIDER_META[activeModel.provider].label} key with ${activeModel.model}. Manage key`}
          onClick={() => setKeyDialogOpen(true)}
        >
          <KeyRoundIcon className="size-3 shrink-0" />
          <span className="max-w-28 truncate">{activeModel.model}</span>
        </ComposerPill>
      ) : null}

      <ModelKeyDialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen} />
    </div>
  )
}
