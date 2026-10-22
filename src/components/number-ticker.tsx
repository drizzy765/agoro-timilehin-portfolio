"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function NumberTicker({ value, className, suffix = "" }: { value: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      // Reduced motion: jump straight to the value (after hydration, so SSR/CSR text matches).
      setN(value);
      prev.current = value;
      return;
    }
    const c = animate(prev.current, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    prev.current = value;
    return () => c.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
