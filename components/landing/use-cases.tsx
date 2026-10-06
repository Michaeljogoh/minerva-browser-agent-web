import { TASK_TEMPLATES } from "@/lib/constants/task-templates"

export function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Use cases
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            The dreaded workflows, handled.
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TASK_TEMPLATES.slice(0, 6).map((t) => (
            <li
              key={t.id}
              className="group rounded-2xl border border-sh-border bg-sh-surface-raised p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_40px_-20px_rgba(4,120,87,0.35)]"
            >
              <div className="font-mono text-xs text-primary">{t.shortLabel}</div>
              <h3 className="mt-3 text-lg font-medium leading-snug">{t.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sh-text-muted">{t.description}</p>
              <p className="mt-4 border-t border-sh-border pt-4 text-sm leading-relaxed">
                {t.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
