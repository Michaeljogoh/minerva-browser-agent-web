import type { TaskResult } from "@/lib/types/task-results"
import {
  EXTERNAL_PROVIDER_META,
  type ExternalModelProvider,
} from "@/lib/external-model"
import { formatAgentErrorMessage } from "@/lib/format-error"
import { formatDuration, TASK_TYPE_LABEL } from "@/lib/format-task-result"

export function agentErrorToastCopy(
  rawError: string,
  _opts?: {
    fatal?: boolean
    recoverable?: boolean
  },
): { title: string; description: string } {
  return {
    title: "Job hit a problem",
    description: formatAgentErrorMessage(rawError),
  }
}

export function connectionErrorToastCopy(): {
  title: string
  description: string
} {
  return {
    title: "Can't reach the server",
    description: "The agent server isn't responding. Retrying in the background.",
  }
}

export function modelKeySavedToastCopy(
  provider: ExternalModelProvider,
  model: string,
): { title: string; description: string } {
  return {
    title: `Using your ${EXTERNAL_PROVIDER_META[provider].label} key`,
    description: `New jobs run on ${model}. Remove the key when you're done testing.`,
  }
}

export function modelKeyRemovedToastCopy(
  provider: ExternalModelProvider,
): { title: string; description: string } {
  const meta = EXTERNAL_PROVIDER_META[provider]
  return {
    title: "Key removed from this browser",
    description: `Jobs use the built-in model again. Also delete the key at ${meta.deleteHint} if you no longer need it.`,
  }
}

export function taskCompleteToastCopy(result: TaskResult): {
  title: string
  description: string
} {
  const label = TASK_TYPE_LABEL[result.taskType] ?? "Job"
  const summary = result.summary?.trim()
  const steps =
    result.totalSteps > 0
      ? `${result.totalSteps} step${result.totalSteps === 1 ? "" : "s"}`
      : null

  const details = [steps, formatDuration(result.totalExecutionTimeMs)]
    .filter(Boolean)
    .join(" · ")

  return {
    title: `${label} finished`,
    description: summary
      ? `${summary}${details ? ` (${details})` : ""}`
      : `Open the Report tab to review the results${details ? ` · ${details}` : ""}.`,
  }
}
