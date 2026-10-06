"use client"

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"
import { Check, MousePointer2, Pause, Play, ShieldCheck } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { BrowserFrame, EASE, Typewriter } from "./primitives"

const STEP_MS = 7000

/* ───────── scenes (each plays its animation on mount) ───────── */

function SceneDescribe() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-10">
      <div className="rounded-2xl border border-sh-border bg-sh-surface-raised p-4 shadow-sm">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-sh-text-muted">
          New task
        </div>
        <p className="min-h-[4.5rem] text-[15px] leading-relaxed">
          <Typewriter
            speed={22}
            delay={300}
            text="Reconcile last month's Shopify orders against Stripe payouts. Don't change any settings without asking me."
          />
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2 text-xs text-sh-text-muted">
            <span className="rounded-full border border-sh-border px-2.5 py-1">Planner on</span>
            <span className="rounded-full border border-sh-border px-2.5 py-1">Reconciliation</span>
          </div>
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1, 0.94, 1] }}
            transition={{ delay: 3.6, duration: 0.4, times: [0, 0.2, 0.6, 1] }}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Start task
          </motion.span>
        </div>
      </div>
    </div>
  )
}

function ScenePlan() {
  const steps = [
    "Sign in to Shopify admin",
    "Export orders, taxes, refunds",
    "Open Stripe payouts & fees",
    "Match orders to payouts",
    "Draft reconciliation table",
  ]
  return (
    <div className="flex h-full flex-col justify-center p-6 sm:p-10">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-sh-text-muted">
        Plan · 5 steps
      </div>
      <ol className="space-y-2.5">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.4, duration: 0.4, ease: EASE }}
            className="flex items-center gap-3 rounded-xl border border-sh-border bg-sh-surface-raised px-4 py-3 text-sm"
          >
            <span className="font-mono text-xs text-sh-text-muted">{i + 1}</span>
            <span className="flex-1">{s}</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.4, type: "spring", stiffness: 400, damping: 18 }}
              className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

function SceneBrowser() {
  return (
    <div className="flex h-full items-center p-5 sm:p-8">
      <BrowserFrame url="admin.shopify.com/orders?range=30d" className="relative w-full">
        <div className="relative space-y-3 p-5">
          <div className="text-xs text-sh-text-muted">Filter orders</div>
          <div className="flex h-10 items-center rounded-lg border border-sh-border bg-sh-bg px-3 text-sm">
            <Typewriter text="last 30 days · paid" speed={45} delay={900} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
            className="space-y-2"
          >
            {[72, 58, 84, 46].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 rounded bg-sh-surface" style={{ width: `${w}%` }} />
                <div className="h-2 w-10 rounded bg-primary/25" />
              </div>
            ))}
          </motion.div>
          <motion.div
            className="absolute left-0 top-0"
            initial={{ x: 260, y: 150, opacity: 0 }}
            animate={{
              x: [260, 120, 120, 300],
              y: [150, 62, 62, 128],
              opacity: [0, 1, 1, 1],
            }}
            transition={{ duration: 3.2, delay: 0.2, times: [0, 0.3, 0.6, 1], ease: EASE }}
          >
            <MousePointer2 className="size-5 fill-primary text-primary drop-shadow" />
            <motion.span
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="absolute -left-1 -top-1 size-5 rounded-full bg-primary/40"
            />
          </motion.div>
        </div>
      </BrowserFrame>
    </div>
  )
}

function SceneApproval() {
  const [approved, setApproved] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setApproved(true), 3600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="flex h-full items-center justify-center p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-full max-w-sm rounded-2xl border border-sh-border bg-sh-surface-raised p-5 shadow-xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-sh-warning">
            <ShieldCheck className="size-4" /> Approval needed
          </span>
          <svg viewBox="0 0 24 24" className="size-6 -rotate-90" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="none" className="stroke-sh-border" strokeWidth="2" />
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              className="stroke-sh-warning"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              initial={{ pathLength: 1 }}
              animate={{ pathLength: approved ? 0.4 : 0 }}
              transition={{ duration: approved ? 0.2 : 3.6, ease: "linear" }}
            />
          </svg>
        </div>
        <p className="text-[15px] leading-snug">
          Stripe is asking to download the payout report. Allow Minerva to export it?
        </p>
        <div className="mt-4 flex gap-2">
          <motion.button
            type="button"
            tabIndex={-1}
            animate={{ scale: approved ? [1, 0.93, 1] : 1 }}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300",
              approved
                ? "bg-sh-success-fill text-sh-accent-green-ink dark:text-sh-text"
                : "bg-primary text-primary-foreground",
            )}
          >
            {approved ? "Approved ✓" : "Approve"}
          </motion.button>
          <span className="rounded-lg border border-sh-border px-4 py-2 text-sm text-sh-text-muted">
            Deny
          </span>
        </div>
      </motion.div>
    </div>
  )
}

