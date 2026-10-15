"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SphereStatic } from "./sphere-static";

const SphereCanvas = dynamic(() => import("./sphere-canvas"), { ssr: false });

/** Lazy 3D sphere: mounts near viewport, pauses offscreen, static fallback for reduced motion / low-end. */
export function HeroSphere() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"static" | "3d">("static");
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowEnd = (nav.deviceMemory !== undefined && nav.deviceMemory < 4) || nav.connection?.saveData || (navigator.hardwareConcurrency ?? 8) < 4;
    let webgl = false;
    try {
      webgl = !!document.createElement("canvas").getContext("webgl2");
    } catch {}
    if (reduce || lowEnd || !webgl) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (ref.current) io.observe(ref.current);
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const start = () => setMode("3d");
    if (idle) idle(start);
    else setTimeout(start, 200);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-square w-full">
      <div className={`absolute inset-0 transition-opacity duration-700 ${mode === "3d" && ready ? "opacity-0" : "opacity-100"}`}>
        <SphereStatic className="size-full" />
      </div>
      {mode === "3d" && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <SphereCanvas active={visible} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
