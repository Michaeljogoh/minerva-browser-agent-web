"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SquareIcon } from "lucide-react"

type TaskUserMessageProps = {
  content: string
  className?: string
  canStop?: boolean
  stopDisabled?: boolean
  onStop?: () => void
}

export function TaskUserMessage({
  content,
  className,
  canStop = false,
  stopDisabled = false,
  onStop,
}: TaskUserMessageProps) {
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
    <div className={cn("group flex items-start gap-2", className)}>
      <article
        ref={articleRef}
        className="relative min-w-0 flex-1 max-h-24 overflow-hidden rounded-xl border border-sh-border/80 bg-sh-surface-raised px-3 py-2 text-[13px] leading-snug text-sh-text"
      >
        <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
        {isOverflowing ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-sh-surface-raised from-30% to-transparent"
          />
        ) : null}
      </article>

      {canStop && onStop ? (
        <Button
          type="button"
          size="icon-sm"
          variant="destructive"
          disabled={stopDisabled}
          aria-label="Stop"
          onClick={onStop}
          className={cn(
            "mt-0.5 size-7 shrink-0 rounded-full border border-(--sh-error) bg-(--sh-error) text-white shadow-none hover:bg-(--sh-error)/90 hover:text-white",
            "opacity-0 pointer-events-none",
            "group-hover:opacity-100 group-hover:pointer-events-auto",
            "group-focus-within:opacity-100 group-focus-within:pointer-events-auto",
            "pointer-coarse:opacity-100 pointer-coarse:pointer-events-auto",
          )}
        >
          <SquareIcon className="size-3 fill-current stroke-none" />
        </Button>
      ) : null}
    </div>
  )
}
