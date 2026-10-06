"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  FileSearchIcon,
  LandmarkIcon,
  LayersIcon,
  ReceiptTextIcon,
} from "lucide-react"

import { EASE } from "./primitives"

const PAINS = [
  {
    icon: LayersIcon,
    pain: "Reconciling Shopify against Stripe by hand",
    fix: "Minerva pulls orders, fees, refunds and payouts, then lines them up and flags what doesn't match.",
  },
  {
    icon: ReceiptTextIcon,
    pain: "Chasing missing receipts and invoices",
    fix: "It searches Gmail and Drive for the paperwork and lists exactly what is still missing.",
  },
  {
    icon: LandmarkIcon,
    pain: "Month-end close across a dozen portals",
    fix: "It walks each portal, then hands you blockers, exceptions and an accountant checklist.",
  },
  {
    icon: FileSearchIcon,
    pain: "Missing tax changes that affect your clients",
    fix: "It reads IRS and state sources and tells you who is affected, with citations.",
  },
]

const AUDIENCE = [
  "Small accounting firms",
  "Bookkeepers",
  "E-commerce owners",
  "Fractional CFOs",
]

export function Problem() {
  const reduce = useReducedMotion()
  return (
    <section id="problem" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            The problem
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Small-business accounting is a tab-hopping job.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sh-text-muted">
            The data lives in dashboards, inboxes and government sites that don&apos;t talk to each
            other. SMB teams can&apos;t afford a developer to build integrations, so people copy and
            paste for hours each month. Minerva does that browsing for you, in a real browser, and
            you stay in charge of every decision.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2">
          {PAINS.map((p, i) => (
            <motion.li
              key={p.pain}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="rounded-2xl border border-sh-border bg-sh-surface-raised p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-sh-steer-fill text-sh-accent-green">
                  <p.icon className="size-4" aria-hidden />
                </span>
                <h3 className="font-medium leading-snug">{p.pain}</h3>
              </div>
              <div className="mt-4 flex gap-3 border-t border-sh-border pt-4 text-sm leading-relaxed text-sh-text-muted">
                <span className="mt-0.5 font-mono text-xs text-primary">→</span>
                <p>{p.fix}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-sh-text-muted">Built for</span>
          {AUDIENCE.map((a) => (
            <span
              key={a}
              className="rounded-full border border-sh-border bg-sh-surface-raised px-3.5 py-1.5 text-sm"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
