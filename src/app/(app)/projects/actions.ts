"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateCaseStudy } from "@/lib/llm/case-study";
import { canCreateCaseStudy, getPlan } from "@/lib/subscription";

export type ActionState = { error: string } | null;

const projectInputSchema = z.object({
  title: z.string().trim().min(3, "Give the project a title (3+ characters)"),
  kind: z.enum(["notes", "repo", "report", "internship", "research", "other"]),
  rawInput: z
    .string()
    .trim()
    .min(80, "Paste at least a few sentences — the more raw material, the better the output")
    .max(50000, "Input is too long — trim to the essentials (50k characters max)"),
});

export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = projectInputSchema.safeParse({
    title: formData.get("title"),
    kind: formData.get("kind"),
    rawInput: formData.get("rawInput"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const gate = await canCreateCaseStudy(supabase, user.id);
  if (!gate.allowed) {
    redirect("/billing?reason=limit");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      input_kind: parsed.data.kind,
      raw_input: parsed.data.rawInput,
    })
    .select("id")
    .single();
  if (projectError || !project) {
    return { error: "Could not save the project. Try again." };
  }

  const result = await runGeneration(supabase, user.id, {
    id: project.id,
    title: parsed.data.title,
    kind: parsed.data.kind,
    rawInput: parsed.data.rawInput,
  });
  if (result) return result;

  redirect(`/projects/${project.id}`);
}

/** Generate + persist a case study and its outputs. Returns an error state or null. */
async function runGeneration(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  project: { id: string; title: string; kind: string; rawInput: string },
): Promise<ActionState> {
  let generation;
  try {
    generation = await generateCaseStudy({
      title: project.title,
      kind: project.kind,
      rawInput: project.rawInput,
    });
  } catch (err) {
    console.error("generation failed", err);
    return {
      error:
        "Generation failed — your input was saved as a draft. Try again in a minute.",
    };
  }

  const g = generation.data;
  const { data: caseStudy, error: caseStudyError } = await supabase
    .from("case_studies")
    .insert({
      project_id: project.id,
      user_id: userId,
      title: g.title,
      positioning: g.positioning,
      problem: g.problem,
      context: g.context,
      role: g.role,
      built: g.built,
      process: g.process,
      technical_details: g.technicalDetails,
      results: g.results,
      skills: g.skills,
      learned: g.learned,
    })
    .select("id")
    .single();
  if (caseStudyError || !caseStudy) {
    console.error("case study insert failed", caseStudyError);
    return { error: "Generation succeeded but saving failed. Try again." };
  }

  const outputs = [
    { kind: "resume_bullets", content: { items: g.resumeBullets } },
    { kind: "linkedin_post", content: { text: g.linkedinPost } },
    { kind: "interview_story", content: { text: g.interviewStory } },
    { kind: "technical_summary", content: { text: g.technicalSummary } },
    { kind: "plain_summary", content: { text: g.plainSummary } },
    { kind: "improvement_checklist", content: { items: g.improvementChecklist } },
  ].map((o) => ({
    ...o,
    case_study_id: caseStudy.id,
    user_id: userId,
    model: generation.model,
  }));
  await supabase.from("generated_outputs").insert(outputs);

  await supabase
    .from("projects")
    .update({ status: "generated" })
    .eq("id", project.id);

  return null;
}

/** Re-run generation for a saved project whose first attempt failed. */
export async function regenerateProject(
  projectId: string,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, input_kind, raw_input, case_studies(id)")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();
  if (!project) return { error: "Project not found." };
  if (project.case_studies?.length) {
    return { error: "This project already has a case study." };
  }

  const result = await runGeneration(supabase, user.id, {
    id: project.id,
    title: project.title,
    kind: project.input_kind,
    rawInput: project.raw_input,
  });
  if (result) return result;

  revalidatePath(`/projects/${projectId}`);
  return null;
}

const caseStudyUpdateSchema = z.object({
  title: z.string().trim().min(1),
  positioning: z.string(),
  problem: z.string(),
  context: z.string(),
  role: z.string(),
  built: z.string(),
  process: z.string(),
  technical_details: z.string(),
  results: z.string(),
  skills: z.string(), // comma-separated in the form
  learned: z.string(),
});

export async function updateCaseStudy(
  caseStudyId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = Object.fromEntries(
    Object.keys(caseStudyUpdateSchema.shape).map((key) => [
      key,
      formData.get(key) ?? "",
    ]),
  );
  const parsed = caseStudyUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("case_studies")
    .update({
      ...parsed.data,
      skills: parsed.data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    })
    .eq("id", caseStudyId)
    .eq("user_id", user.id);

  if (error) return { error: "Saving failed. Try again." };

  revalidatePath("/projects/[id]", "page");
  return null;
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = crypto.randomUUID().slice(0, 6);
  return `${base}-${suffix}`;
}

export async function togglePublish(caseStudyId: string): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getPlan(supabase, user.id);
  if (plan !== "pro") redirect("/billing?reason=publish");

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("id, title")
    .eq("id", caseStudyId)
    .eq("user_id", user.id)
    .single();
  if (!caseStudy) return { error: "Case study not found." };

  const { data: existing } = await supabase
    .from("public_pages")
    .select("id, is_published")
    .eq("case_study_id", caseStudyId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("public_pages")
      .update({ is_published: !existing.is_published })
      .eq("id", existing.id);
  } else {
    await supabase.from("public_pages").insert({
      case_study_id: caseStudyId,
      user_id: user.id,
      slug: slugify(caseStudy.title),
      is_published: true,
    });
  }

  revalidatePath("/projects/[id]", "page");
  return null;
}
