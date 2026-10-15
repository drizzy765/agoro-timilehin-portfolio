"use client";

import { motion } from "motion/react";

/** The small rule in section kickers draws in from the left when the heading enters. */
export function HeadingRule() {
  return (
    <motion.span
      aria-hidden
      className="h-px w-8 origin-left bg-lime/60"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
