-- CaseForge + CommerceOps schema (Supabase / Postgres)
-- Apply via Supabase SQL editor or `supabase db push` in Milestone 2.
-- One database, two product areas, shared identity + billing.

-- ============================================================
-- Shared: identity & billing
-- ============================================================

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active'
    check (status in ('active', 'past_due', 'canceled', 'incomplete')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index subscriptions_user_id_idx on subscriptions (user_id);

-- ============================================================
-- CaseForge: projects -> case studies -> outputs -> share pages
-- ============================================================

create table projects (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  -- The messy input, verbatim: notes, README text, links, fragments.
  raw_input text not null,
  input_kind text not null default 'notes'
    check (input_kind in ('notes', 'repo', 'report', 'internship', 'research', 'other')),
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on projects (user_id);

create table case_studies (
  id uuid primary key default gen_random_uuid (),
  project_id uuid not null references projects (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  positioning text,          -- one-line positioning
  problem text,
  context text,
  role text,                 -- "my role"
  built text,                -- what I built/did
  process text,
  technical_details text,
  results text,              -- results/evidence
  skills text[],             -- skills demonstrated
  learned text,              -- what I learned
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index case_studies_user_id_idx on case_studies (user_id);
create index case_studies_project_id_idx on case_studies (project_id);

-- Derivative artifacts (resume bullets, LinkedIn post, ...) are stored
-- separately so they can be regenerated one at a time.
create table generated_outputs (
  id uuid primary key default gen_random_uuid (),
  case_study_id uuid not null references case_studies (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  kind text not null check (
    kind in (
      'resume_bullets', 'portfolio_card', 'linkedin_post', 'interview_story',
      'technical_summary', 'plain_summary', 'improvement_checklist'
    )
  ),
  content jsonb not null,    -- shape varies by kind (list vs prose)
  model text,                -- which LLM produced it
  created_at timestamptz not null default now()
);

create index generated_outputs_case_study_id_idx on generated_outputs (case_study_id);

create table public_pages (
  id uuid primary key default gen_random_uuid (),
  case_study_id uuid not null unique references case_studies (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  slug text not null unique,
  is_published boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CommerceOps: private Vietnam micro-brand operating data
-- ============================================================

create table suppliers (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  platform text,             -- 1688, Shopee, local wholesaler, ...
  url text,
  contact text,
  lead_time_days integer,
  reliability_rating integer check (reliability_rating between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  supplier_id uuid references suppliers (id) on delete set null,
  name text not null,
  niche_category text,       -- desk, room, small-space, student-setup
  source_url text,
  status text not null default 'idea'
    check (status in ('idea', 'sourcing', 'testing', 'listed', 'active', 'killed')),
  score numeric(4, 1),       -- computed product score (demand/margin/effort)
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_user_id_idx on products (user_id);

-- Landed cost + price snapshots; margins computed in app code.
create table pricing_calculations (
  id uuid primary key default gen_random_uuid (),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  currency text not null default 'VND',
  cost_of_goods numeric(14, 2) not null,
  shipping_in numeric(14, 2) not null default 0,      -- supplier -> you
  packaging numeric(14, 2) not null default 0,
  shipping_out numeric(14, 2) not null default 0,     -- you -> customer
  platform_fee_pct numeric(5, 2) not null default 0,  -- Shopee/TikTok take
  payment_fee_pct numeric(5, 2) not null default 0,
  ads_cost_per_unit numeric(14, 2) not null default 0,
  tax_estimate_pct numeric(5, 2) not null default 0,  -- simple estimate field
  other_costs numeric(14, 2) not null default 0,
  selling_price numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

create table product_tests (
  id uuid primary key default gen_random_uuid (),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  hypothesis text,
  channel text check (channel in ('shopee', 'tiktok', 'instagram', 'other')),
  started_at date,
  ended_at date,
  spend numeric(14, 2) not null default 0,
  revenue numeric(14, 2) not null default 0,
  units_sold integer not null default 0,
  verdict text check (verdict in ('scale', 'iterate', 'kill')),
  notes text,
  created_at timestamptz not null default now()
);

create table content_ideas (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  product_id uuid references products (id) on delete cascade,
  platform text not null check (platform in ('shopee', 'tiktok', 'instagram')),
  hook text not null,
  format text,               -- e.g. before/after, desk tour, POV, unboxing
  status text not null default 'idea'
    check (status in ('idea', 'drafted', 'posted')),
  scheduled_for date,
  performance_notes text,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  channel text check (channel in ('shopee', 'tiktok', 'instagram', 'direct')),
  order_code text,
  quantity integer not null default 1,
  unit_price numeric(14, 2) not null,
  cogs_per_unit numeric(14, 2) not null default 0,
  shipping_cost numeric(14, 2) not null default 0,
  fees numeric(14, 2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'returned', 'refunded')),
  issue_notes text,          -- refund/issue tracking lives on the order
  customer_note text,
  ordered_at timestamptz,
  created_at timestamptz not null default now()
);

create index orders_user_id_idx on orders (user_id);

create table expenses (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  category text not null,    -- ads, samples, packaging, tools, fees, other
  amount numeric(14, 2) not null,
  currency text not null default 'VND',
  note text,
  incurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table profit_snapshots (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  revenue numeric(14, 2) not null default 0,
  cogs numeric(14, 2) not null default 0,
  fees numeric(14, 2) not null default 0,
  ads_spend numeric(14, 2) not null default 0,
  other_expenses numeric(14, 2) not null default 0,
  net_profit numeric(14, 2) not null default 0,
  notes text,                -- weekly review notes
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security: every row is owned by user_id
-- ============================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'subscriptions', 'projects', 'case_studies',
    'generated_outputs', 'public_pages', 'suppliers', 'products',
    'pricing_calculations', 'product_tests', 'content_ideas', 'orders',
    'expenses', 'profit_snapshots'
  ] loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

create policy "own profile" on profiles
  for all using (id = auth.uid ()) with check (id = auth.uid ());

do $$
declare
  t text;
begin
  foreach t in array array[
    'subscriptions', 'projects', 'case_studies', 'generated_outputs',
    'public_pages', 'suppliers', 'products', 'pricing_calculations',
    'product_tests', 'content_ideas', 'orders', 'expenses', 'profit_snapshots'
  ] loop
    execute format(
      'create policy "own rows" on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())',
      t
    );
  end loop;
end $$;

-- Published share pages are readable by anyone (the public share URL).
create policy "published pages are public" on public_pages
  for select using (is_published = true);

create policy "published case studies are public" on case_studies
  for select using (
    exists (
      select 1 from public_pages p
      where p.case_study_id = case_studies.id and p.is_published = true
    )
  );
