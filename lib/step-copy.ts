import type { ReasoningStep } from "@/lib/types/agent"
import { formatAgentErrorMessage } from "@/lib/format-error"

function hostnameFromUnknown(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null
  }
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname
  } catch {
    return value
  }
}

function argString(args: Record<string, unknown> | undefined, key: string): string | null {
  const value = args?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : null
}

/** Plain-language labels so a non-technical reviewer can follow the agent. */
export function humanStepLabel(step: ReasoningStep): string {
  switch (step.type) {
    case "reasoning":
      return step.content.trim() || "Thinking through the next step"
    case "screenshot":
      return "Checking what the page looks like"
    case "approval":
      return step.content.trim() || "Waiting for you"
    case "error":
      return formatAgentErrorMessage(step.content) || "Something went wrong"
    case "observation":
      return step.tool === "extract"
        ? "Reading numbers from the page"
        : "Looking at what’s on the page"
    case "action":
      return actionLabel(step)
    default:
      return step.content
  }
}

function actionLabel(step: ReasoningStep): string {
  const tool = step.tool ?? ""
  const args = step.args
  switch (tool) {
    case "navigate": {
      const host = hostnameFromUnknown(args?.url)
      return host ? `Opening ${host}` : "Opening a website"
    }
    case "act":
      return argString(args, "instruction") ?? "Taking an action on the page"
    case "observe":
      return "Checking what can be clicked"
    case "extract":
      return "Pulling structured data from the page"
    case "screenshot":
      return "Capturing the current screen"
    case "ask_human":
      return argString(args, "question") ?? "Asking you to review"
    case "request_login":
      return `Handing you the browser to sign in${
        argString(args, "siteName") ? ` to ${argString(args, "siteName")}` : ""
      }`
    case "request_app_connection":
      return `Asking you to connect ${argString(args, "app") ?? "an app"}`
    case "composio_execute":
      return `Using connected ${argString(args, "app") ?? "app"} data`
    case "done":
      return "Wrapping up with a structured result"
    default:
      return step.content.trim() || (tool ? `Working: ${tool}` : "Working")
  }
}
