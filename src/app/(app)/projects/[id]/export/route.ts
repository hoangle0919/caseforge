import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderCaseStudyMarkdown } from "@/lib/export/markdown";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project } = await supabase
    .from("projects")
    .select(
      `id,
       case_studies (
         title, positioning, problem, context, role, built, process,
         technical_details, results, skills, learned,
         generated_outputs (kind, content)
       )`,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const caseStudy = project?.case_studies?.[0];
  if (!caseStudy) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const markdown = renderCaseStudyMarkdown(
    caseStudy,
    caseStudy.generated_outputs ?? [],
  );
  const filename = caseStudy.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename || "case-study"}.md"`,
    },
  });
}
