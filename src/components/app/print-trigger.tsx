"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintTrigger() {
  useEffect(() => {
    // Give fonts a beat to load before opening the dialog.
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mb-6 flex items-center justify-between print:hidden">
      <p className="text-sm text-muted-foreground">
        Choose &ldquo;Save as PDF&rdquo; in the print dialog.
      </p>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer data-icon="inline-start" aria-hidden />
        Print again
      </Button>
    </div>
  );
}
