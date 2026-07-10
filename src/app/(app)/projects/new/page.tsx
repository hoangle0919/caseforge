import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canCreateCaseStudy } from "@/lib/subscription";
import { NewProjectForm } from "@/components/app/new-project-form";

export const metadata: Metadata = { title: "New project" };
// Generation can take a couple of minutes at high effort.
export const maxDuration = 300;

export default async function NewProjectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const gate = await canCreateCaseStudy(supabase, user.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">New project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dump everything — notes, README text, report fragments, half-remembered
        bullets. Messy is fine; messy is the point.
      </p>

      {gate.allowed ? (
        <div className="mt-6">
          <NewProjectForm />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border bg-muted/40 p-6">
          <p className="font-medium">
            You&apos;ve used your free case study.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pro is $5/month for unlimited case studies, share pages, and
            exports.{" "}
            <Link href="/billing" className="underline underline-offset-4">
              Upgrade on the billing page
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
