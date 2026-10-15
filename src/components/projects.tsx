"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ArrowUpRight, FileText, Star, Users, X } from "lucide-react";
import { categories, projects, type CategoryKey, type Project } from "@/content/site";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ICONS, ProjectCover } from "./project-cover";
import { StaggerItem, Tilt } from "./tilt";
import { GitHubIcon } from "./brand-icons";

const catLabel = Object.fromEntries(categories.map((c) => [c.key, c.label]));

function span(i: number, n: number) {
  if (n >= 3 && i === 0) return "sm:col-span-2 lg:col-span-2 lg:row-span-2";
  return "";
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const team = role.startsWith("Team");
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px]", team ? "border border-cyan/30 bg-cyan/[0.06] text-cyan" : "border border-line text-subtle", className)}>
      {team && <Users className="size-3" />}
      {role}
    </span>
  );
}

export function glow(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Projects() {
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [open, setOpen] = useState<Project | null>(null);
  const list = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);
  const featured = list.filter((p) => p.featured);
  const more = list.filter((p) => p.section === "more");
  const other = list.filter((p) => p.section === "other");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <LayoutGroup>
      <div className="-mx-4 mb-6 overflow-x-auto px-4 no-scrollbar">
        <ToggleGroup
          value={[filter]}
          onValueChange={(v) => v.length && setFilter(v[v.length - 1] as CategoryKey | "all")}
          aria-label="Filter projects by type"
          spacing={1}
          className="rounded-xl border border-line bg-surface/70 p-1"
        >
          {categories.map((c) => {
            const count = c.key === "all" ? projects.length : projects.filter((p) => p.categories.includes(c.key as CategoryKey)).length;
            return (
              <ToggleGroupItem
                key={c.key}
                value={c.key}
                size="sm"
                className="relative min-h-10 rounded-lg px-3 font-mono text-xs text-subtle hover:bg-white/5 aria-pressed:bg-transparent data-[pressed]:bg-transparent data-[pressed]:text-on-accent"
              >
                {filter === c.key && (
                  <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-lg bg-lime" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                )}
                <span className="relative">{c.label}</span>
                <span className={cn("relative ml-1 opacity-60", filter === c.key && "opacity-70")}>{count}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <motion.ul layout className="grid grid-flow-dense auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {featured.map((p, i) => {
            const big = span(i, featured.length).includes("row-span-2");
            return (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className={span(i, featured.length)}
              >
                <StaggerItem index={i} className="size-full">
                <Tilt className="size-full">
                <motion.button
                  layoutId={`card-${p.slug}`}
                  type="button"
                  onClick={() => setOpen(p)}
                  onMouseMove={glow}
                  className="glow-card group flex size-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:outline-none"
                >
                  <div className={cn("relative w-full overflow-hidden border-b border-line", big ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/9]")}>
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={`${p.title} screenshot`}
                        fill
                        sizes={big ? "(min-width:1024px) 640px, 100vw" : "(min-width:1024px) 320px, (min-width:640px) 50vw, 100vw"}
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <ProjectCover project={p} large={big} />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={cn("font-semibold tracking-tight", big ? "text-xl" : "text-base")}>{p.title}</h3>
                      <span className="shrink-0 font-mono text-[11px] text-subtle">{p.date}</span>
                    </div>
                    <p className={cn("text-sm leading-relaxed text-subtle", !big && "line-clamp-2")}>{p.tagline}</p>
                    {big && p.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {p.metrics.slice(0, 3).map((m) => (
                          <div key={m.label} className="rounded-lg border border-line bg-background/60 px-3 py-2">
                            <p className="font-mono text-base text-lime">{m.value}</p>
                            <p className="text-[11px] text-subtle">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                      <RoleBadge role={p.role} />
                      {p.categories.map((c) => (
                        <span key={c} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-subtle">
                          {catLabel[c]}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
                </Tilt>
                </StaggerItem>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {more.length > 0 && (
        <>
          <motion.p layout className="mt-12 mb-4 flex items-center gap-3 font-mono text-xs tracking-wider text-subtle uppercase">
            <span className="text-lime">{more.length}</span> More projects
            <span className="h-px flex-1 bg-line" />
          </motion.p>
          <CompactGrid items={more} onOpen={setOpen} />
        </>
      )}
      {other.length > 0 && (
        <>
          <motion.p layout className="mt-12 mb-4 flex items-center gap-3 font-mono text-xs tracking-wider text-subtle uppercase">
            <span className="text-cyan">{other.length}</span> Other projects
            <span className="h-px flex-1 bg-line" />
          </motion.p>
          <CompactGrid items={other} onOpen={setOpen} />
        </>
      )}

      <AnimatePresence>{open && <CaseStudy project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </LayoutGroup>
  );
}

function CaseStudy({ project: p, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`cs-${p.slug}`}>
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.article
        layoutId={`card-${p.slug}`}
        className="relative z-10 flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface sm:rounded-3xl"
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <button onClick={onClose} aria-label="Close case study" className="absolute top-3 right-3 z-20 grid size-11 place-items-center rounded-full border border-line bg-black/60 text-subtle focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none backdrop-blur transition hover:text-foreground">
          <X className="size-4" />
        </button>
        <div className="overflow-y-auto">
          <div className="relative aspect-[16/8] w-full border-b border-line">
            {p.image ? <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="768px" className="object-cover object-top" /> : <ProjectCover project={p} large />}
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }} exit={{ opacity: 0 }} className="space-y-6 p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap gap-1.5">
                {p.status && <span className="rounded-md border border-dashed border-subtle/50 px-2 py-0.5 font-mono text-[11px] text-foreground/80">{p.status}</span>}
                <RoleBadge role={p.role} />
                <span className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-subtle">{p.date}</span>
                {p.badges.map((b) => (
                  <span key={b} className="rounded-md border border-lime/25 bg-lime/[0.06] px-2 py-0.5 font-mono text-[11px] text-lime">
                    {b}
                  </span>
                ))}
              </div>
              <h3 id={`cs-${p.slug}`} className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {p.title}
              </h3>
              <p className="mt-2 text-subtle">{p.tagline}</p>
            </div>

            {p.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-line bg-background p-4">
                    <p className="font-mono text-xl text-lime">{m.value}</p>
                    <p className="mt-1 text-xs text-subtle">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            <dl className="space-y-5 text-[15px] leading-relaxed">
              {p.problem ? (
                <div>
                  <dt className="font-mono text-xs tracking-wider text-cyan uppercase">Problem</dt>
                  <dd className="mt-1.5 text-foreground/90">{p.problem}</dd>
                </div>
              ) : (
                <div>
                  <dt className="font-mono text-xs tracking-wider text-cyan uppercase">Overview</dt>
                  <dd className="mt-1.5 text-foreground/90">{p.description}</dd>
                </div>
              )}
              {p.approach && (
                <div>
                  <dt className="font-mono text-xs tracking-wider text-cyan uppercase">Approach</dt>
                  <dd className="mt-1.5 text-foreground/90">{p.approach}</dd>
                </div>
              )}
              {p.results.length > 0 && (
                <div>
                  <dt className="font-mono text-xs tracking-wider text-cyan uppercase">Results</dt>
                  <dd className="mt-1.5">
                    <ul className="space-y-1.5">
                      {p.results.map((r) => (
                        <li key={r} className="flex gap-2 text-foreground/90">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-lime" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-mono text-xs tracking-wider text-cyan uppercase">My role</dt>
                <dd className="mt-1.5 text-foreground/90">{p.roleDetail}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-xs text-subtle">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-line pt-5">
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-cyan/50 hover:text-cyan">
                <GitHubIcon className="size-4" /> Source
              </a>
              {p.links.map((l, i) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    i === 0
                      ? "inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-medium text-on-accent transition hover:shadow-[0_0_24px_color-mix(in_srgb,var(--c-accent)_40%,transparent)]"
                      : "inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-cyan/50 hover:text-cyan"
                  }
                >
                  {l.label} <ArrowUpRight className="size-4" />
                </a>
              ))}
              {p.paper.length > 0 && (
                <Link href="/writing" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-cyan/50 hover:text-cyan">
                  <FileText className="size-4" /> {p.paper.length > 1 ? "Papers" : "Paper"}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}

function CompactGrid({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  return (
          <motion.ul layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((p, idx) => {
                const Icon = ICONS[p.icon] ?? ICONS.terminal;
                return (
                  <motion.li key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
                    <StaggerItem index={idx} className="size-full">
                    <Tilt className="size-full" max={4}>
                    <motion.button
                      layoutId={`card-${p.slug}`}
                      type="button"
                      onClick={() => onOpen(p)}
                      onMouseMove={glow}
                      className="glow-card group flex size-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4 text-left transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-background text-cyan transition-colors group-hover:text-lime">
                          <Icon className="size-4" strokeWidth={1.6} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[15px] font-semibold tracking-tight">{p.title}</h3>
                          <p className="font-mono text-[11px] text-subtle">
                            {p.date}
                            {p.stars > 0 && (
                              <span className="ml-2 inline-flex items-center gap-0.5">
                                <Star className="size-3" /> {p.stars}
                              </span>
                            )}
                          </p>
                        </div>
                        {p.links.length > 0 && <span className="rounded bg-lime/10 px-1.5 py-0.5 font-mono text-[11px] text-lime">{p.links[0].label.toLowerCase()}</span>}
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-subtle">{p.description}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        {p.status && <span className="rounded-md border border-dashed border-subtle/50 px-2 py-0.5 font-mono text-[11px] text-foreground/80">{p.status}</span>}
                        <RoleBadge role={p.role} />
                        {p.categories.map((c) => (
                          <span key={c} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-subtle">
                            {catLabel[c]}
                          </span>
                        ))}
                      </div>
                    </motion.button>
                    </Tilt>
                    </StaggerItem>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
  );
}
