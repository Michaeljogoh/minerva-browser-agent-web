import { TAX_DELTA_DEFAULT_GOAL } from "@/lib/types/agent"
import type { TaskType } from "@/lib/types/task-results"

export interface TaskTemplate {
  id: string
  label: string
  shortLabel: string
  description: string
  outcome: string
  taskType: TaskType
  goal: string
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "D1",
    label: "Multi-site tax impact brief",
    shortLabel: "Research brief",
    description: "Researches official and trusted tax sources across the web.",
    outcome: "Client-ready brief with citations, risk, confidence, and next steps.",
    taskType: "tax_code_delta",
    goal: `${TAX_DELTA_DEFAULT_GOAL} Stay on those real public sites (and other official tax pages you find from them). End with a clean client brief: findings with source URLs, client impact, confidence, and recommended follow-up actions.`,
  },
  {
    id: "D2",
    label: "Shopify + Stripe reconciliation",
    shortLabel: "Reconciliation",
    description: "Connects or logs in, pulls commerce data, and normalizes payouts.",
    outcome: "Clean table of orders, fees, refunds, payouts, and exceptions.",
    taskType: "commerce_reconciliation",
    goal:
      "Reconcile the last 30 days of Shopify orders against Stripe payouts using the real dashboards: https://admin.shopify.com and https://dashboard.stripe.com. If I am not signed in, ask me to connect Shopify and Stripe through Composio or to log into the live browser. Pull orders, taxes, refunds, Stripe fees, payout dates, and net deposits. Do not change settings, issue refunds, or submit anything without approval. End with a normalized reconciliation table, mismatch reasons, totals, and next actions for an accountant.",
  },
  {
    id: "D3",
    label: "Month-end close assistant",
    shortLabel: "Close assistant",
    description: "Walks a dreaded close workflow across Stripe, Shopify, Gmail, Drive, and IRS.gov.",
    outcome: "Close status, blockers, missing docs, proposed categories, checklist.",
    taskType: "month_end_exception",
    goal:
      "Run a mini month-end close using real sites only: https://dashboard.stripe.com, https://admin.shopify.com, https://mail.google.com for receipts, https://drive.google.com for invoices, and https://www.irs.gov for tax-sensitive flags. If credentials are needed, ask me to connect the app through Composio or log into the live browser session. Identify uncategorized transactions, missing receipts, unmatched deposits, and tax-sensitive items. Never categorize, clear, post, send, or file without approval. End with a close status, exception table, missing-document list, proposed categories, tax notes, and a final accountant checklist.",
  },
]

/** Short, login-free jobs for checking that the run flow works end to end. */
export interface QuickTest {
  id: string
  label: string
  proves: string
  goal: string
}

export const QUICK_TESTS: QuickTest[] = [
  {
    id: "Q1",
    label: "Read a page heading",
    proves: "Open a site, read it, finish (~10s)",
    goal: "Open https://example.com and tell me the main heading and the first sentence of the page. Do not click anything.",
  },
  {
    id: "Q2",
    label: "Look up a tax term",
    proves: "Search, click, read",
    goal: "Go to https://en.wikipedia.org, search for \"Section 179 deduction\", open the article, and summarize the first paragraph in two sentences. Include the page URL.",
  },
  {
    id: "Q3",
    label: "List IRS forms",
    proves: "Navigate and extract a list",
    goal: "Open https://www.irs.gov/forms-instructions and list the first five forms or publications shown, with their titles. Do not download anything.",
  },
  {
    id: "Q4",
    label: "Compare two sites",
    proves: "Several sites and sources",
    goal: "Open https://example.com and https://www.iana.org, then tell me the page title of each and one difference between the two pages.",
  },
  {
    id: "Q5",
    label: "Ask before submitting",
    proves: "Approval flow (amber state)",
    goal: "Open https://httpbin.org/forms/post and fill in the form with sample values (name Test User, pizza size medium). Before pressing the submit button, ask me for approval. Only submit if I approve, then report the response.",
  },
]
