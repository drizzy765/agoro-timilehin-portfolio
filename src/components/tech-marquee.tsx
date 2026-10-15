import type { LucideIcon } from "lucide-react";
import { AudioLines, BrainCircuit, ChartColumnBig, ChartLine, Cloud, Database, FileSearch, GitFork, ScanSearch, Sigma } from "lucide-react";
import { siDocker, siFastapi, siLanggraph, siMlflow, siPandas, siPostgresql, siPython, siPytorch, siScikitlearn, siTensorflow, type SimpleIcon } from "simple-icons";

type Item = { label: string; si?: SimpleIcon; lu?: LucideIcon };
const ITEMS: Item[] = [
  { label: "Python", si: siPython },
  { label: "SQL", lu: Database },
  { label: "PyTorch", si: siPytorch },
  { label: "TensorFlow", si: siTensorflow },
  { label: "scikit-learn", si: siScikitlearn },
  { label: "XGBoost", lu: GitFork },
  { label: "RAG", lu: FileSearch },
  { label: "LLMs", lu: BrainCircuit },
  { label: "LangGraph", si: siLanggraph },
  { label: "FAISS", lu: ScanSearch },
  { label: "FastAPI", si: siFastapi },
  { label: "Docker", si: siDocker },
  { label: "MLflow", si: siMlflow },
  { label: "AWS", lu: Cloud },
  { label: "PostgreSQL", si: siPostgresql },
  { label: "Pandas", si: siPandas },
  { label: "SHAP", lu: Sigma },
  { label: "Speech AI", lu: AudioLines },
  { label: "Time Series", lu: ChartLine },
  { label: "Power BI", lu: ChartColumnBig },
];

function Glyph({ it }: { it: Item }) {
  if (it.si)
    return (
      <svg viewBox="0 0 24 24" className="size-[1.05em] shrink-0" fill="currentColor" aria-hidden>
        <path d={it.si.path} />
      </svg>
    );
  const L = it.lu!;
  return <L className="size-[1.05em] shrink-0" strokeWidth={2} aria-hidden />;
}

function Row({ variant, items }: { variant: "solid" | "outline"; items: Item[] }) {
  // Two identical copies -> translate -50% loops seamlessly
  const copy = (k: string, hidden: boolean) => (
    <ul key={k} className="marquee-group" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.label} className="marquee-item">
          <Glyph it={it} />
          <span className={variant === "outline" ? "marquee-outline" : undefined}>{it.label}</span>
          <span className="marquee-sep" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return <div className={`marquee-track ${variant === "solid" ? "marquee-left" : "marquee-right"}`}>{[copy("a", false), copy("b", true)]}</div>;
}

/** Two crossing, tilted tech-stack strips sliding in opposite directions. Pauses on hover; static with reduced motion. */
export function TechMarquee() {
  const rev = [...ITEMS.slice(10), ...ITEMS.slice(0, 10)];
  return (
    <section aria-label="Tech stack" className="marquee-stage relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-16 sm:py-20">
      <div className="marquee-strip marquee-strip--black">
        <Row variant="outline" items={rev} />
      </div>
      <div className="marquee-strip marquee-strip--red">
        <Row variant="solid" items={ITEMS} />
      </div>
    </section>
  );
}
