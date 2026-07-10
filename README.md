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
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Status

- ✅ **Milestone 1** — landing page, pricing page, auth shells, design system,
  database schema ([db/schema.sql](db/schema.sql)), architecture plan
- 🔨 **Milestone 2** — CaseForge MVP: Supabase auth, LLM case-study generation,
  editor, Markdown export, public share pages, Stripe $5/month
- ⬜ **Milestone 3** — private CommerceOps dashboard (manual input + CSV, no
  platform APIs)
- ⬜ **Milestone 4** — automation: weekly reports, product scoring, content
  calendar
