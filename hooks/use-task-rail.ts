"use client"

import { useCallback, useEffect, useState } from "react"

import {
  readTaskRailCookie,
  writeTaskRailCookie,
} from "@/lib/rail-persistence"

export function useTaskRail(initialOpen?: boolean) {
  const [open, setOpenState] = useState(() =>
    initialOpen !== undefined ? initialOpen : readTaskRailCookie(),
  )

  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setOpenState((prev) => {
      const next = typeof value === "function" ? value(prev) : value
      writeTaskRailCookie(next)
      return next
    })
  }, [])

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "l" &&
        (event.metaKey || event.ctrlKey) &&
        event.altKey &&
        !event.shiftKey
      ) {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggle])

  return { open, setOpen, toggle }
}
