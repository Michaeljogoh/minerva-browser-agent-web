import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { SectionLabel, Terminal, type TermLine } from "./primitives"

const kw = (s: string) => <span className="text-emerald-300">{s}</span>
const str = (s: string) => <span className="text-amber-200">{s}</span>

const TASK_LINES: TermLine[] = [
  { node: <span className="text-white/45"># reconcile-month.task.yaml</span> },
  { node: <>{kw("name")}: month-end-reconciliation</> },
  { node: <>{kw("start")}: {str("https://admin.shopify.com")}</> },
  { node: <>{kw("approval")}: {str("required for exports, refunds, settings")}</> },
  { node: <>{kw("steps")}:</> },
  { node: <>  - {kw("act")}: {str("pull the last 30 days of paid orders")}</> },
  { node: <>  - {kw("act")}: {str("open Stripe payouts and list fees + refunds")}</> },
  { node: <>  - {kw("check")}: {str("order totals match payout totals")}</> },
  { node: <>  - {kw("report")}: {str("table of mismatches with likely causes")}</> },
]

const RUN_LINES: TermLine[] = [
  { node: "$ minerva run reconcile-month", tone: "cmd" },
  { node: "Minerva 1.4.0 · live browser attached", tone: "dim" },
  { node: "[1/4] ✓ Shopify orders pulled · 1,284 rows · 12s", tone: "ok" },
  { node: "[2/4] ✓ Stripe payouts pulled · 31 payouts · 9s", tone: "ok" },
  { node: "[3/4] ⏸ Waiting for approval: export payout report", tone: "dim" },
  { node: "       you approved · 4s", tone: "dim" },
  { node: "[4/4] ✓ Brief generated · 3 exceptions · 7s", tone: "ok" },
  { node: "Done in 41s · replay: minerva.app/runs/c811b608", tone: "dim" },
]

const TRIAGE_LINES: TermLine[] = [
  { node: "$ minerva explain c811b608", tone: "cmd" },
  { node: "Loaded run · reconcile-month · attempt 1", tone: "dim" },
  { node: "✓ Read page text, network log & screenshots", tone: "ok" },
  { node: "✓ Traced mismatch · payout #4419 short by $37.50", tone: "ok" },
  { node: "✓ Cause: refund issued after payout cutoff", tone: "ok" },
  { node: "✗ Needs your call: book as timing difference?", tone: "fail" },
  { node: "Ask a follow-up about this run ▌", tone: "dim" },
]

const ROWS: {
  n: string
  label: string
  title: string
  body: string
  visual: ReactNode
}[] = [
  {
    n: "01",
    label: "author",
    title: "Describe tasks in plain English",
    body: "Goals and guardrails live in readable files you can version and review. No XPath or CSS selectors to maintain.",
    visual: <Terminal title="tasks/reconcile-month.task.yaml" lines={TASK_LINES} step={0.28} />,
  },
  {
    n: "02",
    label: "run",
    title: "Run anywhere, watch it live",
    body: "Start from the dashboard or a single command. Every run streams a live browser view you can pause, steer, or stop.",
    visual: <Terminal title="zsh" lines={RUN_LINES} step={0.45} />,
  },
  {
    n: "03",
    label: "triage",
    title: "Find the root cause",
    body: "When something looks off, Minerva shows what it saw and why it stopped, then asks you how to proceed.",
    visual: <Terminal title="zsh" lines={TRIAGE_LINES} step={0.5} />,
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-28">
        {ROWS.map((r, i) => (
          <div
            key={r.n}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <SectionLabel n={r.n} label={r.label} />
              <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {r.title}
              </h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-sh-text-muted">{r.body}</p>
              <Link
                href="/app"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Learn more
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div>{r.visual}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
