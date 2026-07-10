import type { SupabaseClient } from "@supabase/supabase-js";

export type Plan = "free" | "pro";

export const FREE_CASE_STUDY_LIMIT = 1;

export async function getPlan(
  supabase: SupabaseClient,
  userId: string,
): Promise<Plan> {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.plan === "pro" && data.status === "active" ? "pro" : "free";
}

export async function getCaseStudyCount(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count } = await supabase
    .from("case_studies")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

/** Free tier: one case study. Pro: unlimited. */
export async function canCreateCaseStudy(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ allowed: boolean; plan: Plan; count: number }> {
  const [plan, count] = await Promise.all([
    getPlan(supabase, userId),
    getCaseStudyCount(supabase, userId),
  ]);
  return {
    allowed: plan === "pro" || count < FREE_CASE_STUDY_LIMIT,
    plan,
    count,
  };
}
