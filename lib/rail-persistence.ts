export const AGENT_RAIL_COOKIE_NAME = "agent_rail_state"
export const TASK_RAIL_COOKIE_NAME = "task_rail_state"

export const RAIL_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

/** Parse a rail cookie; missing cookie uses `defaultOpen`. */
export function parseRailCookie(
  value: string | undefined,
  defaultOpen: boolean,
): boolean {
  if (value === undefined) {
    return defaultOpen
  }
  return value === "true"
}

export function parseAgentRailCookie(value: string | undefined): boolean {
  return parseRailCookie(value, false)
}

export function parseTaskRailCookie(value: string | undefined): boolean {
  return parseRailCookie(value, true)
}

export function readAgentRailCookie(): boolean {
  if (typeof document === "undefined") {
    return false
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AGENT_RAIL_COOKIE_NAME}=([^;]*)`),
  )
  return parseAgentRailCookie(match?.[1])
}

export function readTaskRailCookie(): boolean {
  if (typeof document === "undefined") {
    return true
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TASK_RAIL_COOKIE_NAME}=([^;]*)`),
  )
  return parseTaskRailCookie(match?.[1])
}

export function writeAgentRailCookie(open: boolean): void {
  document.cookie = `${AGENT_RAIL_COOKIE_NAME}=${open}; path=/; max-age=${RAIL_COOKIE_MAX_AGE}`
}

export function writeTaskRailCookie(open: boolean): void {
  document.cookie = `${TASK_RAIL_COOKIE_NAME}=${open}; path=/; max-age=${RAIL_COOKIE_MAX_AGE}`
}
