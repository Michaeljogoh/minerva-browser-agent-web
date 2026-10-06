import { ChevronDownIcon } from "lucide-react"

const FAQ = [
  {
    q: "What does Minerva actually do?",
    a: "You describe an accounting job in plain English. Minerva opens a real browser, visits the sites it needs, reads and compares the data, and returns a structured result with sources. You can watch it live.",
  },
  {
    q: "Will it change anything in my books?",
    a: "Not on its own. It does not categorize, clear, post, send, refund or file anything without your approval, and each request shows what it wants to do and why.",
  },
  {
    q: "Do I have to share my passwords?",
    a: "No. If a site needs a login, Minerva hands the live browser to you to sign in, or asks you to connect the app through Composio.",
  },
  {
    q: "Which jobs does it handle today?",
    a: "Multi-site tax impact briefs, Shopify and Stripe reconciliation, and a month-end close assistant. You can also run short custom tasks.",
  },
  {
    q: "Can I check how it reached an answer?",
    a: "Yes. Every run keeps its steps and screenshots, so you can replay it and review the sources.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Questions, answered.
        </h2>
        <div className="mt-10 divide-y divide-sh-border border-y border-sh-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDownIcon
                  className="size-4 shrink-0 text-sh-text-muted transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 pr-8 leading-relaxed text-sh-text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
