# Architecture & Build Plan

**This repo is CaseForge only** — a $5/month subscription that turns messy
student/builder work into polished proof-of-work artifacts.

CommerceOps / **Góc Gọn** (private Vietnam desk/room/small-space micro-brand
ops dashboard — sourcing, pricing, listings, content, orders, profit) used to
live inside this repo as a second, owner-gated engine. As of 2026-07-14 it was
split out into its own repo, database, and deployment: `~/STARTUP/gocgon`
(github.com/hoangle0919/gocgon, private). See that repo's own
`docs`/`README.md` for its plan. Nothing below describes CommerceOps/Góc Gọn
anymore — this file is CaseForge-only history.

## Why it was one codebase, then wasn't

The original call (2026-07-09) was to build CommerceOps *inside* caseforge to
avoid duplicating auth/billing/LLM/UI infra before either product earned a
dollar — both products were the same shape (auth'd dashboard, CRUD on
Postgres, LLM generation), so route groups kept them separated cheaply. That
held through M3's initial build. It changed once the two products were
understood as genuinely separate businesses with separate data — a $5/mo SaaS
subscription vs. a real commerce operation with supplier costs, margins, and
orders — at which point sharing a database stopped making sense regardless of
shared code shape. Split fully: own repo, own Supabase project, own Vercel
deployment, own GitHub visibility (private, since it holds real business
data — unlike this repo, which is a public portfolio piece).

## Milestones

1. **M1 — Public face (this repo, done):** landing page, pricing page, auth
   page shells, design system, schema, this plan.
2. **M2 — CaseForge MVP (revenue-critical path, done):** Supabase auth →
   project input → LLM case-study generation → editor → Markdown export →
   public share page → Stripe $5/month + free-tier limit (1 case study).
   Deployed to Vercel.
3. ~~M3 — CommerceOps~~ **moved to `~/STARTUP/gocgon`** (2026-07-14).
4. **M4 — Automation (CaseForge):** weekly email report, anything else that
   makes the $5/mo subscription stickier.

## File structure

```
caseforge/
├── db/
│   └── schema.sql              # Full Supabase schema (CaseForge only)
├── docs/
│   └── ARCHITECTURE.md         # This file
└── src/
    ├── app/
    │   ├── (marketing)/        # Public: landing, pricing         [M1 ✓]
    │   ├── (auth)/             # login, signup                    [M2 ✓]
    │   ├── (app)/              # Authed product area              [M2 ✓]
    │   │   ├── dashboard/
    │   │   ├── projects/       #   new project, case study, editor
    │   │   └── billing/
    │   ├── p/[slug]/           # Public share pages               [M2 ✓]
    │   └── api/                #   stripe webhook, generation     [M2 ✓]
    ├── components/
    │   ├── ui/                 # shadcn primitives
    │   ├── marketing/          # navbar, footer, pricing, faq, demo
    │   └── auth/
    └── lib/
        ├── llm/                # Provider-agnostic LLM layer (types.ts now;
        │                       #   anthropic.ts / openai.ts + prompts in M2)
        ├── supabase/           # client/server helpers            [M2 ✓]
        ├── stripe/             # checkout + webhook helpers       [M2 ✓]
        └── export/             # markdown/pdf renderers           [M2 ✓]
```

## Database

Full schema with RLS policies: [`db/schema.sql`](../db/schema.sql).

- `profiles`, `subscriptions` (Stripe mirror, plan free/pro)
- `projects` (raw input) → `case_studies` (structured sections) →
  `generated_outputs` (derivatives, jsonb by kind) → `public_pages` (slug,
  published flag)
- Every row is owned via `user_id` RLS; published share pages get a public
  `select` policy.

## Rules that keep this revenue-focused

- Every PR must map to: paid CaseForge users or portfolio signal. If it maps
  to neither, don't build it.
- No fake social proof — no invented testimonials or user counts, ever. It's a
  proof-of-work product.
- No fragile integrations before revenue: no Shopee/TikTok APIs, no repo
  OAuth. Manual input + CSV until something is earning.
- Feature code never imports a vendor LLM SDK directly — everything goes
  through `src/lib/llm`.

## M2 implementation checklist

1. ~~`lib/supabase` server/client helpers + auth wiring, proxy-protected
   `(app)` routes~~ ✅ (Next 16: `src/proxy.ts`, not middleware)
2. ~~Dashboard shell + "New project" input page~~ ✅
3. ~~LLM layer: provider abstraction (`lib/llm`), Anthropic adapter using
   structured outputs (`messages.parse` + zod), mock provider for dev~~ ✅
4. ~~Case study page with per-section editing + regenerate for failed drafts~~ ✅
5. ~~Markdown export route + print-to-PDF view (Pro)~~ ✅
6. ~~Public share page `p/[slug]` + publish toggle (Pro)~~ ✅
7. ~~Stripe: checkout, customer portal, webhook → `subscriptions`; free-tier
   gate = 1 case study~~ ✅
8. **Remaining (needs accounts/keys):** create Supabase project + run
   `db/schema.sql`; create Stripe product/price/webhook; set env vars
   (`.env.example`); deploy to Vercel; smoke-test signup → generate → pay.
   Steps are written out in README → "Going live".

## M2 architecture notes

- **LLM:** one `messages.parse` call (Claude, `claude-opus-4-8` by default,
  `LLM_MODEL` to override) generates the case study and every derivative in a
  single zod-validated response — no partial states to reconcile.
  `LLM_PROVIDER=mock` exercises the whole flow offline.
- **Auth:** the proxy layer is optimistic redirect only; real authorization is
  RLS plus per-page `getUser()`.
- **Payments:** the app never trusts itself about plan state — `subscriptions`
  is a mirror of Stripe maintained by the webhook, and `getPlan()` reads it.
- **PDF:** print-optimized page + browser print dialog. Zero dependencies; a
  server-side renderer can replace it later without touching callers.
