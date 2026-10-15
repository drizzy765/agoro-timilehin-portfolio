import { ArrowUpRight, Award, ShieldCheck } from "lucide-react";
import { siCoursera, siDatacamp } from "simple-icons";
import { certifications, type Certification } from "@/content/site";
import { Reveal } from "./reveal";

function Svg({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  );
}

/** Issuer mark: IBM has no free icon, so a striped wordmark tile in IBM blue; DataCamp uses simple-icons. */
function IssuerMark({ issuer, size = "md" }: { issuer: Certification["issuer"]; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-16 rounded-2xl" : "size-11 rounded-xl";
  if (issuer === "IBM")
    return (
      <span className={`${box} grid shrink-0 place-items-center bg-[#0F62FE]`} aria-label="IBM">
        <span
          className={`font-heading font-bold tracking-tight text-white ${size === "lg" ? "text-xl" : "text-sm"}`}
          style={{ WebkitMaskImage: "repeating-linear-gradient(to bottom, #000 0 2.5px, transparent 2.5px 4px)", maskImage: "repeating-linear-gradient(to bottom, #000 0 2.5px, transparent 2.5px 4px)" }}
        >
          IBM
        </span>
      </span>
    );
  return (
    <span className={`${box} grid shrink-0 place-items-center bg-[#05192D] text-[#03EF62]`} aria-label="DataCamp">
      <Svg path={siDatacamp.path} className={size === "lg" ? "size-8" : "size-5"} />
    </span>
  );
}

function Verify({ href, big = false }: { href: string | null; big?: boolean }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        big
          ? "inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime px-4 text-sm font-semibold text-on-accent transition hover:shadow-[0_0_28px_color-mix(in_srgb,var(--c-accent)_45%,transparent)]"
          : "inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-medium transition hover:border-lime/50 hover:text-lime"
      }
    >
      <ShieldCheck className={big ? "size-4" : "size-3.5"} /> Verify
      <ArrowUpRight className={big ? "size-4" : "size-3.5"} />
    </a>
  );
}

function Platform({ c }: { c: Certification }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-subtle">
      {c.platform === "Coursera" && <Svg path={siCoursera.path} className="size-3 text-[#2A73CC]" />}
      {c.issuer === "IBM" ? `IBM · via ${c.platform}` : c.platform}
      {c.date && <> · {c.date}</>}
    </span>
  );
}

export function Certificates() {
  const featured = certifications.find((c) => c.featured)!;
  const rest = certifications.filter((c) => !c.featured);
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Featured credential */}
      <Reveal className="lg:col-span-3">
        <article className="glow-card shine relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(80% 60% at 100% 0%, color-mix(in srgb, var(--c-accent) 16%, transparent), transparent 60%), repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 14px)",
            }}
          />
          <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-12 font-heading text-[11rem] leading-none font-bold text-white/[0.03] select-none">
            IBM
          </div>
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <IssuerMark issuer={featured.issuer} size="lg" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-mono text-[11px] tracking-wide text-lime uppercase">
                <Award className="size-3.5" /> Featured · {featured.kind}
              </span>
            </div>
            <h3 className="mt-8 max-w-md text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-[2rem]">{featured.title}</h3>
            <div className="mt-3">
              <Platform c={featured} />
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {featured.skills.map((s) => (
                <span key={s} className="rounded-md border border-line bg-background/60 px-2.5 py-1 font-mono text-[11px] text-foreground/85">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-end justify-between gap-4 pt-8">
              <Verify href={featured.href} big />
              <span className="font-mono text-[11px] text-subtle">Agoro Oluwatimilehin</span>
            </div>
          </div>
        </article>
      </Reveal>

      {/* Credential stack (horizontal scroll on mobile) */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar lg:col-span-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {rest.map((c, i) => (
          <Reveal key={c.title} delay={0.05 + i * 0.05} className="w-[82%] shrink-0 snap-start sm:w-[60%] lg:w-auto lg:flex-1">
            <article className="shine group relative flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-lime/30">
              <span aria-hidden className="absolute top-5 bottom-5 left-0 w-[3px] rounded-r bg-lime/70" />
              <div className="flex items-start gap-3.5">
                <IssuerMark issuer={c.issuer} />
                <div className="min-w-0">
                  <h3 className="leading-snug font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-1">
                    <Platform c={c} />
                  </p>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-subtle">{c.kind}</span>
                <Verify href={c.href} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
