import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { BrandLogo } from "@/components/agent-workspace/shell/brand-logo"

export function Cta() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-sh-border bg-sh-surface-raised px-6 py-20 text-center">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50%_70%_at_50%_0%,rgba(4,120,87,0.16),transparent_70%)]"
        />
        <h2 className="relative text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Put your browser on autopilot.
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-lg text-sh-text-muted">
          Start a task in under a minute. You stay in control the whole way.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/app"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-all hover:bg-sh-primary-hover active:scale-[0.97]"
          >
            Try for free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="mailto:hello@minerva.app"
            className="inline-flex h-12 items-center rounded-full border border-sh-border px-6 font-medium transition-colors hover:bg-sh-surface"
          >
            Contact sales
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-sh-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-sh-text-muted">
        <span className="flex items-center gap-3"><BrandLogo />© {new Date().getFullYear()}</span>
        <div className="flex gap-6">
          <a href="#how" className="hover:text-sh-text">How it works</a>
          <a href="#features" className="hover:text-sh-text">Features</a>
          <Link href="/app" className="hover:text-sh-text">Dashboard</Link>
        </div>
      </div>
    </footer>
  )
}
