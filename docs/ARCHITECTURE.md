# Architecture & Build Plan

Two-engine system in one codebase:

- **Engine 1 — CaseForge** (public): $5/month subscription that turns messy
  student/builder work into polished proof-of-work artifacts.
- **Engine 2 — CommerceOps** (private): operating dashboard for a Vietnam
  desk/room/small-space micro-brand — sourcing, pricing, listings, content,
  orders, profit.

## The build-order decision

**CaseForge ships first. CommerceOps second. One codebase, not two.**

| Criterion | CaseForge | Commerce |
|---|---|---|
| Time to launchable | ~2 milestones (auth → generate → Stripe) | Dashboard is fast, but *revenue* needs suppliers, samples, fulfillment, content |
| First dollar | One Stripe checkout away once live | Weeks of product testing before first sale |
| Validation loop | Public: users sign up or they don't | Private: only validated by real product sales |
| Legal/platform complexity | Trivial (Stripe SaaS) | Business registration, tax, platform rules in VN |
| Skill fit | Same muscle as SellerFlow | Requires ops muscle you're still building |
| Automation leverage | LLM generation *is* the product | LLM assists (listings, content), ops is manual first |
| Portfolio signal | Launched SaaS with paying users | Real P&L — stronger later, slower to show |

The commerce path likely makes more absolute money eventually, but its
bottleneck is physical (samples, suppliers, fulfillment), not software. Writing
software first for a physical bottleneck is procrastination that feels like
work. So: launch the subscription product now, and build CommerceOps as the
internal tool *when there are products to track* — which you can start sourcing
in parallel, because that work is off-computer anyway.

**Why one codebase:** both products are the same shape — auth'd dashboard, CRUD
on Postgres, LLM generation, exports. Two repos would mean duplicating auth,
billing, the LLM layer, and the UI kit before earning a dollar. Route groups
keep them cleanly separated; CommerceOps simply has no marketing surface and is
gated to the owner account. Split it out only if/when CommerceOps becomes a
sellable product itself.

## Milestones

1. **M1 — Public face (this repo, done):** landing page, pricing page, auth
   page shells, design system, schema, this plan.
2. **M2 — CaseForge MVP (revenue-critical path):** Supabase auth → project
   input → LLM case-study generation → editor → Markdown export → public share
   page → Stripe $5/month + free-tier limit (1 case study). Deploy to Vercel
   at the *start* of M2, not the end — every commit ships.
3. **M3 — CommerceOps (private):** product tracker, supplier tracker,
   landed-cost/margin calculator, listing generator, content ideas, order +
   profit tracker. Manual inputs and CSV import/export only. No Shopee/TikTok
   APIs.
4. **M4 — Automation:** weekly email report (CaseForge), weekly commerce
   review, product scoring, content calendar generation, exportable test
   reports.

## File structure

```
caseforge/
├── db/
│   └── schema.sql              # Full Supabase schema, both engines (see file)
├── docs/
│   └── ARCHITECTURE.md         # This file
└── src/
    ├── app/
    │   ├── (marketing)/        # Public: landing, pricing         [M1 ✓]
    │   ├── (auth)/             # login, signup                    [M1 shell ✓ → M2 wire]
    │   ├── (app)/              # Authed product area              [M2]
    │   │   ├── dashboard/
    │   │   ├── projects/       #   new project, case study, editor
    │   │   ├── billing/
    │   │   └── commerce/       #   CommerceOps, owner-gated       [M3]
    │   ├── p/[slug]/           # Public share pages               [M2]
    │   └── api/                #   stripe webhook, generation     [M2]
    ├── components/
    │   ├── ui/                 # shadcn primitives
    │   ├── marketing/          # navbar, footer, pricing, faq, demo
    │   └── auth/
    └── lib/
        ├── llm/                # Provider-agnostic LLM layer (types.ts now;
        │                       #   anthropic.ts / openai.ts + prompts in M2)
        ├── supabase/           # client/server helpers            [M2]
        ├── stripe/             # checkout + webhook helpers       [M2]
        └── export/             # markdown/pdf renderers           [M2]
```

## Database

Full schema with RLS policies: [`db/schema.sql`](../db/schema.sql).

- Shared: `profiles`, `subscriptions` (Stripe mirror, plan free/pro)
- CaseForge: `projects` (raw input) → `case_studies` (structured sections) →
  `generated_outputs` (derivatives, jsonb by kind) → `public_pages` (slug,
  published flag)
- CommerceOps: `suppliers`, `products`, `pricing_calculations`,
  `product_tests`, `content_ideas`, `orders` (issue notes on the order),
  `expenses`, `profit_snapshots`
- Every row is owned via `user_id` RLS; published share pages get a public
  `select` policy.

## Rules that keep this revenue-focused

- Every PR must map to: paid CaseForge users, commerce profit, or portfolio
  signal. If it maps to none, don't build it.
- No fake social proof — no invented testimonials or user counts, ever. It's a
  proof-of-work product.
- No fragile integrations before revenue: no Shopee/TikTok APIs, no repo
  OAuth. Manual input + CSV until something is earning.
- Feature code never imports a vendor LLM SDK directly — everything goes
  through `src/lib/llm`.

## M2 implementation checklist (next session)

1. Supabase project + apply `db/schema.sql`; env vars in `.env.local`
2. `lib/supabase` server/client helpers + auth wiring in `(auth)` forms,
   middleware-protected `(app)` routes
3. Dashboard shell + "New project" input page (title, kind, raw text)
4. `lib/llm/anthropic.ts` + case-study generation prompt → writes
   `case_studies` + `generated_outputs`
5. Case study page with per-section editing; regenerate per output
6. Markdown export (server route, streamed download)
7. Public share page `p/[slug]` + publish toggle
8. Stripe: product ($5/mo), checkout session, customer portal, webhook →
   `subscriptions`; free-tier gate = 1 case study
9. Vercel deploy + Supabase prod keys; smoke-test signup → generate → pay
