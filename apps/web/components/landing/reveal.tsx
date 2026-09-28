"use client";

import { motion, MotionConfig } from "motion/react";

import { cn } from "@/lib/cn";
import { enterSpring, fadeUp, staggerContainer, viewportOnce } from "./motion";

/**
 * Scroll-triggered entrance for a single block.
 *
 * Uses Motion's `whileInView` rather than an IntersectionObserver that
 * toggles a class: the observer approach needs either React state (which the
 * `react-hooks/set-state-in-effect` rule rejects) or imperative class writes
 * that fight the renderer. `once` keeps it from re-animating on scroll-back,
 * and the negative margin means it fires slightly before the element is fully
 * on screen so the motion is already resolved by the time it's read.
 */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      data-reveal=""
      className={cn(className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ ...enterSpring, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for a staggered run of `RevealItem`s. Stagger is capped by the caller's
 * `stagger` value so a long list never crawls into view.
 */
function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      data-reveal=""
      className={cn(className)}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div data-reveal="" className={cn(className)} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/**
 * Scopes reduced-motion handling to the marketing page instead of changing chat
 * behaviour app-wide. `reducedMotion="user"` keeps opacity and drops transforms,
 * so arrival is still communicated without anything moving.
 */
function LandingMotion({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="contents">{children}</div>
    </MotionConfig>
  );
}

export { Reveal, RevealGroup, RevealItem, LandingMotion };
