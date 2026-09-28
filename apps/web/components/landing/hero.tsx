import Link from "next/link";

import { Button, Container } from "@repo/ui";
import { HeroProductMoment } from "./hero-product-moment";
import { Reveal } from "./reveal";
import { SweepUnderline } from "./sweep";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-24">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-60"
      />

      <Container size="lg" className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border-lighter bg-background px-3 py-1 text-xs text-foreground-lighter">
              <span className="size-1.5 rounded-full bg-primary" />
              PDFs, finally answerable
            </span>
          </Reveal>

          {/* Leads with the cost of the status quo, not with the product's
              restraint. The mechanism is the second beat, so the headline can
              just be the thing people recognise. */}
          <Reveal delay={0.06}>
            {/* The underline lands on the trailing phrase rather than the whole
                line: a block-level rule would sit under the last line of a
                wrapped headline and read as a mistake. */}
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl">
              Stop re-reading the same{" "}
              <span className="relative inline-block sm:whitespace-nowrap">
                40 pages.
                <SweepUnderline />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground-lighter sm:text-lg">
              Upload a PDF, ask your question, and get an answer built from the
              exact passages that matter — pulled from your document, not from
              memory.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/signup" />}
              >
                Get started free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                render={<a href="#how-it-works" />}
              >
                See how it works
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Deliberately no fade-up here. A translateY on this wrapper moved the
            whole product box on load, which read as the "shifting container"
            bug. The demo animates its own contents, so it needs no entrance
            transform — only the margin. */}
        <div className="mt-14 sm:mt-16">
          <HeroProductMoment className="mx-auto max-w-2xl" />
        </div>
      </Container>
    </section>
  );
}
