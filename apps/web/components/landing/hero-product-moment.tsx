"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge, Button } from "@repo/ui";
import { cn } from "@/lib/cn";
import { enterSpring, popSpring, scaleIn } from "./motion";

const QUESTION = "What are the termination clauses in the vendor agreement?";

const ANSWER = `Clause 8 sets out three termination routes.

For cause — either party may terminate on 30 days' written notice if the other materially breaches and fails to cure inside that window.

For insolvency — termination is immediate on the filing of an insolvency petition.

For convenience — only the Customer may exit early, on 60 days' notice, paying all fees due through the termination date.

Section 8.4 adds a carve-out: terminating does not release either party from the confidentiality obligations in Section 12, which survive for five years.`;

/** The retrieved chunks. Makes the vector search visible instead of implied. */
const CHUNKS = [
  { file: "vendor-agreement.pdf", section: "§8.2 · Termination for cause" },
  { file: "vendor-agreement.pdf", section: "§8.4 · Survival of obligations" },
  { file: "vendor-agreement.pdf", section: "§12.1 · Confidentiality" },
];

const CYCLE_MS = 8000;

const T = {
  question: 600,
  docReady: 1200,
  chunks: 1900,
  answerStart: 2500,
  answerEnd: 6600,
  fadeOut: 7200,
  reset: 7400,
} as const;

const TICK_MS = 40;

function HeroProductMoment({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const convoRef = useRef<HTMLDivElement>(null);
  const convoContentRef = useRef<HTMLDivElement>(null);
  // Starts partway through the script so the first paint — including the
  // server-rendered one — already shows the question, the Ready badge, and the
  // retrieved chunks. Beginning at 0 would mean the fold opens on an empty
  // frame, and a no-JS load would show nothing at all.
  const [elapsed, setElapsed] = useState<number>(T.chunks);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setElapsed((e) => (e + TICK_MS) % CYCLE_MS);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  // Follow the newest text. Keyed off content growth rather than the timeline
  // so every appended token and the wrap caused by each new line are covered,
  // not just the tick that revealed them.
  useEffect(() => {
    const content = convoContentRef.current;
    if (!content) return;
    const pin = () => {
      const el = convoRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    };
    const observer = new ResizeObserver(pin);
    observer.observe(content);
    pin();
    return () => observer.disconnect();
  }, []);

  const state = useMemo(() => {
    if (reduceMotion) {
      return {
        showQuestion: true,
        docReady: true,
        showChunks: true,
        answerText: ANSWER,
        conversationOpacity: 1,
        caret: false,
      };
    }

    const conversationOpacity =
      elapsed > T.fadeOut
        ? Math.max(0, (CYCLE_MS - elapsed) / (CYCLE_MS - T.fadeOut))
        : 1;

    const progress = Math.min(
      1,
      Math.max(0, (elapsed - T.answerStart) / (T.answerEnd - T.answerStart)),
    );

    return {
      showQuestion: elapsed >= T.question,
      docReady: elapsed >= T.docReady,
      showChunks: elapsed >= T.chunks,
      answerText: ANSWER.slice(0, Math.round(progress * ANSWER.length)),
      conversationOpacity,
      caret: elapsed >= T.answerStart && elapsed < T.answerEnd,
    };
  }, [elapsed, reduceMotion]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-lighter bg-background shadow-sm",
        className,
      )}
    >
      {/* Document status strip. Reuses the chat's own status-pill treatment so
          the hero is recognisably the product rather than a mock of it. */}
      <div className="flex items-center justify-between gap-3 border-b border-border-lighter bg-foreground-lighter/20 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-xs font-medium text-foreground">
            vendor-agreement.pdf
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state.docReady ? "ready" : "processing"}
              initial={{ opacity: 0, transform: "scale(0.9)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.9)" }}
              transition={popSpring}
            >
              <Badge variant={state.docReady ? "success" : "warning"}>
                {state.docReady ? "Ready" : "Processing"}
              </Badge>
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="shrink-0 text-[10px] tabular-nums text-foreground-lighter">
          {state.docReady ? "284 chunks" : "indexing…"}
        </span>
      </div>

      {/* Fixed height, deliberately not `min-h`. The scripted answer streams in
          progressively, so a min-height lets this box grow token by token and
          shove everything below it down the page. Growth is absorbed by the
          clipped conversation area instead, and the composer stays pinned to
          the bottom. */}
      <div className="flex h-[26.5rem] flex-col sm:h-[27.5rem]">
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <motion.div
            className="flex min-h-0 flex-1 flex-col"
            animate={{ opacity: state.conversationOpacity }}
          >
            {/* Fixed-height, internally scrolling, pinned to the newest text.
                The scripted answer is longer than the box, so clipping it would
                cut the demo off mid-sentence; letting the box grow would shove
                the rest of the page down. Scrolling inside keeps the hero
                geometry constant while the full answer stays readable. */}
            <div
              ref={convoRef}
              className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto"
            >
              <div ref={convoContentRef} className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {state.showQuestion && (
                    <motion.div
                      key="question"
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, transform: "translateY(4px)" }}
                      transition={enterSpring}
                      className="flex shrink-0 flex-col items-end gap-2"
                    >
                      <div className="max-w-[85%] rounded-2xl rounded-br-md border border-primary/40 bg-primary-lighter px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                        {QUESTION}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Retrieved chunks. This is the retrieval step made visible — the
              point of the product is that the answer came from these. */}
                <AnimatePresence initial={false}>
                  {state.showChunks && (
                    <motion.div
                      key="chunks"
                      initial={{ opacity: 0, transform: "translateY(8px)" }}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      exit={{ opacity: 0, transform: "translateY(4px)" }}
                      transition={{ ...enterSpring, staggerChildren: 0.07 }}
                      className="flex shrink-0 flex-col gap-1.5 self-start"
                    >
                      {CHUNKS.map((chunk) => (
                        <motion.div
                          key={chunk.section}
                          initial={{ opacity: 0, transform: "translateY(6px)" }}
                          animate={{ opacity: 1, transform: "translateY(0px)" }}
                          transition={enterSpring}
                          className="flex items-center gap-2 rounded-lg border border-border-lighter bg-foreground-lighter/5 px-2.5 py-1.5"
                        >
                          <span className="truncate font-mono text-[10px] text-foreground-lighter">
                            {chunk.file}
                          </span>
                          <span className="text-foreground-lighter/40">·</span>
                          <span className="truncate text-[10px] text-foreground-light">
                            {chunk.section}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {state.answerText.length > 0 && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, transform: "translateY(8px)" }}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      transition={enterSpring}
                      className="max-w-full self-start rounded-2xl text-sm leading-relaxed text-foreground"
                    >
                      <p className="whitespace-pre-wrap">{state.answerText}</p>
                      {state.caret && (
                        <motion.span
                          aria-hidden
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="ml-0.5 inline-block h-3.5 w-[1.5px] translate-y-0.5 bg-primary-500 align-middle"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="shrink-0 pt-2">
            <div className="flex items-center gap-2 rounded-xl border border-border-lighter bg-foreground-lighter/5 px-3 py-2">
              <span className="flex-1 truncate px-2 py-1.5 text-sm text-foreground-lighter">
                Ask anything about your documents…
              </span>
              <Button size="xs" className="pointer-events-none select-none">
                Ask
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeroProductMoment };
