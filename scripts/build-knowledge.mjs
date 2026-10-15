// Generates src/content/knowledge.md: the grounding file for the "Ask about Timi" agent.
// Sources: curated profile (from CV), src/content/projects.json, paper abstracts
// (content-src/*.txt), Medium RSS (content-src/medium.xml).
// Kept compact (~3k tokens) so it fits Groq free-tier per-minute token limits.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = (p) => path.join(root, "content-src", p);
const clean = (s) => s.replace(/\s+/g, " ").trim();

function abstractOf(file, max = 700) {
  const t = fs.readFileSync(src(file), "utf8");
  const m = t.match(/Abstract([\s\S]*?)(?:\n\s*1\.\s+Introduction|$)/i);
  const body = m ? m[1] : t.split(/\n\s*1\.\s/)[1] ?? t;
  return clean(body).slice(0, max) + "…";
}

function medium(max = 600) {
  const x = fs.readFileSync(src("medium.xml"), "utf8");
  return [...x.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const title = it.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] ?? "";
    const link = (it.match(/<link>(.*?)<\/link>/)?.[1] ?? "").split("?")[0];
    const date = it.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
    const html = it.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]>/)?.[1] ?? "";
    const text = clean(html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " "));
    return `### Article: "${title}" (${new Date(date).toDateString()}), ${link}${/quantvault/i.test(title) ? "\nStatus: QuantVault is IN PROGRESS / still being built (article only, not finished or released)." : ""}\nExcerpt: ${text.slice(0, max)}…`;
  });
}

const projects = JSON.parse(fs.readFileSync(path.join(root, "src/content/projects.json"), "utf8"));

const out = `# Knowledge about Timi (Agoro Oluwatimilehin Teslim)
Generated ${new Date().toISOString().slice(0, 10)} from his CV, project READMEs, papers and Medium posts.

## Profile
- Name: Agoro Oluwatimilehin Teslim, goes by "Timi". Based in Lagos, Nigeria.
- Role: Machine Learning Engineer focused on speech & LLM systems, retrieval/recommendation, forecasting, responsible AI, data & digital products.
- Interests: applying AI to public-sector, development, financial and emerging-market problems, with attention to reliability, inclusion, measurable evaluation and safe deployment.
- Contact: email agorotimilehin05@gmail.com · GitHub github.com/drizzy765 · LinkedIn linkedin.com/in/agoro-oluwatimilehin-aba2851aa · X @timilovesml · Medium medium.com/@agorotimilehin05

## Experience
- Flyrank AI, AI/ML Engineering Intern (Remote), Jul 2026–Oct 2026 (completed; Timi is no longer at Flyrank): built and optimised Python ML and LLM workflow components (feature integration, data contracts, prompt design, testing, pipeline reliability); production-oriented AI engineering with maintainable APIs and reproducibility.
- AWS Student Builder Group, Lagos State University, Director of Operations, Feb 2026–present: coordinates technical operations and cloud-learning activities for a 300+ member technology community; supports workshops on cloud, AI engineering and deploying ML workloads on AWS.
- Nigerian Airspace Management Agency (NAMA), Industrial Attachment, Planning, Research & Statistics, Apr–Sep 2025: cleaned and consolidated aerodrome data records across Nigerian airports; built Excel and Power BI traffic analyses (monthly trends, airport shares).

## Education
- Lagos State University, B.Sc. Mathematics, expected October 2026.
- Thesis: "Forecasting Nigerian Commodity Price Volatility: Application of Regime-Aware Elastic Net Regression on Principal Component Factors".
- Areas: Linear Algebra, Numerical Analysis, ODEs, Stochastic Processes, Complex Analysis, Probability, Statistics.

## Skills
- ML/AI: Python, Pandas, NumPy, scikit-learn, XGBoost, PyTorch, TensorFlow, SHAP, FAISS, RAG, LLM applications, Speech AI, time-series forecasting, PCA, Elastic Net.
- Engineering: FastAPI, Pydantic, SQL, PostgreSQL, REST APIs, Docker, MLflow, Git/GitHub, Linux, CI/CD, AWS, Azure.
- Analytics: Power BI, Excel, data cleaning, EDA, dashboards, technical documentation, benchmarking, LaTeX.

## Achievements & certifications
- DSN AI Bootcamp 2025: selected among the final 223 of 30,000+ applicants (~top 0.8%).
- DSN Hackathon 2025: 8th of 169 teams (top 5%).
- IBM Data Science Professional Certificate; Deep Learning with Keras and TensorFlow (IBM); Machine Learning for Time Series Data (DataCamp); Dimensionality Reduction in Python (DataCamp).

## Projects
${projects
  .map(
    (p) => `### ${p.title} (${p.year}${p.featured ? ", featured" : ""})
