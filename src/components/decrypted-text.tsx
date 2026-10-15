"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]#%&*+=";

/** Text that scrambles and resolves letter by letter on mount. SSR renders the final text. */
export function DecryptedText({ text, delay = 0, speed = 38, className }: { text: string; delay?: number; speed?: number; className?: string }) {
  const [out, setOut] = useState(text);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revealed = 0;
    let last = 0;
    let started = false;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      if (now < t0) {
        if (!started) {
          started = true;
          setOut(scramble(text, 0));
        }
        raf.current = requestAnimationFrame(tick);
        return;
      }
      // Time-based (not frame-based) so it always resolves on schedule, even on slow devices.
      if (now - last > 30) {
        last = now;
        revealed = Math.min(text.length, Math.floor((now - t0) / speed) + 1);
        setOut(scramble(text, revealed));
      }
      if (revealed < text.length) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, delay, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

function scramble(text: string, revealed: number) {
  return text
    .split("")
    .map((ch, i) => (i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join("");
}
