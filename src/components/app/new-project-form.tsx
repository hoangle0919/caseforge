"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createProject, type ActionState } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const kinds = [
  { value: "notes", label: "Project notes" },
  { value: "repo", label: "GitHub repo / README" },
  { value: "report", label: "Report / class project" },
  { value: "internship", label: "Internship work" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
];

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createProject,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Project title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Price pipeline for the finance club"
          required
          minLength={3}
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          A rough title is fine — CaseForge will sharpen it.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kind">What kind of work is this?</Label>
        <select
          id="kind"
          name="kind"
          disabled={pending}
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          defaultValue="notes"
        >
          {kinds.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rawInput">The messy input</Label>
        <textarea
          id="rawInput"
          name="rawInput"
          required
          minLength={80}
          rows={12}
          disabled={pending}
          placeholder={
            "- built a scraper w/ python + selenium??\n- cleaned messy price data, pandas\n- made dashboard for the finance club\n- idk how to explain the modeling part\n- it saved people time i think"
          }
          className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="text-xs text-muted-foreground">
          Include anything true: what you did, tools, numbers, who it was for,
          what went wrong. Nothing is invented — the output only uses what you
          give it.
        </p>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
            Forging — this takes a minute or two…
          </>
        ) : (
          "Forge case study"
        )}
      </Button>
    </form>
  );
}
