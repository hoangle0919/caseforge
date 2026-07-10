# CaseForge

**Turn messy work into proof of work.**

CaseForge turns messy projects, repos, internships, and research into polished
case studies, resume bullets, LinkedIn posts, interview stories, and shareable
proof-of-work pages. Free tier: one full case study. Pro: $5/month, unlimited.

This codebase is a two-engine system:

1. **CaseForge** — the public subscription product (this README's namesake).
2. **CommerceOps** — a private operating dashboard for a Vietnam small-space /
   desk-setup micro-brand: sourcing, pricing, listings, content, orders,
   profit. Ships after CaseForge is live. See
   [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the build-order rationale.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase
(auth/db/storage) · Stripe (subscriptions) · Vercel · provider-agnostic LLM
layer (`src/lib/llm`)

## Development

```bash
npm install
cp .env.example .env.local   # fill in Supabase / Anthropic / Stripe keys
npm run dev                  # http://localhost:3000
npm run build                # production build
```

`LLM_PROVIDER=mock` runs the full generate → edit → export → share flow with a
canned case study — no Anthropic key or spend needed during development.

### Going live

1. Create a Supabase project, run [db/schema.sql](db/schema.sql) in the SQL
   editor, and copy the URL + keys into `.env.local`.
2. In Stripe: create the Pro product with a $5/month price, copy
   `STRIPE_PRICE_ID` and `STRIPE_SECRET_KEY`, and point a webhook at
   `/api/stripe/webhook` (events: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`).
3. Set `ANTHROPIC_API_KEY` and remove `LLM_PROVIDER=mock`.
4. Deploy to Vercel with the same env vars; set `NEXT_PUBLIC_APP_URL`.

## Status

- ✅ **Milestone 1** — landing page, pricing page, design system,
  database schema ([db/schema.sql](db/schema.sql)), architecture plan
- ✅ **Milestone 2 (code)** — Supabase auth + protected app area, project
  input → Claude-generated case study (all derivative outputs), per-section
  editor, Markdown export, print-to-PDF, public share pages, Stripe $5/month
  checkout/portal/webhook with free-tier gate (1 case study). Needs live
  Supabase/Stripe/Anthropic keys + deploy (see "Going live").
- ⬜ **Milestone 3** — private CommerceOps dashboard (manual input + CSV, no
  platform APIs)
- ⬜ **Milestone 4** — automation: weekly reports, product scoring, content
  calendar
