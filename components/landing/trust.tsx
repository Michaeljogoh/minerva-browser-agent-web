import {
  HistoryIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react"

const ITEMS = [
  {
    icon: UserCheckIcon,
    title: "Nothing posts without you",
    body: "Minerva never categorizes, clears, posts, sends or files until you approve. Risky moves pause with context and a countdown.",
  },
  {
    icon: KeyRoundIcon,
    title: "You sign in, not Minerva",
    body: "When a site needs a login, the browser is handed to you. Or connect the app instead of sharing credentials.",
  },
  {
    icon: ShieldCheckIcon,
    title: "A guarded browser",
    body: "Runs happen in an isolated cloud browser, with URL rules and rate limits on what the agent can reach.",
  },
  {
    icon: HistoryIcon,
    title: "A trail for every run",
    body: "Each step and screenshot is saved, so you can replay a run and show exactly how a number was produced.",
  },
]

export function Trust() {
  return (
    <section id="trust" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Trust
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for work where mistakes cost money.
          </h2>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-sh-border bg-sh-border sm:grid-cols-2">
          {ITEMS.map((t) => (
            <li key={t.title} className="bg-background p-7">
              <t.icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-medium">{t.title}</h3>
              <p className="mt-2 leading-relaxed text-sh-text-muted">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
