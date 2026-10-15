"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

/** Fun hobby card with a subtle 3D tilt toward the cursor. */
export function HobbyCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 250, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 250, damping: 20 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      className="glow-card h-full rounded-2xl border border-line bg-surface p-6"
    >
      <span className="grid size-12 place-items-center rounded-xl border border-line bg-background text-2xl" aria-hidden>
        {emoji}
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-subtle">{body}</p>
    </motion.div>
  );
}
