import Link from "next/link";
import {
  ClipboardPaste,
  Download,
  FileText,
  Globe,
  IdCard,
  ListChecks,
  Megaphone,
  MessagesSquare,
  PencilRuler,
  ScrollText,
  Sparkles,
  Text,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/marketing/faq";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { TransformationDemo } from "@/components/marketing/transformation-demo";

const outputs = [
  {
    icon: ScrollText,
    name: "Polished case study",
    blurb: "Problem, role, process, evidence, results — the full story.",
  },
  {
    icon: ListChecks,
    name: "Resume bullets",
    blurb: "Action verb, scope, quantified result. Paste-ready.",
  },
  {
    icon: IdCard,
    name: "Portfolio card",
    blurb: "A tight project card for your site or portfolio page.",
  },
  {
    icon: Megaphone,
    name: "LinkedIn post",
    blurb: "Written to be posted, not to sound like AI wrote it.",
  },
  {
    icon: MessagesSquare,
    name: "Interview story",
    blurb: "STAR-format narrative for behavioral and technical rounds.",
  },
  {
    icon: FileText,
    name: "Technical summary",
    blurb: "For the engineer across the table.",
  },
  {
    icon: Text,
    name: "Plain-English summary",
    blurb: "For the recruiter who isn't one.",
  },
  {
    icon: Wrench,
    name: "Improvement checklist",
    blurb: "What would make this project genuinely stronger.",
  },
  {
    icon: Globe,
    name: "Public share page",
    blurb: "One clean link for applications and DMs.",
  },
  {
    icon: Download,
    name: "Markdown & PDF export",
    blurb: "Your content, portable, forever.",
  },
];

const steps = [
  {
    icon: ClipboardPaste,
    title: "Dump everything",
    body: "Paste notes, README text, report fragments, half-remembered bullet points. Messy is fine — messy is the point.",
  },
  {
    icon: Sparkles,
    title: "CaseForge structures it",
    body: "Your material is rebuilt into the case-study format reviewers actually read: problem, context, your role, process, evidence, results.",
  },
  {
    icon: PencilRuler,
    title: "Edit, export, share",
    body: "Fix what the draft got wrong, add what only you know, then export Markdown/PDF or publish a share page.",
  },
];

const audiences = [
  "CS students",
  "Data & finance students",
  "Interns",
  "Researchers",
  "Student founders",
  "Self-taught builders",
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-5">
            Proof-of-work engine for students &amp; builders
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Turn messy work into{" "}
            <span className="text-primary dark:text-primary">
              proof of work.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            CaseForge turns projects, repos, internships, and research into
            polished case studies, resume bullets, and interview stories — in
            minutes, not a lost weekend before the deadline.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 w-full bg-emerald-600 px-6 text-base text-white hover:bg-emerald-700 sm:w-auto dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
              render={<Link href="/signup" />}
            >
              Forge your first case study — free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full px-6 text-base sm:w-auto"
              render={<Link href="/pricing" />}
            >
              See pricing
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free tier includes one full case study. No card required.
          </p>
        </div>

        <div className="mt-16">
          <TransformationDemo />
        </div>
      </section>

      {/* Pain */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Strong work reads as weak without the write-up
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-primary">~30 seconds</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                is what a recruiter spends on your resume. &ldquo;Worked on
                various projects&rdquo; doesn&apos;t survive that.
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                A repo isn&apos;t a story
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your README explains how to install it. It doesn&apos;t explain
                the problem, your decisions, or the result.
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                You know it — they don&apos;t
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The gap between what you did and what your application says you
                did is where offers are lost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outputs */}
      <section id="outputs" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One messy input. Ten finished artifacts.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every project you run through CaseForge produces the complete set
              — write once, use everywhere you apply.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {outputs.map((output) => (
              <div
                key={output.name}
                className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <output.icon
                  className="size-5 text-primary dark:text-primary"
                  aria-hidden
                />
                <h3 className="mt-3 text-sm font-semibold">{output.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {output.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-sm font-medium text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Built for people with real work and weak explanations
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {audiences.map((audience) => (
              <Badge
                key={audience}
                variant="outline"
                className="px-3 py-1.5 text-sm font-medium"
              >
                {audience}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Try it free on one project. Upgrade when you want all of them.
            </p>
          </div>
          <div className="mt-12">
            <PricingCards />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered straight
          </h2>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Your next application deserves better than
            <br className="hidden sm:block" />
            &ldquo;worked on various projects.&rdquo;
          </h2>
          <div className="mt-8">
            <Button
              size="lg"
              className="h-11 bg-emerald-500 px-6 text-base text-emerald-950 hover:bg-emerald-400"
              render={<Link href="/signup" />}
            >
              Start free — forge one now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
