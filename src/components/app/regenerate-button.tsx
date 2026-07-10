"use client";

import { useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { regenerateProject } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";

export function RegenerateButton({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await regenerateProject(projectId);
            if (result?.error) setError(result.error);
          })
        }
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
            Forging — this takes a minute or two…
          </>
        ) : (
          <>
            <RefreshCw data-icon="inline-start" aria-hidden />
            Generate case study
          </>
        )}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
