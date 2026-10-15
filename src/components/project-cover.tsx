import { Activity, Bot, Car, ChartCandlestick, ChartLine, Clapperboard, CloudRain, Globe, HeartPulse, Landmark, Leaf, Mic, MousePointerClick, Network, Orbit, Scan, ScanFace, ShieldCheck, ShoppingCart, Terminal, Trophy, Users, Video, Wheat, type LucideIcon } from "lucide-react";
import type { Project } from "@/content/site";

export const ICONS: Record<string, LucideIcon> = {
  mic: Mic,
  bot: Bot,
  landmark: Landmark,
  terminal: Terminal,
  "line-chart": ChartLine,
  network: Network,
  leaf: Leaf,
  wheat: Wheat,
  globe: Globe,
  orbit: Orbit,
  shield: ShieldCheck,
  youtube: Video,
  activity: Activity,
  candlestick: ChartCandlestick,
  scan: Scan,
  "cloud-rain": CloudRain,
  "scan-face": ScanFace,
  "mouse-pointer": MousePointerClick,
  "shopping-cart": ShoppingCart,
  car: Car,
  users: Users,
  "heart-pulse": HeartPulse,
  clapperboard: Clapperboard,
  trophy: Trophy,
};

const CMD: Record<string, string> = {
  gitcast: "$ pip install gitcast && gitcast",
  aegis: "voice → scam_pressure() → soft_hold()",
  "outreach-agent": "graph: discover → audit → enrich → pitch",
  agropulse: "forecast(commodity='rice', horizon='5y')",
  debtpulse: "risk_score(country='NG', 2025..2030)",
  deeplense: "cnn(lens.png) → normal | subhalo",
};

/** Generated cover for projects without screenshots: gradient + icon + mono title, one consistent style. */
export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  const Icon = ICONS[project.icon] ?? Terminal;
  const second = ["finance", "data", "devtools"].includes(project.categories[0]);
  const tint = second ? "var(--c-second)" : "var(--c-accent)";
  const other = second ? "var(--c-accent)" : "var(--c-second)";
  return (
    <div
      className="relative size-full overflow-hidden bg-deep"
      style={{
        backgroundImage: `radial-gradient(120% 90% at 85% 0%, color-mix(in srgb, ${tint} 20%, transparent), transparent 55%), radial-gradient(90% 70% at 0% 100%, color-mix(in srgb, ${other} 8%, transparent), transparent 60%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at 70% 20%, black 20%, transparent 75%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </div>
        <Icon
          aria-hidden
          strokeWidth={1.25}
          className={`absolute right-5 top-1/2 -translate-y-1/2 ${large ? "size-28" : "size-16"}`}
          style={{ color: tint, filter: `drop-shadow(0 0 18px color-mix(in srgb, ${tint} 45%, transparent))` }}
        />
        <div className="font-mono">
          <p className={`${large ? "text-xl" : "text-base"} font-medium text-foreground`}>~/{project.slug}</p>
          <p className="mt-1 truncate text-xs text-subtle">
            <span style={{ color: tint }}>›</span> {CMD[project.slug] ?? project.stack.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
