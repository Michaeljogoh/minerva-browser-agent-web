"use client"

import * as React from "react"

export function useShortcutLabel(
  key: string,
  options?: { alt?: boolean; shift?: boolean },
): string {
  const [label, setLabel] = React.useState(() =>
    formatShortcutLabel(key, options),
  )

  React.useEffect(() => {
    setLabel(formatShortcutLabel(key, options))
  }, [key, options?.alt, options?.shift])

  return label
}

export function formatShortcutLabel(
  key: string,
  options?: { alt?: boolean; shift?: boolean },
): string {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)

  const parts: string[] = isMac ? ["⌘"] : ["Ctrl"]
  if (options?.alt) {
    parts.push(isMac ? "⌥" : "Alt")
  }
  if (options?.shift) {
    parts.push(isMac ? "⇧" : "Shift")
  }
  parts.push(key.length === 1 ? key.toUpperCase() : key)

  return parts.join(isMac ? "" : "+")
}
