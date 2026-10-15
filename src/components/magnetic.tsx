"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Pulls its child a few px toward the cursor. Fine pointers only; off for reduced motion. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.5 });
  useEffect(() => setOn(window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce), [reduce]);
  if (!on) return <span className={className}>{children}</span>;
  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className ?? ""}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
