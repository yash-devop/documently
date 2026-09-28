import { Container } from "@repo/ui";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

const REFUSAL =
  "I couldn't find that in your documents. The vendor agreement covers termination, fees, and confidentiality, but it doesn't say anything about renewal terms, so I can't tell you how the contract extends. Upload the renewal addendum, or ask me something the agreement does cover.";

const CELLS = [
  {
    title: "Your document library",
    body: "Uploaded documents stick around. Reattach any of them to a new chat in one click instead of hunting through your downloads folder.",
  },
  {
    title: "Many documents, one thread",
    body: "Ask across a whole folder at once. Follow-ups like “the second point” and “tell me again” keep the same grounding instead of starting over.",
  },
  {
    title: "You can see it indexing",
    body: "Documents move from Processing to Ready in the open. You know whether a gap in an answer means the text isn't there or the index isn't finished.",
  },
  {
    title: "Reads like a document",
    body: "Answers stream in as they’re written, with headings, lists, tables, and code formatted properly instead of dumped as one wall of text.",
  },
];

export function FeatureBento() {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-y border-border-lighter bg-foreground-lighter/10 py-20 sm:py-28"
    >
      <Container size="lg">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
            Built to be checked
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-lighter sm:text-lg">
            The useful part of a document assistant isn&rsquo;t the answer.
            It&rsquo;t knowing where the answer came from — and that nothing was
            made up to fill the gap.
          </p>
        </Reveal>

        <RevealGroup stagger={0.07} className="mt-12 grid gap-4 lg:grid-cols-3">
          {/* Anchor. This is the whole differentiator, so it gets the space. */}
          <RevealItem className="lg:col-span-2 lg:row-span-2">
            <div className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-border-lighter bg-background p-6 sm:p-8">
              <div>
                <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                  It says when it doesn&rsquo;t know
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-lighter">
                  Documently is told to answer from your documents and nothing
                  else. When your files don&rsquo;t contain something, it
                  reports that instead of reaching for a plausible-sounding
                  answer.
                </p>
              </div>

              <div className="rounded-xl border border-border-lighter bg-foreground-lighter/5 p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-foreground-lighter">
                  You asked
                </p>
                <div className="mt-2 flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md border border-primary/40 bg-primary-lighter px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                    How long is the contract, and does it auto-renew?
                  </p>
                </div>
                <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-foreground-lighter">
                  Documently
                </p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground">
                  {REFUSAL}
                </p>
              </div>
            </div>
          </RevealItem>

          {CELLS.map((cell) => (
            <RevealItem key={cell.title}>
              <div className="interactive-surface h-full rounded-2xl border border-border-lighter bg-background p-6">
                <h3 className="text-sm font-medium tracking-tight">
                  {cell.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-lighter">
                  {cell.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
