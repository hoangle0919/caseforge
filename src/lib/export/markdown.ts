type CaseStudyRow = {
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

type OutputRow = {
  kind: string;
  content: { text?: string; items?: string[] };
};

const sectionOrder: Array<[keyof CaseStudyRow, string]> = [
  ["problem", "Problem"],
  ["context", "Context"],
  ["role", "My role"],
  ["built", "What I built"],
  ["process", "Process"],
  ["technical_details", "Technical details"],
  ["results", "Results & evidence"],
  ["learned", "What I learned"],
];

const outputLabels: Record<string, string> = {
  resume_bullets: "Resume bullets",
  linkedin_post: "LinkedIn post",
  interview_story: "Interview story",
  technical_summary: "Technical summary",
  plain_summary: "Plain-English summary",
  improvement_checklist: "Improvement checklist",
};

export function renderCaseStudyMarkdown(
  caseStudy: CaseStudyRow,
  outputs: OutputRow[],
): string {
  const lines: string[] = [`# ${caseStudy.title}`, ""];

  if (caseStudy.positioning) {
    lines.push(`> ${caseStudy.positioning}`, "");
  }
  if (caseStudy.skills?.length) {
    lines.push(`**Skills:** ${caseStudy.skills.join(" · ")}`, "");
  }

  for (const [key, label] of sectionOrder) {
    const value = caseStudy[key];
    if (typeof value === "string" && value.trim()) {
      lines.push(`## ${label}`, "", value.trim(), "");
    }
  }

  const sorted = [...outputs].sort(
    (a, b) =>
      Object.keys(outputLabels).indexOf(a.kind) -
      Object.keys(outputLabels).indexOf(b.kind),
  );
  if (sorted.length) {
    lines.push("---", "", "# Derivative artifacts", "");
    for (const output of sorted) {
      lines.push(`## ${outputLabels[output.kind] ?? output.kind}`, "");
      if (output.content.items) {
        for (const item of output.content.items) lines.push(`- ${item}`);
      } else if (output.content.text) {
        lines.push(output.content.text.trim());
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}
