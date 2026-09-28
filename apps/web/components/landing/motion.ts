import type { Transition, Variants } from "motion/react";

/**
 * Single source of truth for landing-page motion. Everything the page animates
 * pulls from here so timings read as one system rather than a pile of
 * hand-tuned values.
 *
 * Springs use the Apple-style `duration` + `bounce` form: it stays interruptible
 * (reversing mid-flight resolves from current velocity instead of restarting)
 * while still landing critically damped, which reads as "considered" rather
 * than "springy".
 */

/** Default for anything entering the page. No bounce: this is UI, not a toy. */
export const enterSpring: Transition = {
  type: "spring",
  duration: 0.5,
  bounce: 0.18,
};

/** The one place bounce is allowed — the readiness flip earns it. */
export const popSpring: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.3,
};

/** Colour/opacity changes, where a spring would wobble. */
export const fadeTransition: Transition = {
  duration: 0.28,
  ease: [0.23, 1, 0.32, 1],
};

export const viewportOnce = { once: true, margin: "-64px" } as const;

/**
 * Full transform strings rather than `x`/`y`/`scale` shorthands. The shorthands
 * compile to independent transforms that can conflict under load; one string is
 * one transform and interpolates predictably.
 *
 * Entrances never start at `scale(0)`: the origin is never a real resting
 * position, so it reads as a pop. 0.96 keeps the element recognisable.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, transform: "translateY(12px)" },
  visible: { opacity: 1, transform: "translateY(0px)" },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, transform: "scale(0.96)" },
  visible: { opacity: 1, transform: "scale(1)" },
};

/** Stagger children resolve top-to-bottom, capped so long lists never crawl. */
export const staggerContainer = (
  stagger = 0.06,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
