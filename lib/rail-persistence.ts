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

function readCookieValue(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1]
}

function writeRailCookie(name: string, open: boolean): void {
  document.cookie = `${name}=${open}; path=/; max-age=${RAIL_COOKIE_MAX_AGE}`
}

export function readAgentRailCookie(): boolean {
  return parseAgentRailCookie(readCookieValue(AGENT_RAIL_COOKIE_NAME))
}

export function readTaskRailCookie(): boolean {
  return parseTaskRailCookie(readCookieValue(TASK_RAIL_COOKIE_NAME))
}

export function writeAgentRailCookie(open: boolean): void {
  writeRailCookie(AGENT_RAIL_COOKIE_NAME, open)
}

export function writeTaskRailCookie(open: boolean): void {
  writeRailCookie(TASK_RAIL_COOKIE_NAME, open)
}
