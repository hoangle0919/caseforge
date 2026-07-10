import type { Metadata } from "next";
import { Faq } from "@/components/marketing/faq";
import { PricingCards } from "@/components/marketing/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "CaseForge pricing: one free case study to prove it works, then $5/month for unlimited case studies, share pages, and exports.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          One price. No tiers to decode.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Run your best project through the free tier and judge the output
          yourself. Pro is $5/month — about the cost of one coffee — and covers
          everything.
        </p>
      </div>

      <div className="mt-14">
        <PricingCards />
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Common questions
        </h2>
        <div className="mt-8">
          <Faq />
        </div>
      </div>
    </div>
  );
}
