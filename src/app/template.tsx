"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

// First paint is never animated (keeps LCP + no-JS intact); client navigations fade/slide in.
// - `navigated` only flips in the browser after the first mount, so prerendered HTML is identical for
//   every page (a module flag set during render leaked across pages in the static build -> hidden
//   content + hydration mismatch).
// - No filter/transform may remain after the transition: a lingering `filter: blur(0px)` makes this
//   wrapper the containing block for `position: fixed` descendants (modals end up off-screen).
let navigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = typeof window !== "undefined" && navigated;
  useEffect(() => {
    navigated = true;
  }, []);
  if (!animate) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none", transform: "none" } }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
