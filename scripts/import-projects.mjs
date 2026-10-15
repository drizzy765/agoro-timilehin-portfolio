// Builds src/content/projects.json from the GitHub audit (content-src/projects-audit.json)
// merged with hand-written case studies (content-src/case-studies.json).
// Only verified-live links are kept (dead / unverified Streamlit links are dropped).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const audit = JSON.parse(fs.readFileSync(path.join(root, "content-src/projects-audit.json"), "utf8"));
const curated = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(root, "content-src/case-studies.json"), "utf8")).map((c) => [c.slug, c]));
const alias = { "outreach-agent": "outreach-engine" };

const CAT = {
  "LLM/NLP & Speech": "llm",
  "RAG/Agents": "rag",
  "Finance/Quant": "finance",
  Climate: "climate",
  "Computer Vision": "vision",
  "Data/Analytics": "data",
  "Dev Tools": "devtools",
};
const TITLE = {
  "naija-smart-agent": "Naija Smart Agent",
  "commodity-volatility": "Commodity Volatility Forecasting",
};
const ROLE = {
  sauticivic: "Team of 2 · Lead architect",
  "naija-smart-agent": "Team of 2 · Top contributor",
  lendraai: "Team of 3 · ML engineer",
  aegis: "Team of 4 · Team lead",
  "flyrank-ctr": "Internship · Solo",
  "commodity-volatility": "Solo · B.Sc. thesis",
};
const ICON = {
  aegis: "shield",
  "youtube-agent": "youtube",
  "market-regimes": "activity",
  amzn: "candlestick",
  fraudviz: "scan",
  rainfall: "cloud-rain",
  facemask: "scan-face",
  "flyrank-ctr": "mouse-pointer",
  "dsn-mart-2026": "shopping-cart",
  "dsn-carprice-2025": "car",
  "customer-seg": "users",
  "breast-cancer": "heart-pulse",
  netflix: "clapperboard",
  fifa25: "trophy",
  gitcast: "terminal",
  "outreach-agent": "network",
  agropulse: "wheat",
  debtpulse: "globe",
  deeplense: "orbit",
};
const IMAGES = { sauticivic: 1, "naija-smart-agent": 1, lendraai: 1, "commodity-volatility": 1, greenpulse: 1, fraudviz: 1 };
// Top section = GitHub-pinned repos (gitcast, Sauticivic, AgropulseNG, Commodity, LendraAI, dsn-bct-2026; fetched
// from github.com/drizzy765 on 2026-10-15) ∪ CV projects. CV+pinned first (CV order), then pinned-only.
const FEATURED = ["sauticivic", "naija-smart-agent", "gitcast", "commodity-volatility", "agropulse", "lendraai"];
const OTHER = ["aegis", "fraudviz", "netflix", "fifa25"];
const STATUS = { aegis: "In progress" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (d) => (d ? `${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}` : "");

const okLink = (l) => /^live|^demo video/i.test(l.status);
const linkLabel = (url, status) =>
  /youtu/.test(url) ? "Demo video" : /pypi\.org/.test(url) ? "PyPI" : /onrender\.com\/docs/.test(url) ? "API docs" : /github\.io\/?$/.test(url) && !/dsn-bct/.test(url) ? "Write-up" : status.includes("alternate") ? null : "Live";

const out = audit.projects.map((p) => {
  const c = curated[alias[p.id] ?? p.id] ?? {};
  const links = (p.live ?? [])
    .filter(okLink)
    .map((l) => ({ label: linkLabel(l.url, l.status), url: l.url.replace(/^http:\/\//, "https://") }))
    .filter((l) => l.label)
    .filter((l, i, a) => a.findIndex((x) => x.label === l.label) === i);
  const cats = [CAT[p.category], p.secondary ? CAT[p.secondary] : null].filter(Boolean);
  const solo = /^solo/i.test(p.role);
  return {
    slug: p.id,
    title: TITLE[p.id] ?? p.name,
    tagline: c.tagline ?? p.description,
    description: p.description,
    categories: [...new Set(cats)],
    role: ROLE[p.id] ?? (solo ? "Solo" : p.role.split(".")[0]),
    roleDetail: p.role,
    badges: c.badges ?? [],
    year: (p.last_updated ?? "").slice(0, 4),
    featured: FEATURED.includes(p.id),
    section: FEATURED.includes(p.id) ? "top" : OTHER.includes(p.id) ? "other" : "more",
    status: STATUS[p.id] ?? null,
    date: fmtDate(p.last_updated),
    lastUpdated: p.last_updated ?? "",
    order: FEATURED.includes(p.id) ? FEATURED.indexOf(p.id) : OTHER.includes(p.id) ? 200 + OTHER.indexOf(p.id) : 100,
    image: IMAGES[p.id] ? `/projects/${p.id}.webp` : null,
    icon: c.icon ?? ICON[p.id] ?? "terminal",
    repo: p.repo,
    links,
    stars: p.stars ?? 0,
    stack: p.stack,
    metrics: c.metrics ?? [],
    problem: c.problem ?? null,
    approach: c.approach ?? null,
    results: c.results ?? [],
    paper: p.paper ? (Array.isArray(p.paper) ? p.paper : [p.paper]).map((x) => "/papers/" + path.basename(x)) : [],
  };
});
out.sort((a, b) => a.order - b.order || b.lastUpdated.localeCompare(a.lastUpdated));
fs.writeFileSync(path.join(root, "src/content/projects.json"), JSON.stringify(out, null, 2));
console.log(`projects.json: ${out.length} projects, featured ${out.filter((p) => p.featured).length}`);
for (const p of out) console.log(p.section.padEnd(6), p.date.padEnd(9), p.slug.padEnd(22), p.role.padEnd(28), p.categories.join(","), p.links.map((l) => l.label + "=" + l.url).join(" "));
