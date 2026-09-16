"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  readAgentRailCookie,
  writeAgentRailCookie,
} from "@/lib/rail-persistence"

export function useAgentRail(
  initialOpen?: boolean,
  shortcutToggle?: () => void,
) {
  const [open, setOpenState] = useState(() =>
    initialOpen !== undefined ? initialOpen : readAgentRailCookie(),
  )

  const shortcutRef = useRef(shortcutToggle)
  shortcutRef.current = shortcutToggle

  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setOpenState((prev) => {
      const next = typeof value === "function" ? value(prev) : value
      writeAgentRailCookie(next)
      return next
    })
  }, [])

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "j" &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey
      ) {
        event.preventDefault()
        if (shortcutRef.current) {
          shortcutRef.current()
        } else {
          toggle()
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggle])

  return { open, setOpen, toggle }
}
