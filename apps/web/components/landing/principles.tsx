import { IconCheck } from "@tabler/icons-react";

import { Container } from "@repo/ui";
import { RevealGroup, RevealItem } from "./reveal";

/**
 * The one angle the rest of the page doesn't sell: how-it-works covers the
 * pipeline and the bento covers workflow features, but nothing states why an
 * answer can be trusted. Grounding is the product, so it gets its own section.
 * Three claims, not four — the fourth would have been a restatement.
 */
const TRUST = [
  {
    title: "Built from your text",
    body: "Answers are assembled only from the passages Documently pulled out of the PDFs you uploaded. Nothing comes from the open web, or from what a model happens to know about your industry.",
  },
  {
    title: "Finds meaning, not keywords",
    body: "Your question and your passages are embedded the same way, then matched on meaning. A contract that calls it a “termination for convenience” still answers a question about how to exit early.",
  },
  {
    title: "Straight answers when the text runs out",
    body: "If the answer isn't in your documents, that's what you get told — rather than a fluent paragraph assembled out of plausible-sounding filler.",
  },
];

export function Principles() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="lg">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <RevealItem>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
              Answers you can check
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-lighter">
              The gap between a useful answer and a confident guess is whether
              you can trace it back. Every Documently answer can.
            </p>
          </RevealItem>

          <RevealGroup
            stagger={0.08}
            className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
          >
            {TRUST.map((item) => (
              <RevealItem key={item.title}>
                <div className="flex gap-3">
                  <IconCheck
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-foreground"
                    stroke={1.75}
                  />
                  <div>
                    <h3 className="text-sm font-medium leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-lighter">
                      {item.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