${p.description} Role: ${p.roleDetail} Stack: ${p.stack.slice(0, 10).join(", ")}. Repo: ${p.repo}${p.links.length ? " · " + p.links.map((l) => `${l.label}: ${l.url}`).join(" · ") : ""}${p.problem ? `\nProblem: ${p.problem}` : ""}${p.approach ? `\nApproach: ${p.approach}` : ""}${p.results.length ? `\nResults: ${p.results.join("; ")}.` : ""}`
  )
  .join("\n")}
- QuantVault (multi-agent runtime): STATUS IN PROGRESS / STILL BEING BUILT (article only). Timi is still fixing bugs; there is no repo, demo or release yet. It is described only in a Medium article. Never present it as finished or shipped.
- AEGIS Voice Guardian: STATUS UNFINISHED / IN PROGRESS (low-priority hackathon prototype). Never present it as finished.

## Tech index (which projects list which technology; use this for "what has he built with X" questions)
${(() => {
  const groups = [
    ["LLMs (models/APIs/agent frameworks)", /gemini|groq|llama|gpt|openai|cerebras|deepseek|langchain|langgraph|llm|mistral|claude/i],
    ["Speech (ASR/TTS)", /whisper|deepgram|asr|tts|speech|sahara/i],
    ["Forecasting / time series", /prophet|lstm|arima|time.?series|forecast/i],
    ["Computer vision", /cnn|opencv|vision|keras/i],
  ];
  // Exact, README-verified facts that override generic stack matching in the LLM row
  const LLM_FACTS = {
    sauticivic: "Per its README, Gemini appears only as Gemini 3.5 Transcribe, one of the 4 speech engines benchmarked (it inverted the Pidgin completive marker 'don' in 47.6% of target tokens; Sahara v2.5 had 0%). The live pipeline uses Sahara v2.5 ASR with a Whisper fallback and a deterministic two-tier risk gate (confidence >= 0.70 plus entity completeness). SautiCivic is a speech project, not an LLM project; do not list it for LLM questions or claim Gemini powers any part of it",
    greenpulse: "Groq Llama 3 powers the analyst chat, emission insights and report generation (NOT Gemini)",
  };
  return groups
    .map(([name, re]) => {
      const hits = projects
        .map((p) => ({ p, t: [...new Set([...p.stack, ...(p.description.match(re) ? [] : [])].filter((s) => re.test(s)))] }))
        .filter((x) => x.t.length && !(name.startsWith("LLM") && x.p.slug === "sauticivic"));
      return `- ${name}: ${hits.map((x) => `${x.p.title} [${(name.startsWith("LLM") || x.p.slug === "sauticivic") && LLM_FACTS[x.p.slug] ? LLM_FACTS[x.p.slug] : x.t.join(", ")}]${/aegis/i.test(x.p.title) ? " (unfinished)" : ""}${name.startsWith("LLM") ? ` — what it is: ${x.p.description.split(/(?<=[.!?])\s/)[0].slice(0, 170)}` : ""}`).join("; ")}`;
    })
    .join("\n");
})()}
- QuantVault (multi-agent LLM runtime, LangGraph): in progress / still being built, article only.

## Research papers (readable on the Writing tab)
### Paper: SautiCivic Bridge: A Safety-Critical Speech Benchmark for Code-Switched Nigerian Civic Grievance Intake. Sahara CodeSwitch Africa Challenge 2026 technical report (Sep 2026), Agoro & Akhuabe. Summary: ${abstractOf("sauticivic-benchmark-report.txt").replace(/^.*?Executive Summary & Sociolinguistic Formulation\s*/, "")}
### Paper: DSN x BCT Hackathon 3.0 Task B: Personalised Recommendation via Semantic Retrieval and LLM Reranking (May 2026), Agoro & Ajiboye. Abstract: ${abstractOf("dsn-bct-task_b_personalized_recommendation.txt")}
### Paper: DSN x BCT Hackathon 3.0 Task A: User Modeling via Two-Agent Persona Simulation (May 2026), Ajiboye & Agoro. Abstract: ${abstractOf("dsn-bct-task_a_user_modelling.txt")}

## Articles (Medium)
${medium().join("\n")}

## Coding practice
- LeetCode (drizzy765): 87 problems solved (69 easy, 17 medium, 1 hard) as of Oct 2026.
- Deep-ML (drizzy765): started Oct 2026; solutions auto-synced to github.com/drizzy765/deep-ml.
- GitHub: ~629 contributions in the last year.

## Outside work
- Big music fan (Drake especially); shares a Spotify playlist on the About page.
- Plays football video games and chess; FC Barcelona fan.
- Advocate of women's empowerment.
- Admits to the occasional TikTok brainrot.
`;

const dest = path.join(root, "src/content/knowledge.md");
fs.writeFileSync(dest, out);
fs.writeFileSync(path.join(root, "src/content/knowledge.generated.ts"), `// AUTO-GENERATED by scripts/build-knowledge.mjs. Do not edit.\nconst knowledge = ${JSON.stringify(out)};\nexport default knowledge;\n`);
console.log(`knowledge.md written: ${out.length} chars (~${Math.round(out.length / 4)} tokens)`);
