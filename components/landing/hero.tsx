"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check, MousePointer2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { BrowserFrame, CountUp, EASE } from "./primitives"

const TIMELINE = [
  "Opened dashboard.stripe.com",
  "Pulled payouts · last 30 days",
  "Cross-checked 1,284 Shopify orders",
  "Waiting for your approval",
  "Reconciliation brief ready",
]

const CURSOR = [
  { x: 40, y: 40 },
  { x: 120, y: 92 },
  { x: 210, y: 150 },
  { x: 250, y: 214 },
  { x: 150, y: 250 },
  { x: 150, y: 250 },
]

function HeroDemo() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(reduce ? 5 : 0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setPhase((p) => (p >= 6 ? 0 : p + 1)), 1500)
    return () => clearInterval(id)
  }, [reduce])

  const p = Math.min(phase, 5)
  const url =
    p < 2 ? "dashboard.stripe.com/payouts" : "admin.shopify.com/orders"

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-10 bottom-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(4,120,87,0.18),transparent_70%)] blur-2xl"
      />
      <BrowserFrame url="minerva.app/app" className="text-left">
        <div className="grid min-h-[22rem] md:grid-cols-[17rem_1fr]">
          {/* timeline */}
          <div className="border-b border-sh-border bg-sh-surface/60 p-4 md:border-b-0 md:border-r">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-sh-text-muted">
              Live run
            </div>
            <ol className="space-y-2.5">
              {TIMELINE.map((t, i) => {
                const done = p > i || (p === 5 && i === 4)
                const active = p === i
                const visible = p >= i
                const approval = i === 3
                return (
                  <motion.li
                    key={t}
                    initial={false}
                    animate={{ opacity: visible ? 1 : 0.25, y: visible ? 0 : 4 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex items-start gap-2.5 text-[13px] leading-snug"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                        done && "border-primary bg-primary text-primary-foreground",
                        active && !approval && "border-primary",
                        active && approval && "border-sh-warning bg-sh-warning-fill",
                        !done && !active && "border-sh-border",
                      )}
                    >
                      {done ? (
                        <Check className="size-2.5" strokeWidth={3} />
                      ) : active ? (
                        <span
                          className={cn(
                            "size-1.5 animate-pulse rounded-full",
                            approval ? "bg-sh-warning" : "bg-primary",
                          )}
                        />
                      ) : null}
                    </span>
                    <span className={cn(active ? "text-sh-text" : "text-sh-text-muted")}>
                      {t}
                    </span>
                  </motion.li>
                )
              })}
            </ol>
          </div>

          {/* browser */}
          <div className="relative overflow-hidden p-5">
            <div className="mb-4 truncate rounded-md border border-sh-border bg-sh-bg px-3 py-1.5 font-mono text-[11px] text-sh-text-muted">
              {url}
            </div>
            <div className="space-y-2.5">
              {[0, 1, 2, 3, 4].map((r) => (
                <motion.div
                  key={r}
                  initial={false}
                  animate={{ opacity: p >= 1 ? 1 : 0.35 }}
                  className="flex items-center gap-3 rounded-lg border border-sh-border px-3 py-2.5"
                >
                  <div className="h-2 w-16 rounded bg-sh-surface" />
                  <div className="h-2 flex-1 rounded bg-sh-surface" />
                  <motion.div
                    animate={{
                      backgroundColor:
                        p >= 2 && r === 2 ? "rgba(4,120,87,0.25)" : "rgba(127,140,135,0.15)",
                    }}
                    className="h-2 w-12 rounded"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={false}
              animate={{
                opacity: p === 3 ? 1 : 0,
                y: p === 3 ? 0 : 12,
                scale: p === 3 ? 1 : 0.96,
              }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute bottom-5 right-5 w-64 rounded-xl border border-sh-border bg-sh-surface-raised p-3.5 shadow-xl"
              style={{ pointerEvents: "none" }}
            >
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-sh-warning">
                <ShieldCheck className="size-3.5" /> Approval needed
              </div>
              <p className="text-[13px] text-sh-text">Export 3 mismatched payouts to CSV?</p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Approve
                </span>
                <span className="rounded-md border border-sh-border px-3 py-1 text-xs text-sh-text-muted">
                  Skip
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: p === 5 ? 1 : 0, y: p === 5 ? 0 : 10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-x-5 bottom-5 rounded-xl border border-primary/30 bg-sh-success-fill p-3.5 text-[13px] text-sh-accent-green-ink dark:text-sh-text"
            >
              <span className="font-medium">Brief ready</span> · $48,210 matched · 3 exceptions
              flagged
            </motion.div>

            <motion.div
              aria-hidden
              initial={false}
              animate={CURSOR[p]}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="pointer-events-none absolute left-0 top-0"
            >
              <MousePointer2 className="size-5 fill-primary text-primary drop-shadow" />
            </motion.div>
          </div>
        </div>
      </BrowserFrame>
    </div>
  )
}

const STATS = [
  { to: 18420, label: "tasks completed" },
  { to: 312905, label: "browser actions" },
  { to: 99.2, decimals: 1, suffix: "%", label: "approvals respected" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-36 text-center sm:px-6 sm:pt-44">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(var(--sh-grid) 1px, transparent 1px), linear-gradient(90deg, var(--sh-grid) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-3xl"
      >
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sh-border bg-sh-surface-raised px-3 py-1 text-xs text-sh-text-muted">
          <span className="size-1.5 rounded-full bg-primary" />
          The AI browser agent for small-business accounting
        </div>
        <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
          Hand off the browser work.{" "}
          <span className="text-primary">Keep the final say.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-sh-text-muted">
          Minerva does the tab-hopping behind your books: reconciling Shopify against Stripe, chasing
          receipts, tracking tax changes. It never posts or files without your approval.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-all hover:bg-sh-primary-hover active:scale-[0.97]"
          >
            Try for free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how"
            className="inline-flex h-12 items-center rounded-full border border-sh-border bg-sh-surface-raised px-6 text-[15px] font-medium transition-colors hover:bg-sh-surface"
          >
            See how it works
          </a>
        </div>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {STATS.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-4xl font-semibold tracking-tight">
              <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </dd>
            <div className="mt-1 text-sm text-sh-text-muted">{s.label}</div>
          </div>
        ))}
      </motion.dl>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
        className="mt-16"
      >
        <HeroDemo />
      </motion.div>
    </section>
  )
}
