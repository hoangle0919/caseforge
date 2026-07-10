import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/subscription";
import { CaseStudyArticle } from "@/components/case-study-article";
import { PrintTrigger } from "@/components/app/print-trigger";

export const metadata: Metadata = { title: "Print" };

// PDF export = print-optimized page; the browser's print dialog produces the file.
export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getPlan(supabase, user.id);
  if (plan !== "pro") redirect("/billing?reason=pdf");

  const { data: project } = await supabase
    .from("projects")
    .select(
      `id,
       case_studies (
         title, positioning, problem, context, role, built, process,
         technical_details, results, skills, learned
       )`,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const caseStudy = project?.case_studies?.[0];
  if (!caseStudy) notFound();

  return (
    <div className="mx-auto max-w-2xl print:max-w-none">
      <PrintTrigger />
      <CaseStudyArticle caseStudy={caseStudy} />
    </div>
  );
}
