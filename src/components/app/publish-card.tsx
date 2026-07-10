"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, Copy, Globe, Loader2 } from "lucide-react";
import { togglePublish } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PublishCard({
  caseStudyId,
  plan,
  slug,
  isPublished,
}: {
  caseStudyId: string;
  plan: "free" | "pro";
  slug: string | null;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const url = slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}`
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="size-4" aria-hidden />
          Public share page
        </CardTitle>
        <CardDescription>
          {isPublished
            ? "Live — one clean link for applications and DMs."
            : "Publish a public page for this case study."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPublished && url && (
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1.5 text-xs">
              {url}
            </code>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copy share link"
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? (
                <Check className="text-emerald-600 dark:text-emerald-400" aria-hidden />
              ) : (
                <Copy aria-hidden />
              )}
            </Button>
          </div>
        )}
        {plan === "pro" ? (
          <Button
            variant={isPublished ? "outline" : "default"}
            size="sm"
            disabled={pending}
            onClick={() => startTransition(async () => void (await togglePublish(caseStudyId)))}
          >
            {pending ? (
              <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
            ) : null}
            {isPublished ? "Unpublish" : "Publish page"}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            Share pages are a Pro feature.{" "}
            <Link href="/billing" className="underline underline-offset-4">
              Upgrade — $5/month
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
