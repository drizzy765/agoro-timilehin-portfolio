"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ContributionSet } from "@/lib/contributions";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NumberTicker } from "./number-ticker";
import { useThemeVars } from "@/lib/use-theme-vars";

const HEAT = { "--heat-0": "#161616", "--heat-1": "#3D0E14", "--heat-2": "#7A1724", "--heat-3": "#BF2536", "--heat-4": "#FF3B4E" };

export function Contributions({ sets }: { sets: ContributionSet[] }) {
  const h = useThemeVars(HEAT);
  const theme = { dark: [h["--heat-0"], h["--heat-1"], h["--heat-2"], h["--heat-3"], h["--heat-4"]] };
  const [key, setKey] = useState(sets[0]?.key ?? "github");
  const cur = sets.find((s) => s.key === key) ?? sets[0];

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          value={[key]}
          onValueChange={(v) => v.length && setKey(v[v.length - 1] as ContributionSet["key"])}
          aria-label="Contribution source"
          spacing={1}
          className="rounded-xl border border-line bg-background p-1"
        >
          {sets.map((s) => (
            <ToggleGroupItem key={s.key} value={s.key} size="sm" className="relative rounded-lg px-3.5 font-mono text-xs text-subtle hover:bg-white/5 aria-pressed:bg-transparent data-[pressed]:bg-transparent data-[pressed]:text-on-accent">
              {key === s.key && <motion.span layoutId="contrib-pill" className="absolute inset-0 rounded-lg bg-lime" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className="relative">{s.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <a href={cur.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-cyan hover:underline">
          view on {cur.label.toLowerCase()} <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cur.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cur.stats.map((s, i) => (
              <div key={s.label} className="rounded-xl border border-line bg-background/70 p-4">
                <NumberTicker value={s.value} suffix={s.suffix} className={`font-mono text-2xl font-medium ${i === 0 ? "text-lime" : "text-foreground"}`} />
                <p className="mt-1 text-xs text-subtle">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto pb-2 no-scrollbar">
            <div className="min-w-[720px]">
              <ActivityCalendar
                data={cur.days}
                theme={theme}
                colorScheme="dark"
                blockSize={11}
                blockMargin={3}
                blockRadius={2.5}
                fontSize={12}
                weekStart={1}
                labels={{ totalCount: `{{count}} ${cur.totalLabel}` }}
                style={{ color: "var(--c-subtle)" }}
                tooltips={{ activity: { text: (a) => `${a.count} on ${a.date}` } }}
              />
            </div>
          </div>
          {cur.note && <p className="mt-2 font-mono text-xs text-subtle">{cur.note}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
