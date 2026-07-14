-- CommerceOps M3: product research, scoring, listings, content, customer templates.
-- Extends the CommerceOps tables from 20260710000000_init.sql.

-- ============================================================
-- Product Research Board: richer product fields
-- ============================================================

alter table products
  add column problem_solved text,
  add column target_buyer text,
  add column competitor_price_low numeric(14, 2),
  add column competitor_price_high numeric(14, 2),
  -- Qualitative signals the deterministic scorer reads directly, instead of
  -- guessing them from free text. Set by the seller when adding a product.
  add column demand_signal text
    check (demand_signal is null or demand_signal in ('low', 'medium', 'high')),
  add column content_potential text
    check (content_potential is null or content_potential in ('low', 'medium', 'high')),
  add column differentiation text
    check (differentiation is null or differentiation in ('low', 'medium', 'high')),
  add column repeat_purchase_potential text
    check (repeat_purchase_potential is null or repeat_purchase_potential in ('low', 'medium', 'high')),
  add column fragile boolean not null default false;

-- Add 'scaled' so the dashboard can distinguish "working, worth scaling" from
-- merely "active" (still testing at small volume).
alter table products drop constraint products_status_check;
alter table products add constraint products_status_check
  check (status in ('idea', 'sourcing', 'testing', 'listed', 'active', 'scaled', 'killed'));

-- ============================================================
-- Supplier Tracker: fields from the spec not yet on suppliers
-- ============================================================

alter table suppliers
  add column unit_cost numeric(14, 2),
  add column moq integer,
  add column return_policy text,
  add column quality_concerns text,
  add column backup_supplier_id uuid references suppliers (id) on delete set null;

-- ============================================================
-- AI Product Scorer: one row per scoring run, latest cached on products.score
-- ============================================================

create table product_scores (
  id uuid primary key default gen_random_uuid (),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  score numeric(5, 1) not null,
  decision text not null
    check (decision in ('skip', 'test', 'improve_sourcing', 'strong_test')),
  demand_score numeric(4, 1),
  margin_score numeric(4, 1),
  supplier_score numeric(4, 1),
  shipping_score numeric(4, 1),
  return_risk_score numeric(4, 1),
  content_score numeric(4, 1),
  differentiation_score numeric(4, 1),
  repeat_purchase_score numeric(4, 1),
  legal_risk_score numeric(4, 1),
  operational_score numeric(4, 1),
  explanation text,
  risks text[],
  verify_before_selling text[],
  model text not null default 'deterministic',
  created_at timestamptz not null default now()
);

create index product_scores_product_id_idx on product_scores (product_id);

-- ============================================================
-- AI Listing Generator: Vietnamese platform listing copy
-- ============================================================

create table listing_outputs (
  id uuid primary key default gen_random_uuid (),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  platform text not null default 'shopee'
    check (platform in ('shopee', 'tiktok', 'instagram')),
  title text,
  short_title text,
  description text,
  bullets text[],
  specifications jsonb,
  faq jsonb,
  objections jsonb,
  trust_claims text[],
  warranty_text text,
  model text,
  created_at timestamptz not null default now()
);

create index listing_outputs_product_id_idx on listing_outputs (product_id);

-- ============================================================
-- AI Content Engine: extend content_ideas with generated script content
-- ============================================================

alter table content_ideas
  add column angle text
    check (angle is null or angle in (
      'before_after', 'problem_solution', 'student_room', 'small_space'
    )),
  add column script_15s text,
  add column script_30s text,
  add column shot_list text[],
  add column captions text[],
  add column hashtags text[];

-- ============================================================
-- Customer-service copilot: reusable Vietnamese message templates
-- ============================================================

create table customer_templates (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  product_id uuid references products (id) on delete cascade,
  category text not null check (category in (
    'product_details', 'shipping_time', 'price_negotiation', 'order_confirmation',
    'delay_apology', 'refund_return', 'damaged_item', 'thank_you', 'review_request'
  )),
  content text not null,
  language text not null default 'vi',
  model text,
  created_at timestamptz not null default now()
);

create index customer_templates_user_id_idx on customer_templates (user_id);

-- ============================================================
-- Weekly Review: qualitative rollup fields on profit_snapshots
-- ============================================================

alter table profit_snapshots
  add column best_product_id uuid references products (id) on delete set null,
  add column worst_product_id uuid references products (id) on delete set null,
  add column content_notes text,
  add column supplier_issues text,
  add column next_actions text[];

-- ============================================================
-- RLS for new tables
-- ============================================================

alter table product_scores enable row level security;
alter table listing_outputs enable row level security;
alter table customer_templates enable row level security;

create policy "own rows" on product_scores
  for all using (user_id = auth.uid ()) with check (user_id = auth.uid ());

create policy "own rows" on listing_outputs
  for all using (user_id = auth.uid ()) with check (user_id = auth.uid ());

create policy "own rows" on customer_templates
  for all using (user_id = auth.uid ()) with check (user_id = auth.uid ());
