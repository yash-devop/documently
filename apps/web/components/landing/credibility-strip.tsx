import { Container } from "@repo/ui";

/**
 * Replaces the logo wall we can't fill. An empty logo strip costs more trust
 * than omitting it, and the actual stack is a better signal for this audience
 * than borrowed brand names.
 */
const STACK = [
  "Gemini 3.5 Flash",
  "MiniLM · 384-dim",
  "pgvector cosine",
  "BullMQ workers",
];

export function CredibilityStrip() {
  return (
    <section className="border-y border-border-lighter bg-foreground-lighter/10">
      <Container size="lg" className="py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {STACK.map((item) => (
            <li
              key={item}
              className="font-mono text-xs tracking-tight text-foreground-lighter"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
