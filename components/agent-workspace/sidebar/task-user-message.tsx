"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TaskUserMessageProps = {
  content: string
  className?: string
}

export function TaskUserMessage({ content, className }: TaskUserMessageProps) {
  const articleRef = React.useRef<HTMLElement>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = articleRef.current
    if (!el) {
      return
    }

    const checkOverflow = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1)
    }

    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(el)
    return () => observer.disconnect()
  }, [content])

  return (
    <article
      ref={articleRef}
      className={cn(
        "relative max-h-24 overflow-hidden rounded-xl bg-sh-surface px-3.5 py-3 font-sans text-[12.5px] leading-relaxed tracking-tight text-sh-text",
        className,
      )}
    >
      <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
      {isOverflowing ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-sh-surface from-30% to-transparent"
        />
      ) : null}
    </article>
  )
}
