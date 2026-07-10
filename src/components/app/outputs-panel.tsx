"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Output = {
  kind: string;
  content: { text?: string; items?: string[] };
};

const labels: Record<string, string> = {
  resume_bullets: "Resume bullets",
  linkedin_post: "LinkedIn post",
  interview_story: "Interview story",
  technical_summary: "Technical summary",
  plain_summary: "Plain-English summary",
  improvement_checklist: "Improvement checklist",
};

const order = Object.keys(labels);

function outputToText(output: Output): string {
  if (output.content.items) {
    return output.content.items.map((item) => `- ${item}`).join("\n");
  }
  return output.content.text ?? "";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Copy to clipboard"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? (
        <Check className="text-emerald-600 dark:text-emerald-400" aria-hidden />
      ) : (
        <Copy aria-hidden />
      )}
    </Button>
  );
}

export function OutputsPanel({ outputs }: { outputs: Output[] }) {
  const sorted = [...outputs].sort(
    (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind),
  );

  return (
    <div className="space-y-4">
      {sorted.map((output) => (
        <Card key={output.kind}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">
              {labels[output.kind] ?? output.kind}
            </CardTitle>
            <CopyButton text={outputToText(output)} />
          </CardHeader>
          <CardContent>
            {output.content.items ? (
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                {output.content.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {output.content.text}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
