import { z } from "zod";
import { getProvider } from "./index";

/**
 * One generation call produces the structured case study plus every
 * derivative artifact. Matches the case_studies + generated_outputs tables.
 */
export const caseStudyGenerationSchema = z.object({
  title: z.string().describe("Specific, concrete project title — not clickbait"),
  positioning: z.string().describe("One-line positioning of the project"),
  problem: z.string().describe("The problem, stated so a stranger cares"),
  context: z.string().describe("Where and for whom this happened"),
  role: z.string().describe("What the author was responsible for"),
  built: z.string().describe("What was actually built or done"),
  process: z.string().describe("Key decisions and how the work unfolded"),
  technicalDetails: z.string().describe("Stack, architecture, notable choices"),
  results: z
    .string()
    .describe("Outcomes with evidence; quantified where the input allows"),
  skills: z.array(z.string()).describe("Skills demonstrated, 3-8 items"),
  learned: z.string().describe("What the author genuinely learned"),
  resumeBullets: z
    .array(z.string())
    .describe("2-4 resume bullets: action verb, scope, quantified result"),
  interviewStory: z
    .string()
    .describe("STAR-format narrative for behavioral interviews, ~150 words"),
  linkedinPost: z
    .string()
    .describe("LinkedIn post ready to publish, human voice, no hashtag spam"),
  technicalSummary: z
    .string()
    .describe("3-5 sentence summary for a technical reader"),
  plainSummary: z
    .string()
    .describe("2-3 sentence summary a non-technical recruiter understands"),
  improvementChecklist: z
    .array(z.string())
    .describe("4-6 concrete actions that would make this project stronger"),
});

export type CaseStudyGeneration = z.infer<typeof caseStudyGenerationSchema>;

const SYSTEM = `You are CaseForge, a writing engine that turns messy notes about real student/builder projects into polished proof-of-work artifacts.

Rules:
- Work only from what the input supports. Never invent metrics, employers, or outcomes. If the input has no numbers, describe results qualitatively and precisely instead of fabricating figures.
- Write like a sharp human, not a press release. No buzzwords ("passionate", "leveraged synergies"), no em-dash-heavy AI cadence, no "I'm excited to announce".
- Resume bullets follow: strong action verb + what was built/done + scope + result.
- The interview story follows STAR (Situation, Task, Action, Result) in first person, told naturally rather than labeled.
- The LinkedIn post should read like a person reflecting on real work: a concrete hook, the problem, what they did, one honest lesson. No hashtag walls.
- The improvement checklist must be honest and specific to this project — things that would genuinely make it stronger, not generic advice.
- Keep every section grounded in the concrete details the author gave; surface the most impressive true facts.`;

export async function generateCaseStudy(input: {
  title: string;
  kind: string;
  rawInput: string;
}) {
  const provider = getProvider();
  return provider.generateStructured({
    system: SYSTEM,
    prompt: `Project title (from the author, improve it if weak): ${input.title}
Kind of work: ${input.kind}

The author's raw, messy input follows. Turn it into the full set of artifacts.

<raw_input>
${input.rawInput}
</raw_input>`,
    schema: caseStudyGenerationSchema,
  });
}
