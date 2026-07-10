import Link from "next/link";
import { Check } from "lucide-react";
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

const freeFeatures = [
  "1 full case study",
  "All core outputs: resume bullets, LinkedIn post, interview story",
  "Technical + plain-English summaries",
  "Improvement checklist",
  "Markdown export",
];

const proFeatures = [
  "Unlimited case studies",
  "Public share pages with your own slug",
  "PDF export",
  "Saved projects — update a case study as the work evolves",
  "Portfolio cards for every project",
  "Everything in Free",
];

export function PricingCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Free</CardTitle>
          <CardDescription>
            Prove it works on your best project.
          </CardDescription>
          <p className="pt-2">
            <span className="text-4xl font-bold tracking-tight">$0</span>
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2.5">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            render={<Link href="/signup" />}
          >
            Start free
          </Button>
        </CardFooter>
      </Card>

      <Card className="relative flex flex-col border-emerald-600/40 shadow-md dark:border-emerald-500/40">
        <Badge className="absolute -top-3 left-6 bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950">
          Most useful
        </Badge>
        <CardHeader>
          <CardTitle className="text-lg">Pro</CardTitle>
          <CardDescription>
            Every project you&apos;ve ever done, made legible.
          </CardDescription>
          <p className="pt-2">
            <span className="text-4xl font-bold tracking-tight">$5</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2.5">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
            render={<Link href="/signup" />}
          >
            Go Pro — $5/month
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
