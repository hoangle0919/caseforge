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
