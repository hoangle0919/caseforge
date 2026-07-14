-- Revert 20260714000000_commerceops_extend.sql — CommerceOps (Góc Gọn) moved
-- to its own repo and its own Supabase project. No data existed in any of
-- these tables/columns at the time of this revert.

drop table if exists customer_templates;
drop table if exists listing_outputs;
drop table if exists product_scores;

alter table content_ideas
  drop column if exists hashtags,
  drop column if exists captions,
  drop column if exists shot_list,
  drop column if exists script_30s,
  drop column if exists script_15s,
  drop column if exists angle;

alter table profit_snapshots
  drop column if exists next_actions,
  drop column if exists supplier_issues,
  drop column if exists content_notes,
  drop column if exists worst_product_id,
  drop column if exists best_product_id;

alter table suppliers
  drop column if exists backup_supplier_id,
  drop column if exists quality_concerns,
  drop column if exists return_policy,
  drop column if exists moq,
  drop column if exists unit_cost;

alter table products drop constraint if exists products_status_check;
alter table products add constraint products_status_check
  check (status in ('idea', 'sourcing', 'testing', 'listed', 'active', 'killed'));

alter table products
  drop column if exists fragile,
  drop column if exists repeat_purchase_potential,
  drop column if exists differentiation,
  drop column if exists content_potential,
  drop column if exists demand_signal,
  drop column if exists competitor_price_high,
  drop column if exists competitor_price_low,
  drop column if exists target_buyer,
  drop column if exists problem_solved;
