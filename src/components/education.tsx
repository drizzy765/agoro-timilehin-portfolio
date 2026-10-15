import { GraduationCap, Trophy } from "lucide-react";
import { awards, education } from "@/content/site";
import { Reveal } from "./reveal";

export function Education() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Reveal className="lg:col-span-3">
        <div className="h-full rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-background text-cyan">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight">{education.school}</h3>
              <p className="text-subtle">
                {education.degree} <span className="text-line">·</span> <span className="font-mono text-xs">{education.period}</span>
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-line bg-background/70 p-4">
            <p className="font-mono text-[11px] tracking-wider text-lime uppercase">Thesis</p>
            <p className="mt-1.5 leading-relaxed text-foreground/90">{education.thesis}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {education.areas.map((a) => (
              <span key={a} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-subtle">
                {a}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:col-span-2">
        <Reveal delay={0.05} className="h-full">
          <div className="h-full rounded-2xl border border-line bg-surface p-6">
            <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-subtle uppercase">
              <Trophy className="size-4 text-lime" /> Awards
            </p>
            <ul className="mt-4 space-y-4">
              {awards.map((a) => (
                <li key={a.title} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-subtle">{a.detail}</p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-lime/30 bg-lime/[0.07] px-2.5 py-1 font-mono text-xs text-lime">{a.stat}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