function SceneResult() {
  const rows = [
    ["Orders", "1,284", "ok"],
    ["Stripe fees", "$1,402.18", "ok"],
    ["Refunds", "$912.00", "ok"],
    ["Payout #4419", "−$37.50", "warn"],
  ] as const
  return (
    <div className="flex h-full flex-col justify-center gap-5 p-6 sm:p-10">
      <div className="overflow-hidden rounded-xl border border-sh-border bg-sh-surface-raised">
        {rows.map(([k, v, s], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.25, ease: EASE }}
            className="flex items-center justify-between border-b border-sh-border px-4 py-3 text-sm last:border-b-0"
          >
            <span className="text-sh-text-muted">{k}</span>
            <span
              className={cn(
                "font-mono tabular-nums",
                s === "warn" && "text-sh-warning",
              )}
            >
              {v}
              {s === "warn" && " · mismatch"}
            </span>
          </motion.div>
        ))}
      </div>
      <div>
        <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-sh-text-muted">
          <span>Session replay</span>
          <span>02:41</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-sh-surface">
          <motion.div
            className="h-full origin-left rounded-full bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.3, duration: 4.5, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  )
}

const STEPS: { title: string; body: string; scene: ReactNode }[] = [
  {
    title: "Describe the goal",
    body: "Tell Minerva what you need in plain English. No scripts, selectors, or flows to maintain.",
    scene: <SceneDescribe />,
  },
  {
    title: "It plans the work",
    body: "A planner breaks the goal into steps you can read before a single page loads.",
    scene: <ScenePlan />,
  },
  {
    title: "A real browser acts",
    body: "Minerva clicks, types, and navigates live sites while you watch the session stream.",
    scene: <SceneBrowser />,
  },
  {
    title: "You approve what matters",
    body: "Logins, downloads, and irreversible actions pause for a human decision, with context.",
    scene: <SceneApproval />,
  },
  {
    title: "Get results and replay",
    body: "Receive structured output with sources, and replay every step to audit the run.",
    scene: <SceneResult />,
  },
]

export function HowItWorks() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-25% 0px" })
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const playing = inView && !paused && !reduce

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [playing, active])

  return (
    <section id="how" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            How it works
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            From a sentence to a finished task, in five steps.
          </h2>
        </div>

        <div ref={ref} className="grid gap-8 lg:grid-cols-[22rem_1fr]">
          <div role="tablist" aria-label="How Minerva works" className="flex flex-col gap-1">
            {STEPS.map((s, i) => {
              const on = i === active
              return (
                <button
                  key={s.title}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative cursor-pointer rounded-xl px-4 py-4 text-left transition-colors duration-200",
                    on ? "bg-sh-surface-raised shadow-sm ring-1 ring-sh-border" : "hover:bg-sh-surface/70",
                  )}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "font-mono text-xs",
                        on ? "text-primary" : "text-sh-text-muted",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span className={cn("font-medium", !on && "text-sh-text-muted")}>
                      {s.title}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden pl-8 text-sm leading-relaxed text-sh-text-muted"
                      >
                        <span className="block pt-2">{s.body}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {on && (
                    <div className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-sh-border">
                      <motion.div
                        key={`${active}-${playing}`}
                        className="h-full origin-left bg-primary"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: playing ? 1 : 0 }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      />
                    </div>
                  )}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play animation" : "Pause animation"}
              className="mt-2 flex size-10 cursor-pointer items-center justify-center self-start rounded-full border border-sh-border text-sh-text-muted transition-colors hover:text-sh-text"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          </div>

          <div
            role="tabpanel"
            aria-live="off"
            className="relative min-h-[26rem] overflow-hidden rounded-2xl border border-sh-border bg-sh-surface/60"
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(var(--sh-grid) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="relative h-full min-h-[26rem]"
              >
                {STEPS[active].scene}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
