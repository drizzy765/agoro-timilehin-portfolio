"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, BookOpen, Download, FileText } from "lucide-react";
import { writing } from "@/content/site";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { glow } from "./projects";

const filters = [
  { key: "all", label: "All" },
  { key: "research", label: "Research" },
  { key: "article", label: "Articles" },
] as const;

export function WritingList() {
  const [f, setF] = useState<(typeof filters)[number]["key"]>("all");
  const items = writing.filter((w) => f === "all" || w.kind === f);

  return (
    <div>
      <ToggleGroup value={[f]} onValueChange={(v) => v.length && setF(v[v.length - 1] as typeof f)} aria-label="Filter writing" spacing={1} className="mb-8 rounded-xl border border-line bg-surface/70 p-1">
        {filters.map((x) => (
          <ToggleGroupItem key={x.key} value={x.key} size="sm" className="relative rounded-lg px-3.5 font-mono text-xs text-subtle hover:bg-white/5 aria-pressed:bg-transparent data-[pressed]:bg-transparent data-[pressed]:text-on-accent">
            {f === x.key && <motion.span layoutId="writing-pill" className="absolute inset-0 rounded-lg bg-lime" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative">{x.label}</span>
            <span className="relative ml-1 opacity-60">{x.key === "all" ? writing.length : writing.filter((w) => w.kind === x.key).length}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <motion.ul layout className="grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((w) => (
            <motion.li key={w.slug} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
              {w.kind === "research" ? (
                <div onMouseMove={glow} className="glow-card group rounded-2xl border border-line bg-surface p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link href={`/writing/${w.slug}`} className="relative hidden aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-deep sm:block" aria-label={`Read ${w.title}`}>
                      <div className="absolute inset-0 space-y-1.5 p-3">
                        <div className="h-1.5 w-4/5 rounded bg-white/25" />
                        <div className="h-1.5 w-3/5 rounded bg-white/15" />
                        <div className="mt-3 space-y-1">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-1 rounded bg-white/[0.07]" style={{ width: `${70 + ((i * 37) % 30)}%` }} />
                          ))}
                        </div>
                      </div>
                      <FileText className="absolute right-2 bottom-2 size-5 text-cyan" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] tracking-wide text-cyan uppercase">Research · {w.date}</p>
                      <Link href={`/writing/${w.slug}`}>
                        <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-balance transition-colors group-hover:text-lime">{w.title}</h3>
                      </Link>
                      <p className="mt-1 text-sm text-subtle">
                        {w.authors} · {w.venue}
                      </p>
                      <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">{w.summary}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link href={`/writing/${w.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-lime px-3.5 py-2 text-sm font-medium text-on-accent transition hover:shadow-[0_0_24px_color-mix(in_srgb,var(--c-accent)_40%,transparent)]">
                          <BookOpen className="size-4" /> Read on site
                        </Link>
                        <a href={w.pdf} download className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm text-subtle transition hover:text-foreground">
                          <Download className="size-4" /> PDF · {w.pages}pp
                        </a>
                        <div className="ml-auto hidden gap-1.5 md:flex">
                          {w.tags.map((t) => (
                            <span key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10.5px] text-subtle">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a href={w.href} target="_blank" rel="noreferrer" onMouseMove={glow} className="glow-card group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface sm:flex-row">
                  <div className="relative aspect-[16/8] w-full shrink-0 overflow-hidden border-b border-line sm:aspect-auto sm:w-64 sm:border-r sm:border-b-0">
                    <Image src={w.thumb!} alt="" fill sizes="(min-width:640px) 256px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex-1 p-5 sm:p-6">
                    <p className="font-mono text-[11px] tracking-wide text-cyan uppercase">Article · Medium · {w.date}</p>
                    <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-balance transition-colors group-hover:text-lime">{w.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-subtle">{w.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan">
                      Read on Medium <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
