"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateCaseStudy, type ActionState } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditorFields = {
  id: string;
  title: string;
  positioning: string;
  problem: string;
  context: string;
  role: string;
  built: string;
  process: string;
  technical_details: string;
  results: string;
  skills: string;
  learned: string;
};

const sections: Array<{
  name: keyof Omit<EditorFields, "id" | "title" | "positioning" | "skills">;
  label: string;
  rows: number;
}> = [
  { name: "problem", label: "Problem", rows: 3 },
  { name: "context", label: "Context", rows: 2 },
  { name: "role", label: "My role", rows: 2 },
  { name: "built", label: "What I built", rows: 3 },
  { name: "process", label: "Process", rows: 3 },
  { name: "technical_details", label: "Technical details", rows: 3 },
  { name: "results", label: "Results & evidence", rows: 3 },
  { name: "learned", label: "What I learned", rows: 2 },
];

export function CaseStudyEditor({ caseStudy }: { caseStudy: EditorFields }) {
  const action = updateCaseStudy.bind(null, caseStudy.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Case study</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cs-title">Title</Label>
            <Input
              id="cs-title"
              name="title"
              defaultValue={caseStudy.title}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cs-positioning">One-line positioning</Label>
            <textarea
              id="cs-positioning"
              name="positioning"
              defaultValue={caseStudy.positioning}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          {sections.map((section) => (
            <div key={section.name} className="space-y-1.5">
              <Label htmlFor={`cs-${section.name}`}>{section.label}</Label>
              <textarea
                id={`cs-${section.name}`}
                name={section.name}
                defaultValue={caseStudy[section.name]}
                rows={section.rows}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="cs-skills">Skills (comma-separated)</Label>
            <Input id="cs-skills" name="skills" defaultValue={caseStudy.skills} />
          </div>

          {state?.error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
