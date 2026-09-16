"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const BOTTOM_THRESHOLD_PX = 48

export function useTimelineScroll(stepCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pinnedToBottom, setPinnedToBottom] = useState(true)
  const [showNewPill, setShowNewPill] = useState(false)

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) {
      return
    }
    el.scrollTop = el.scrollHeight
    setPinnedToBottom(true)
    setShowNewPill(false)
  }, [])

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) {
      return
    }
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD_PX
    setPinnedToBottom(atBottom)
    if (atBottom) {
      setShowNewPill(false)
    }
  }, [])

  useEffect(() => {
    if (pinnedToBottom) {
      scrollToBottom()
    } else if (stepCount > 0) {
      setShowNewPill(true)
    }
  }, [stepCount, pinnedToBottom, scrollToBottom])

  return { scrollRef, onScroll, scrollToBottom, showNewPill }
}
