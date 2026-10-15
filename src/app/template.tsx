"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// First paint is never animated (keeps LCP + no-JS intact); client navigations fade/slide in.
let hydrated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = hydrated;
  hydrated = true;
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10, filter: "blur(4px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
