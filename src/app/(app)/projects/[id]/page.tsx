import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Download, Globe, Printer } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseStudyEditor } from "@/components/app/case-study-editor";
import { OutputsPanel } from "@/components/app/outputs-panel";
import { PublishCard } from "@/components/app/publish-card";
import { RegenerateButton } from "@/components/app/regenerate-button";

export const metadata: Metadata = { title: "Case study" };
export const maxDuration = 300; // regeneration path

export default async function ProjectPage({
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

  const { data: project } = await supabase
    .from("projects")
    .select(
      `id, title, status, raw_input,
       case_studies (
         id, title, positioning, problem, context, role, built, process,
         technical_details, results, skills, learned,
         generated_outputs (kind, content),
         public_pages (slug, is_published)
       )`,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!project) notFound();

  const caseStudy = project.case_studies?.[0];
  const plan = await getPlan(supabase, user.id);

  if (!caseStudy) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
        <div className="mt-6 rounded-xl border bg-muted/40 p-6">
          <Badge variant="outline">Draft</Badge>
          <p className="mt-3 text-sm text-muted-foreground">
            Your input is saved, but generation hasn&apos;t completed for this
            project yet.
          </p>
          <div className="mt-4">
            <RegenerateButton projectId={project.id} />
          </div>
        </div>
        <pre className="mt-6 overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {project.raw_input}
        </pre>
      </div>
    );
  }

  const publicPage = caseStudy.public_pages?.[0] ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Projects
            </Link>{" "}
            / {project.title}
          </p>
          <h1 className="mt-1 truncate text-2xl font-bold tracking-tight">
            {caseStudy.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<a href={`/projects/${project.id}/export`} download />}
          >
            <Download data-icon="inline-start" aria-hidden />
            Markdown
          </Button>
          {plan === "pro" ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/projects/${project.id}/print`} />}
            >
              <Printer data-icon="inline-start" aria-hidden />
              PDF
            </Button>
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/billing" />}>
              <Printer data-icon="inline-start" aria-hidden />
              PDF (Pro)
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <CaseStudyEditor
            caseStudy={{
              id: caseStudy.id,
              title: caseStudy.title,
              positioning: caseStudy.positioning ?? "",
              problem: caseStudy.problem ?? "",
              context: caseStudy.context ?? "",
              role: caseStudy.role ?? "",
              built: caseStudy.built ?? "",
              process: caseStudy.process ?? "",
              technical_details: caseStudy.technical_details ?? "",
              results: caseStudy.results ?? "",
              skills: (caseStudy.skills ?? []).join(", "),
              learned: caseStudy.learned ?? "",
            }}
          />
        </div>
        <div className="min-w-0 space-y-6">
          <PublishCard
            caseStudyId={caseStudy.id}
            plan={plan}
            slug={publicPage?.slug ?? null}
            isPublished={publicPage?.is_published ?? false}
          />
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" aria-hidden />
            <h2 className="text-sm font-semibold">Generated outputs</h2>
          </div>
          <OutputsPanel outputs={caseStudy.generated_outputs ?? []} />
        </div>
      </div>
    </div>
  );
}
