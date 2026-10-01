# Browser Agents — Frontend

Next.js **Agent Workspace** UI for Browser Agents. Streams agent reasoning over Socket.IO, shows the Steel live browser session, handles human approvals and live login, and renders structured task results for three accounting demos.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui (tokens in `app/globals.css`) |
| State | Zustand |
| Real-time | `socket.io-client` → NestJS gateway on `:3001` |

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

Do not use the literal `your-key-here` — the client treats that as unset.

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

Open [http://localhost:3000](http://localhost:3000).

### 3. Smoke test

1. Confirm header shows **Connected** (green).
2. Pick a demo card in the sidebar: research brief, Shopify + Stripe reconciliation, or month-end close.
3. Click **Run** — live browser iframe and a plain-language timeline should populate.
4. Use **Stop**, **Pause**, guidance, and the review dock when the agent asks you to approve, connect, or sign in.

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
│   ├── (workspace)/              # Route group — URL stays /
│   │   ├── page.tsx
│   │   ├── loading.tsx           # Workspace skeleton
│   │   └── error.tsx             # Segment error boundary
│   └── not-found.tsx             # Global 404
├── components/agent-workspace/   # Grouped: shell, sidebar, stage, approval, rail, connection, results
├── store/agent.store.ts          # Zustand — agent state + socket actions
├── lib/socket.ts                 # Socket.IO client
├── lib/types/                    # Event + task result types (mirrors API)
├── hooks/                        # Socket, agent rail, timeline scroll, focus trap
└── docs/frontend-prd.md          # Full frontend specification
```

## Demo tasks

| Template | `taskType` | Result view |
|----------|------------|-------------|
| Multi-site tax impact brief | `tax_code_delta` | Findings, citations, impact, recommended actions |
| Shopify + Stripe reconciliation | `commerce_reconciliation` | Normalized payout table + exceptions |
| Month-end close assistant | `month_end_exception` | Close status, blockers, missing docs, checklist |

---

## Production notes

Set `NEXT_PUBLIC_BACKEND_URL` to your deployed API origin in the host environment. The API must allow the frontend origin in `FRONTEND_URL` / CORS. No API keys or Steel secrets belong in this client — only `NEXT_PUBLIC_*` variables.

---


