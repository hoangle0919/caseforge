import { Badge } from "@/components/ui/badge";

export type CaseStudyView = {
  title: string;
  positioning: string | null;
  problem: string | null;
  context: string | null;
  role: string | null;
  built: string | null;
  process: string | null;
  technical_details: string | null;
  results: string | null;
  skills: string[] | null;
  learned: string | null;
};

const sections: Array<[keyof CaseStudyView, string]> = [
  ["problem", "Problem"],
  ["context", "Context"],
  ["role", "My role"],
  ["built", "What I built"],
  ["process", "Process"],
  ["technical_details", "Technical details"],
  ["results", "Results & evidence"],
  ["learned", "What I learned"],
];

/** Read-only case study rendering shared by the public share page and PDF/print view. */
export function CaseStudyArticle({ caseStudy }: { caseStudy: CaseStudyView }) {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {caseStudy.title}
      </h1>
      {caseStudy.positioning && (
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {caseStudy.positioning}
        </p>
      )}
      {caseStudy.skills && caseStudy.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {caseStudy.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-8 space-y-7">
        {sections.map(([key, label]) => {
          const value = caseStudy[key];
          if (typeof value !== "string" || !value.trim()) return null;
          return (
            <section key={key}>
              <h2 className="text-lg font-semibold tracking-tight">{label}</h2>
              <p className="mt-2 leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {value}
              </p>
            </section>
          );
        })}
      </div>
    </article>
  );
}
