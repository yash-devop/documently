import Link from "next/link";

import { Container } from "@repo/ui";
import { DocumentlySolo } from "@/components/logos/documently-solo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border-lighter py-10">
      <Container size="lg">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <DocumentlySolo className="size-5" />
            <span className="text-sm font-medium">Documently</span>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-xs text-foreground-lighter transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-ui)] hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="text-xs text-foreground-lighter transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-ui)] hover:text-foreground"
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="text-xs text-foreground-lighter transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-ui)] hover:text-foreground"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
