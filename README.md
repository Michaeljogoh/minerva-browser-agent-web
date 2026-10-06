# Minerva — Web

Next.js frontend for **Minerva**, an AI browser agent for small-business accounting. It has two parts:

- **Landing page** (`/`): explains the problem Minerva solves, shows how a run works with animated demos, and links into the app.
- **Agent workspace** (`/app`): streams agent reasoning over Socket.IO, shows the Steel live browser session, handles human approvals and live login, and renders structured results for three accounting workflows.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui (tokens in `app/globals.css`) |
| Motion | framer-motion + the `motion-*` utilities in `globals.css` |
| State | Zustand |
| Real-time | `socket.io-client` → NestJS gateway on `:3001` |

---

## Routes

| Route | What it is |
|-------|------------|
| `/` | Marketing landing page (`app/(marketing)/`) |
| `/app` | Agent workspace (`app/app/`) |

The landing page mounts a small client component (`components/landing/wake-api.tsx`, logic in `lib/wake-api.ts`) that sends a fire-and-forget `GET {NEXT_PUBLIC_BACKEND_URL}/health` once per browser session. It wakes a sleeping Render instance while the visitor reads the page. It needs `NEXT_PUBLIC_BACKEND_URL` set and does nothing without it.

---

## Local development

### 1. Environment

Create `web/.env.local` from `.env.example` (do not commit):

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

If the API has `GATEWAY_API_KEY` set (required in production / Compose `api`), set the **same** value:

```bash
NEXT_PUBLIC_GATEWAY_API_KEY=<same-as-api-GATEWAY_API_KEY>
```

Do not use the literal `your-key-here`; the client treats that as unset.

Ensure the API `FRONTEND_URL` includes `http://localhost:3000`.

### 2. Run API + web

```bash
# Terminal 1 — backend (port 3001)
cd ../api
npm run start:dev

# Terminal 2 — frontend (port 3000)
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/app](http://localhost:3000/app) for the workspace.

### 3. Smoke test

1. Open `/app` and confirm the header shows **Connected** (green).
2. Click a **Quick test** chip (for example "Read a page heading") and press **Run**.
3. In the Job panel, check that the live-run card moves from Starting to Working to Done, with a "Now" line, a timer and action/site counts.
4. In the Activity rail, check that steps appear with hostname chips and the newest step is accented.
5. Run **Ask before submitting** to see the approval flow. Use **Stop**, **Pause**, guidance, and the review dock when the agent asks you to approve, connect, or sign in.

---

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # ESLint
pnpm test     # Vitest (parsers / pure lib)
```

---

## Project layout

```
web/
├── app/
│   ├── (marketing)/page.tsx      # Landing page, served at /
│   ├── app/                      # Workspace, served at /app
│   │   ├── page.tsx
│   │   ├── loading.tsx           # Workspace skeleton
│   │   └── error.tsx             # Segment error boundary
│   └── not-found.tsx             # Global 404 (links back to /app)
├── components/
│   ├── landing/                  # Nav, hero, problem, how-it-works, features,
│   │                             #   use-cases, trust, faq, cta/footer, wake-api
│   └── agent-workspace/          # shell, sidebar, stage, status, approval, rail,
│                                 #   connection, results
├── store/agent.store.ts          # Zustand — agent state + socket actions
├── lib/
│   ├── socket.ts                 # Socket.IO client
│   ├── wake-api.ts               # Wakes the API from the landing page
│   ├── run-phase.ts              # Maps run status to Starting/Working/Needs you/Done
│   ├── step-copy.ts              # Plain-language step labels + hostname helper
│   └── types/                    # Event + task result types (mirrors API)
├── hooks/                        # Socket, agent rail, timeline scroll, focus trap
└── docs/frontend-prd.md          # Full frontend specification
```

---

## Workspace: live run status

- **Job panel** (`components/agent-workspace/sidebar/task-chat-timeline.tsx`): a "Live run" card with a phase stepper, a single "Now" line, an elapsed timer and action/site counts. Earlier steps collapse underneath. The "Needs you" phase only appears once the run has asked for approval.
- **Activity rail** (`components/agent-workspace/rail/`): a live status pill with elapsed time, filter tabs with counts, and step cards with hostname chips and duration badges. Consecutive past "Thought" steps shrink to one muted line.
- Shared pieces live in `components/agent-workspace/status/` (`run-phase-stepper`, `now-line`, `use-run-clock`).
- The server does not send a plan, so the stepper is inferred from the run status and events, not from planned steps.

---

## Tasks

### Workflows

| Template | `taskType` | Result view |
|----------|------------|-------------|
| Multi-site tax impact brief | `tax_code_delta` | Findings, citations, impact, recommended actions |
| Shopify + Stripe reconciliation | `commerce_reconciliation` | Normalized payout table + exceptions |
| Month-end close assistant | `month_end_exception` | Close status, blockers, missing docs, checklist |

### Quick tests

Short, sign-in-free tasks in `lib/constants/task-templates.ts` (`QUICK_TESTS`), shown as chips in the empty-state picker. They send no `taskType`, so the structured Report tab may show only the summary.

| Test | Proves |
|------|--------|
| Read a page heading | Open a site, read it, finish |
| Look up a tax term | Search, click, read |
| List IRS forms | Navigate and extract a list |
| Compare two sites | Several sites and sources |
| Ask before submitting | The approval flow |

---

## Production notes

Set `NEXT_PUBLIC_BACKEND_URL` to your deployed API origin in the host environment. The API must allow the frontend origin in `FRONTEND_URL` / CORS. No API keys or Steel secrets belong in this client, only `NEXT_PUBLIC_*` variables.

On Render's free tier the API sleeps when idle. The landing page's wake-up ping (see Routes) starts it booting as soon as a visitor arrives.

---

## Brand

The product name is **Minerva**. The mark is an owl's eye (`components/agent-workspace/shell/brand-logo.tsx`, `app/icon.svg`). `app/apple-icon.png` should be re-exported from `icon.svg` if it still shows the old mark.
