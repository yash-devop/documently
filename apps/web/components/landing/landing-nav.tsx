"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@repo/ui";
import { DocumentlyLogo } from "@/components/logos/documently-long";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-ui)] ease-[var(--ease-out-ui)]",
        scrolled
          ? "border-b border-border-lighter bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Documently home">
          <DocumentlyLogo className="h-[22px] w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-lighter transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-ui)] hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            render={<Link href="/login">Sign in</Link>}
          />
          <Button size="sm" render={<Link href="/signup">Get started</Link>} />
        </div>
      </div>
    </header>
  );
}
