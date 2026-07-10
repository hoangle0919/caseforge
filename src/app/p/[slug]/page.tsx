import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Anvil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CaseStudyArticle } from "@/components/case-study-article";

async function getPage(slug: string) {
  // Anonymous read — RLS "published pages are public" policy applies.
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_pages")
    .select(
      `id, slug, is_published,
       case_studies (
         title, positioning, problem, context, role, built, process,
         technical_details, results, skills, learned
       )`,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  const caseStudy = page?.case_studies?.[0];
  if (!caseStudy) return { title: "Not found" };
  return {
    title: caseStudy.title,
    description: caseStudy.positioning ?? undefined,
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  const caseStudy = page?.case_studies?.[0];
  if (!page || !caseStudy) notFound();

  // Best-effort view counting; anon clients can't update, so use the admin
  // client and never let it break the page.
  try {
    const admin = createAdminClient();
    await admin.rpc("increment_view_count", { page_id: page.id });
  } catch {
    // ignore — counting is not load-bearing
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <CaseStudyArticle caseStudy={caseStudy} />
      <footer className="mt-14 border-t pt-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Anvil className="size-3.5" aria-hidden />
          </span>
          Forged with CaseForge — turn messy work into proof of work
        </Link>
      </footer>
    </div>
  );
}
