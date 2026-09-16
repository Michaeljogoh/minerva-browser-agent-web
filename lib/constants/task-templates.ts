import { TAX_DELTA_DEFAULT_GOAL } from "@/lib/types/agent"
import type { TaskType } from "@/lib/types/task-results"

export interface TaskTemplate {
  id: string
  label: string
  taskType: TaskType
  goal: string
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "T2",
    label: "Tax Delta",
    taskType: "tax_code_delta",
    goal: TAX_DELTA_DEFAULT_GOAL,
  },
]
