import { Badge, Container } from "@repo/ui";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

/** Mirrors the real pipeline in `apps/worker` and the retrieval step in
 *  `apps/server/src/modules/llm/llm.service.ts`. */
const STEPS = [
  {
    id: "01",
    title: "Attach",
    body: "Drop PDFs straight into the composer, or pull ones you've uploaded before. A single chat can hold as many documents as the question needs.",
    aside: "vendor-agreement.pdf",
  },
  {
    id: "02",
    title: "Index",
    body: "A worker downloads the file, pulls out the text, cleans it, splits it into chunks, and embeds each one. You watch it move from Processing to Ready.",
    aside: "284 chunks indexed",
  },
  {
    id: "03",
    title: "Ask",
    body: "Your question is embedded the same way, matched against your documents, and answered from the closest passages. Tokens stream back as they're written.",
    aside: "5 passages retrieved",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <Container size="lg">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
            Three steps, no black box
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-lighter sm:text-lg">
            You can see each stage, because each one actually happens.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {STEPS.map((step) => (
            <RevealItem key={step.id}>
              <div className="flex h-full flex-col border-t border-border-lighter pt-5">
                <span className="font-mono text-xs text-foreground-lighter">
                  {step.id}
                </span>
                <h3 className="mt-3 text-lg font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-lighter">
                  {step.body}
                </p>
                <div className="mt-5">
                  <Badge variant="outline" className="font-mono">
                    {step.aside}
                  </Badge>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
