"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { experience } from "@/content/site";
import { Reveal } from "./reveal";

function Logo({ src, org }: { src: string | null | undefined; org: string }) {
  const mono = org
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] sm:size-14">
      {src ? (
        <Image src={src} alt={`${org} logo`} width={56} height={56} className="size-full object-contain" />
      ) : (
        <span className="font-heading text-base font-semibold text-black">{mono}</span>
      )}
    </span>
  );
}

/** Experience timeline: logo nodes on a rail with a beam that traces down as you scroll. */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-line sm:left-7" />
      <motion.div
        aria-hidden
        style={{ height }}
        className="absolute top-6 left-6 w-px bg-gradient-to-b from-lime via-lime to-lime/20 shadow-[0_0_10px_color-mix(in_srgb,var(--c-accent)_70%,transparent)] sm:left-7"
      />
      <ol className="space-y-6">
        {experience.map((e, i) => (
          <li key={e.org} className="relative flex gap-4 sm:gap-6">
            <motion.div
              className="relative z-10 pt-5"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.05 + i * 0.06 }}
            >
              <Logo src={e.logo} org={e.org} />
            </motion.div>
            <Reveal delay={i * 0.05} className="min-w-0 flex-1">
              <article className="glow-card rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-lime/30 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg leading-snug font-semibold tracking-tight sm:text-xl">{e.role}</h3>
                    <p className="mt-0.5 text-[15px]">
                      {e.href ? (
                        <a href={e.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-cyan">
                          {e.org}
                          <ArrowUpRight className="size-3.5 opacity-60 transition group-hover:opacity-100" />
                        </a>
                      ) : (
                        <span className="text-foreground/90">{e.org}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <span
                      className={
                        e.current
                          ? "inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-2.5 py-1 font-mono text-[11px] text-lime"
                          : "rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-subtle"
                      }
                    >
                      {e.current && <span className="size-1.5 animate-pulse rounded-full bg-lime" />}
                      {e.period}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-subtle">
                      <MapPin className="size-3" /> {e.place}
                    </span>
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-subtle">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-[0.6em] size-1.5 shrink-0 rotate-45 bg-lime" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-subtle">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
