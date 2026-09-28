"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/cn";
import { viewportOnce } from "./motion";

/**
 * The hand-drawn sweep and the typing caret, kept in one place so the two
 * headlines that use them can't drift apart. Both are decorative: the sweep is
 * a presentational `currentColor` stroke, and the caret is `aria-hidden` so
 * screen readers read the sentence, not the animation. The hero headline draws
 * only the sweep — a blinking cursor against static text reads as a loading
 * state rather than as emphasis.
 */
export function SweepUnderline({ className }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={cn(
        "absolute -bottom-1 left-0 h-2.5 w-full text-foreground sm:-bottom-2 sm:h-3",
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.path
        d="M2 8.5C58 3.5 148 2.5 298 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      />
    </motion.svg>
  );
}

export function Caret({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={cn(
        "ml-1 inline-block h-[1.1em] w-[0.45em] translate-y-[0.15em] bg-foreground",
        className,
      )}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
    />
  );
}
