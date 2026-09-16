# Minerva Agent — Frontend

Next.js **Agent Workspace** UI for [Minerva Browser Agent](../api/README.md). Streams agent reasoning over Socket.IO, shows the Browserbase live session, handles human approvals, and renders structured task results (Tax Delta / IRS.gov).

**Canonical spec:** [`docs/frontend-prd.md`](docs/frontend-prd.md)  
**Visual system:** [`Stagehand-DESIGN.md`](Stagehand-DESIGN.md)  
**Backend contract:** [`../api/docs/backend-prd.md`](../api/docs/backend-prd.md) §12 (WebSocket events)

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui + Stagehand tokens |
| State | Zustand |
| Real-time | `socket.io-client` → NestJS gateway on `:3001` |

---

## Local development

### 1. Environment

Create `web/.env.local` (do not commit):

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

If the API has `GATEWAY_API_KEY` set, also add:

```bash
NEXT_PUBLIC_GATEWAY_API_KEY=your-key-here
```

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
2. Select the **Tax Delta** task template (IRS.gov research).
3. Click **Start** — live browser iframe and agent timeline should populate.
4. Use **Stop**, **Pause**, and the approval dock when the agent requests human input.

---

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # ESLint
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
| Tax Delta | `tax_code_delta` | Findings + impact callout (IRS.gov) |

---

## Production notes

Set `NEXT_PUBLIC_BACKEND_URL` to your deployed API origin in the host environment. The API must allow the frontend origin in `FRONTEND_URL` / CORS. No API keys or Browserbase secrets belong in this client — only `NEXT_PUBLIC_*` variables.

---

## Related docs

- [API README](../api/README.md) — agent, Browserbase, Socket.IO gateway
- [Product PRD](../api/docs/minerva-browser-agent-prd.md)
- [Frontend cursor rules](.cursor/rules/frontend.mdc)
