"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, Container } from "@repo/ui";
import { fadeTransition } from "./motion";
import { Reveal } from "./reveal";
import { Caret, SweepUnderline } from "./sweep";

/**
 * Illustrative of the use case, not claims about capability: these are the kind
 * of question someone actually asks a contract, a policy, or a spec.
 */
const QUESTIONS = [
  "What does the termination clause say?",
  "How much notice do I need to give?",
  "Which clause covers subcontractors?",
  "What are the payment terms?",
  "What happens if I miss a deadline?",
  "Does this cover data processing?",
];

const ROTATE_MS = 2600;

export function FinalCta() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % QUESTIONS.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const question = QUESTIONS[reduceMotion ? 0 : index];

  return (
    <section className="border-t border-border-lighter py-20 sm:py-28">
      <Container size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
                Point it at a document{" "}
                {/* inline-block keeps the phrase whole, so the drawn underline
                    stays attached to it instead of splitting across lines */}
                <span className="relative inline-block sm:whitespace-nowrap">
                  you&rsquo;d rather not reread
                  <SweepUnderline />
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-foreground-lighter sm:text-lg">
                Upload a PDF, ask the question you&rsquo;d normally skim for,
                and get the passage that answers it.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
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
                  render={<Link href="/login" />}
                >
                  Sign in
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-xl border border-border-lighter bg-background p-6 sm:p-8">
              <p className="font-mono text-xs tracking-[0.14em] text-foreground-lighter uppercase">
                Try asking
              </p>

              <div className="mt-5 flex min-h-[6.5rem] items-start">
                {/* Enter-only, deliberately. `AnimatePresence mode="wait"` holds
                    the new child back until the exit animation reports done, so
                    a stalled rAF (backgrounded tab) freezes the text on one
                    question forever. Keying alone remounts and replays the
                    entrance, which reads the same at this duration. */}
                <motion.p
                  key={question}
                  className="text-xl leading-snug tracking-[-0.01em] sm:text-2xl"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={fadeTransition}
                >
                  {question}
                  <Caret />
                </motion.p>
              </div>

              <p className="mt-6 border-t border-border-lighter pt-5 text-sm leading-relaxed text-foreground-lighter">
                The same question against a folder of twenty documents returns
                one answer, grounded in whichever of them actually contained it.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
