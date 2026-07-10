import Link from "next/link";
import { Anvil } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#outputs", label: "What you get" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/signup", label: "Start free" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-foreground"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Anvil className="size-4.5" aria-hidden />
              </span>
              <span className="text-lg tracking-tight">CaseForge</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Turn messy projects, repos, and research into polished proof of
              work.
            </p>
          </div>
          <div className="flex gap-16">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-sm font-semibold text-foreground">
                  {col.heading}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 border-t pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CaseForge. Built independently.
        </p>
      </div>
    </footer>
  );
}
