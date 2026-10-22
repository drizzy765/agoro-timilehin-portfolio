"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Blur-fade-up on scroll into view.
 * Always renders the same motion.div on server and client: branching the element tree on
 * useReducedMotion() (which reads matchMedia during the first client render) caused hydration
 * mismatches, leaving the prerendered `opacity:0` style stuck for reduced-motion users.
 * Reduced motion now only changes the (non-DOM) transition: content appears instantly.
 */
export function Reveal({ children, delay = 0, className, y = 14 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
