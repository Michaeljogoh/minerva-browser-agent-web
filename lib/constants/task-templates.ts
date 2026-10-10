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
    label: "Shopify shop name and currency",
    shortLabel: "Shop lookup",
    description: "Reads basic store details from your connected Shopify store.",
    outcome: "A short answer with the store name and currency.",
    taskType: "quick_answer",
    goal:
      "Using my connected Shopify store, get the shop name and store currency. This is read-only, so do not change, refund, or create anything. Answer in one or two lines.",
  },
  {
    id: "D3",
    label: "Shopify + Stripe reconciliation",
    shortLabel: "Reconciliation",
    description: "Connects or logs in, pulls commerce data, and normalizes payouts.",
    outcome: "Clean table of orders, fees, refunds, payouts, and exceptions.",
    taskType: "commerce_reconciliation",
    goal:
      "Reconcile the last 30 days of Shopify orders against Stripe payouts using the real Shopify admin and Stripe dashboard. If I am not signed in, ask me to connect Shopify and Stripe through Composio or to log into the live browser. Pull orders, taxes, refunds, Stripe fees, payout dates, and net deposits. Do not change settings, issue refunds, or submit anything without approval. End with a normalized reconciliation table, mismatch reasons, totals, and next actions for an accountant.",
  },
  {
    id: "D4",
    label: "Month-end close assistant",
    shortLabel: "Close assistant",
    description: "Walks a dreaded close workflow across Stripe, Shopify, Gmail, Drive, and IRS.gov.",
    outcome: "Close status, blockers, missing docs, proposed categories, checklist.",
    taskType: "month_end_exception",
    goal:
      "Run a mini month-end close using real sites only: Stripe, Shopify, Gmail for receipts, Google Drive for invoices, and IRS.gov for tax-sensitive flags. If credentials are needed, ask me to connect the app through Composio or log into the live browser session. Identify uncategorized transactions, missing receipts, unmatched deposits, and tax-sensitive items. Never categorize, clear, post, send, or file without approval. End with a close status, exception table, missing-document list, proposed categories, tax notes, and a final accountant checklist.",
  },
]

/** Short */
export interface QuickTest {
  id: string
  label: string
  proves: string
  goal: string
}

export const QUICK_TESTS: QuickTest[] = [
  {
    id: "Q1",
    label: "Explore Hacker News",
    proves: "Navigate, inspect stories, scroll, and summarize findings (~45-60s)",
    goal: "Open hacker news and read the site name and identify the first three story headlines on the homepage and then scroll down and identify the tenth story. tell me what they are in summary",
  },
  {
    id: "Q2",
    label: "Look up a tax term",
    proves: "Search, click, read",
    goal: "Go to Wikipedia, search for \"Section 179 deduction\", open the article, and summarize the first paragraph in two sentences. Include the page URL.",
  },
  {
    id: "Q3",
    label: "List IRS forms",
    proves: "Navigate and extract a list",
    goal: "Open IRS forms and instructions and list the first five forms or publications shown, with their titles. Do not download anything.",
  },
  {
    id: "Q4",
    label: "Compare two developer platform",
    proves: "Several sites and sources",
    goal: "Go to GitHub and GitLab in separate tabs, identify each page title and main purpose, then compare their development, collaboration, and CI/CD capabilities and state one key difference.",
  },
  {
    id: "Q5",
    label: "Ask before submitting",
    proves: "Approval flow (amber state)",
    goal: "Open httpbin and fill in the form with sample values (name Test User, pizza size medium). Before pressing the submit button, ask me for approval. Only submit if I approve, then report the response.",
  },
]
