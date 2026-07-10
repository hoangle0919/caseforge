import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const rawNotes = [
  "- built a scraper w/ python + selenium??",
  "- cleaned messy price data, pandas",
  "- made dashboard for the finance club",
  "- idk how to explain the modeling part",
  "- it saved people time i think",
];

const derivatives = ["Resume bullets", "LinkedIn post", "Interview story"];

export function TransformationDemo() {
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.15fr]">
      {/* Before: raw notes */}
      <div className="flex flex-col rounded-xl border bg-muted/50">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            what you have
          </span>
        </div>
        <div className="flex-1 p-5">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            notes.txt
          </p>
          <ul className="mt-3 space-y-2">
            {rawNotes.map((line) => (
              <li
                key={line}
                className="font-mono text-[13px] leading-relaxed text-muted-foreground"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center py-1 text-muted-foreground">
        <ArrowRight className="hidden size-6 lg:block" aria-hidden />
        <ArrowDown className="size-6 lg:hidden" aria-hidden />
        <span className="sr-only">becomes</span>
      </div>

      {/* After: polished case study */}
      <div className="flex flex-col rounded-xl border bg-card shadow-lg shadow-primary/5">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">
            what recruiters see
          </span>
          <Badge
            variant="secondary"
            className="bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
          >
            Case study
          </Badge>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-lg font-semibold tracking-tight">
            Equity Price Pipeline for a 40-Member Finance Club
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {["Python", "Selenium", "pandas", "Streamlit"].map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">Problem</dt>
              <dd className="text-muted-foreground">
                Weekly stock pitches relied on hand-copied price data — slow
                and error-prone.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">What I built</dt>
              <dd className="text-muted-foreground">
                An automated scrape-clean-visualize pipeline feeding a live
                dashboard the whole club uses.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Result</dt>
              <dd className="text-muted-foreground">
                Cut pitch prep from ~3 hours to 20 minutes for 40 members,
                every week.
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t px-5 py-3">
          {derivatives.map((d) => (
            <span
              key={d}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Check
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
