import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPlan, getCaseStudyCount, FREE_CASE_STUDY_LIMIT } from "@/lib/subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: projects }, plan, count] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, status, created_at, case_studies(id, positioning)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    getPlan(supabase, user.id),
    getCaseStudyCount(supabase, user.id),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {plan === "pro" ? (
              <>Pro — unlimited case studies.</>
            ) : (
              <>
                Free tier: {count}/{FREE_CASE_STUDY_LIMIT} case study used.{" "}
                <Link href="/billing" className="underline underline-offset-4">
                  Upgrade for unlimited
                </Link>
              </>
            )}
          </p>
        </div>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
          render={<Link href="/projects/new" />}
        >
          <Plus data-icon="inline-start" aria-hidden />
          New project
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <CardHeader className="items-center py-12 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <CardTitle className="mt-2">No projects yet</CardTitle>
            <CardDescription className="mx-auto max-w-sm">
              Paste your messy notes about any real project and CaseForge will
              turn them into a polished case study with every derivative
              artifact.
            </CardDescription>
            <Button
              className="mx-auto mt-4 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
              render={<Link href="/projects/new" />}
            >
              Forge your first case study
            </Button>
          </CardHeader>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const caseStudy = project.case_studies?.[0];
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">
                        {project.title}
                      </CardTitle>
                      <Badge
                        variant={caseStudy ? "secondary" : "outline"}
                        className={
                          caseStudy
                            ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
                            : ""
                        }
                      >
                        {caseStudy ? "Generated" : project.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {caseStudy?.positioning ??
                        "Not generated yet — open to continue."}
                    </CardDescription>
                    <span className="flex items-center gap-1 pt-1 text-xs font-medium text-muted-foreground">
                      Open <ArrowRight className="size-3" aria-hidden />
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
