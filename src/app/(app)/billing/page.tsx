import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPlan, getCaseStudyCount, FREE_CASE_STUDY_LIMIT } from "@/lib/subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startCheckout, openBillingPortal } from "./actions";

export const metadata: Metadata = { title: "Billing" };

const reasons: Record<string, string> = {
  limit:
    "You've used your free case study. Pro removes the limit for $5/month.",
  publish: "Public share pages are a Pro feature.",
  pdf: "PDF export is a Pro feature.",
};

const proFeatures = [
  "Unlimited case studies",
  "Public share pages",
  "PDF export",
  "Saved projects — update case studies as the work evolves",
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; success?: string }>;
}) {
  const { reason, success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [plan, count] = await Promise.all([
    getPlan(supabase, user.id),
    getCaseStudyCount(supabase, user.id),
  ]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">Billing</h1>

      {success && plan === "pro" && (
        <p className="mt-4 rounded-md bg-emerald-600/10 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
          You&apos;re on Pro. Every project you&apos;ve ever done, made legible.
        </p>
      )}
      {success && plan !== "pro" && (
        <p className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">
          Payment received — your plan will update in a few seconds. Refresh
          this page.
        </p>
      )}
      {!success && reason && reasons[reason] && (
        <p className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">
          {reasons[reason]}
        </p>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {plan === "pro" ? "Pro" : "Free"}
            </CardTitle>
            <Badge
              variant="secondary"
              className={
                plan === "pro"
                  ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
                  : ""
              }
            >
              Current plan
            </Badge>
          </div>
          <CardDescription>
            {plan === "pro"
              ? "$5/month — unlimited case studies, share pages, and exports."
              : `${count}/${FREE_CASE_STUDY_LIMIT} free case study used. Markdown export included.`}
          </CardDescription>
        </CardHeader>
        {plan === "free" && (
          <CardContent>
            <p className="text-sm font-medium">Pro — $5/month</p>
            <ul className="mt-2 space-y-1.5">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        )}
        <CardFooter>
          {plan === "pro" ? (
            <form action={openBillingPortal}>
              <Button variant="outline" type="submit">
                Manage subscription
              </Button>
            </form>
          ) : (
            <form action={startCheckout} className="w-full">
              <Button
                type="submit"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
              >
                Upgrade to Pro — $5/month
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Payments and cancellation are handled by Stripe. Cancel anytime; access
        continues to the end of the period, and exported files are yours
        forever.
      </p>
    </div>
  );
}
