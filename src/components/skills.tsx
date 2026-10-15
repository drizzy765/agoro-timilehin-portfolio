import { skills } from "@/content/site";
import { Reveal } from "./reveal";

export function Skills() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {skills.map((g, i) => (
        <Reveal key={g.group} delay={i * 0.06}>
          <div className="h-full rounded-2xl border border-line bg-surface p-6">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">
              <span className="text-lime">0{i + 1}</span> {g.group}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span key={s} className="rounded-lg border border-line bg-background/60 px-2.5 py-1 text-sm text-foreground/85 transition hover:border-lime/40 hover:text-lime">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
