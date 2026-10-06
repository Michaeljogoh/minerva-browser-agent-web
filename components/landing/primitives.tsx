"use client"

import { animate, useInView, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export const EASE = [0.32, 0.72, 0, 1] as const

export function Typewriter({
  text,
  speed = 24,
  delay = 0,
  className,
}: {
  text: string
  speed?: number
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)

  useEffect(() => {
    if (reduce) return
    let i = 0
    let timer: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1
        setN(i)
        if (i >= text.length) clearInterval(timer)
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [text, speed, delay, reduce])

  return (
    <span className={className}>
      {text.slice(0, n)}
      {n < text.length && (
        <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current" />
      )}
    </span>
  )
}

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
}: {
  to: number
  decimals?: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: setV,
    })
    return () => c.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-sh-border bg-sh-surface-raised shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_24px_60px_-24px_rgba(4,120,87,0.25)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-sh-border bg-sh-surface px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-sh-border" />
          <span className="size-2.5 rounded-full bg-sh-border" />
          <span className="size-2.5 rounded-full bg-sh-border" />
        </div>
        <div className="flex-1 truncate rounded-md bg-sh-bg px-3 py-1 font-mono text-[11px] text-sh-text-muted">
          {url}
        </div>
      </div>
      {children}
    </div>
  )
}

export type TermLine = { node: ReactNode; tone?: "dim" | "ok" | "fail" | "cmd" }

export function Terminal({
  title,
  lines,
  className,
  step = 0.32,
}: {
  title: string
  lines: TermLine[]
  className?: string
  step?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? lines.length : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= lines.length) {
          clearInterval(id)
          return s
        }
        return s + 1
      })
    }, step * 1000)
    return () => clearInterval(id)
  }, [inView, reduce, lines.length, step])

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-sh-border bg-[#0b0f0e] text-[#d7e2dd] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[11px] text-white/45">{title}</span>
      </div>
      <div className="min-h-[18rem] space-y-1.5 p-4 font-mono text-[12.5px] leading-relaxed">
        {lines.slice(0, shown).map((l, i) => (
          <div
            key={i}
            className={cn(
              "animate-in fade-in slide-in-from-bottom-1 duration-300",
              l.tone === "dim" && "text-white/45",
              l.tone === "ok" && "text-emerald-400",
              l.tone === "fail" && "text-red-400",
              l.tone === "cmd" && "text-white",
            )}
          >
            {l.node}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-sh-text-muted">
      <span className="text-primary">{n}</span>
      <span className="h-px w-8 bg-sh-border" />
      <span>/ {label}</span>
    </div>
  )
}
