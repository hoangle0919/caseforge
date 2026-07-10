import Link from "next/link";
import { Anvil } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-semibold text-foreground"
      >
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Anvil className="size-5" aria-hidden />
        </span>
        <span className="text-xl tracking-tight">CaseForge</span>
      </Link>
      {children}
    </main>
  );
}
