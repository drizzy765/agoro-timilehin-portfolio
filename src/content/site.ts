import projectsJson from "./projects.json";

export const site = {
  name: "Agoro Oluwatimilehin",
  short: "Timi",
  role: "AI/ML Engineer",
  location: "Lagos, Nigeria",
  headline: "AI/ML Engineer · Lagos, Nigeria",
  intro:
    "I build speech, LLM and forecasting systems for emerging markets, with a bias for reliability, honest evaluation and safe deployment.",
  email: "agorotimilehin05@gmail.com",
  github: "https://github.com/drizzy765",
  githubUser: "drizzy765",
  leetcodeUser: "drizzy765",
  linkedin: "https://www.linkedin.com/in/agoro-oluwatimilehin-aba2851aa/",
  x: "https://x.com/timilovesml1234",
  xHandle: "@timilovesml1234",
  medium: "https://medium.com/@agorotimilehin05",
  spotifyEmbed: "https://open.spotify.com/embed/playlist/2OW9QUHQgwkYGj2bKKjHpH?theme=0",
  /**
   * Discord user ID for the Lanyard "now playing" card.
   * Requires joining https://discord.gg/lanyard once (otherwise Lanyard returns
   * "user not monitored" and the card stays hidden). Override with NEXT_PUBLIC_DISCORD_ID.
   */
  discordId: process.env.NEXT_PUBLIC_DISCORD_ID || "1070849770442203229",
} as const;

export type CategoryKey = "llm" | "rag" | "finance" | "climate" | "vision" | "data" | "devtools";

export const categories: { key: CategoryKey | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "llm", label: "LLM/NLP & Speech" },
  { key: "rag", label: "RAG/Agents" },
  { key: "finance", label: "Finance/Quant" },
  { key: "climate", label: "Climate" },
  { key: "vision", label: "Vision" },
  { key: "data", label: "Data" },
  { key: "devtools", label: "Dev Tools" },
];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  categories: CategoryKey[];
  role: string;
  roleDetail: string;
  badges: string[];
  year: string;
  featured: boolean;
  section: "top" | "more" | "other";
  status: string | null;
  date: string;
  lastUpdated: string;
  image: string | null;
  icon: string;
  repo: string;
  links: { label: string; url: string }[];
  stars: number;
  stack: string[];
  metrics: { label: string; value: string }[];
  problem: string | null;
  approach: string | null;
  results: string[];
  paper: string[];
};

export const projects = projectsJson as Project[];

export const experience = [
  {
    org: "Flyrank AI",
    logo: "/logos/flyrank.png",
    href: "https://flyrank.com",
    current: false,
    role: "AI/ML Engineering Intern",
    period: "Jul 2026 – Oct 2026",
    place: "Remote",
    points: [
      "Built and optimised Python ML and LLM workflow components: feature integration, data contracts, prompt design, testing and pipeline reliability.",
      "Shipped production-oriented AI engineering work with maintainable APIs, reproducibility and reliable model integration.",
    ],
    tags: ["LLMs", "Python", "Pipelines"],
  },
  {
    org: "AWS Student Builder Group, LASU",
    logo: "/logos/aws.png",
    href: null,
    current: true,
    role: "Director of Operations",
    period: "Feb 2026 – Present",
    place: "Lagos, Nigeria",
    points: [
      "Run technical operations and cloud-learning activities for a 300+ member technology community.",
      "Support workshops on cloud computing, AI engineering and deploying ML workloads on AWS.",
    ],
    tags: ["AWS", "Community", "Leadership"],
  },
  {
    org: "Nigerian Airspace Management Agency (NAMA)",
    logo: "/logos/nama.png",
    href: "https://nama.gov.ng",
    current: false,
    role: "Industrial Attachment Trainee · Planning, Research & Statistics",
    period: "Apr 2025 – Sep 2025",
    place: "Lagos, Nigeria",
    points: [
      "Cleaned and consolidated aerodrome data records across multiple Nigerian airports, standardising operator, route, aircraft, timing and passenger fields.",
      "Built Excel and Power BI analyses of domestic and international traffic, turning operational aviation data into management-ready summaries.",
    ],
    tags: ["Power BI", "Data cleaning", "Analytics"],
  },
];

export const education = {
  school: "Lagos State University",
  degree: "B.Sc. Mathematics",
  period: "Expected Oct 2026",
  thesis:
    "Forecasting Nigerian Commodity Price Volatility: Application of Regime-Aware Elastic Net Regression on Principal Component Factors",
  areas: ["Linear Algebra", "Numerical Analysis", "ODEs", "Stochastic Processes", "Complex Analysis", "Probability", "Statistics"],
};

export const awards = [
  { title: "DSN AI Bootcamp 2025", detail: "Final 223 of 30,000+ applicants", stat: "Top 0.8%" },
  { title: "DSN Hackathon 2025", detail: "8th of 169 teams", stat: "Top 5%" },
];

export type Certification = { title: string; issuer: "IBM" | "DataCamp"; platform: string; kind: string; date: string | null; href: string | null; featured?: boolean; skills: string[] };
// Verify links come from the CV PDF's link annotations; each was checked to load (Oct 15, 2026).
export const certifications: Certification[] = [
  {
    title: "IBM Data Science Professional Certificate",
    issuer: "IBM",
    platform: "Coursera",
    kind: "Professional Certificate",
    date: "Dec 2025",
    href: "https://www.coursera.org/account/accomplishments/specialization/V252T5DYMN8M",
    featured: true,
    skills: ["Python", "SQL", "Data analysis", "Visualization", "Machine learning"],
  },
  {
    title: "Deep Learning with Keras and TensorFlow",
    issuer: "IBM",
    platform: "Coursera",
    kind: "Course Certificate",
    date: "Jan 2026",
    href: "https://www.coursera.org/account/accomplishments/verify/K8732OD5WXIU",
    skills: ["Keras", "TensorFlow", "Deep learning"],
  },
  {
    title: "Machine Learning for Time Series Data in Python",
    issuer: "DataCamp",
    platform: "DataCamp",
    kind: "Statement of Accomplishment",
    date: null,
    href: "https://www.datacamp.com/completed/statement-of-accomplishment/course/ecd010f4128b38390d620a1e344d59240ca5ae98",
    skills: ["Time series", "Feature engineering"],
  },
  {
    title: "Dimensionality Reduction in Python",
    issuer: "DataCamp",
    platform: "DataCamp",
    kind: "Statement of Accomplishment",
    date: null,
    href: "https://www.datacamp.com/completed/statement-of-accomplishment/course/7a401532dc95a2954ce39df87946b3cd19105041",
    skills: ["PCA", "Feature selection"],
  },
];

export const skills = [
  {
    group: "ML / AI",
    items: ["Python", "PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "SHAP", "FAISS", "RAG", "LLM apps", "Speech AI", "Time-series", "PCA", "Elastic Net", "Pandas", "NumPy"],
  },
  {
    group: "Engineering",
    items: ["FastAPI", "Pydantic", "SQL", "PostgreSQL", "REST", "Docker", "MLflow", "Git", "Linux", "CI/CD", "AWS", "Azure"],
  },
  {
    group: "Analytics & Comms",
    items: ["Power BI", "Excel", "EDA", "Dashboards", "Benchmarking", "Technical docs", "LaTeX"],
  },
];

export type WritingItem = {
  slug: string;
  kind: "research" | "article";
  title: string;
  venue: string;
  date: string;
  authors?: string;
  summary: string;
  pdf?: string;
  pages?: number;
  href?: string;
  thumb?: string;
  tags: string[];
};

export const writing: WritingItem[] = [
  {
    slug: "sauticivic-benchmark",
    kind: "research",
    title: "SautiCivic Bridge: A Safety-Critical Speech Benchmark for Code-Switched Nigerian Civic Grievance Intake",
    venue: "Sahara CodeSwitch Africa Challenge 2026 · Technical Report",
    date: "Sep 2026",
    authors: "Agoro & Akhuabe",
    summary:
      "Benchmarks four ASR engines on code-switched Nigerian complaints and shows that WER hides \"don\"→\"don't\" polarity inversions (16.7–40% of complaints on global models, 0% on Sahara v2.5). The risk gate reaches 100% safe outcomes and 10/10 adversarial cases.",
    pdf: "/papers/sauticivic-benchmark-report.pdf",
    pages: 3,
    tags: ["Speech AI", "Responsible AI", "Benchmark"],
  },
  {
    slug: "dsn-bct-task-b",
    kind: "research",
    title: "Personalised Recommendation via Semantic Retrieval and LLM Reranking",
    venue: "DSN x BCT Hackathon 3.0 · Task B",
    date: "May 2026",
    authors: "Agoro & Ajiboye",
    summary:
      "FAISS retrieval over 112,565 products blended with Bayesian popularity and Gemini reranking, across 5 Nigerian language modes. NDCG@10 0.4210, Hit@10 0.66.",
    pdf: "/papers/dsn-bct-task_b_personalized_recommendation.pdf",
    pages: 11,
    tags: ["RecSys", "RAG", "LLMs"],
  },
  {
    slug: "dsn-bct-task-a",
    kind: "research",
    title: "User Modeling via Two-Agent Persona Simulation",
    venue: "DSN x BCT Hackathon 3.0 · Task A",
    date: "May 2026",
    authors: "Ajiboye & Agoro",
    summary:
      "Gemini Flash builds a persona dossier and Gemini Pro writes RAG-grounded reviews. RMSE 0.7071, BERTScore 0.8447; Nigerian conditioning lifts ROUGE-1 by 4.5%.",
    pdf: "/papers/dsn-bct-task_a_user_modelling.pdf",
    pages: 10,
    tags: ["Agents", "Simulation", "LLMs"],
  },
  {
    slug: "quantvault",
    kind: "article",
    title: "I built QuantVault, a multi-agent runtime that deploys specialist AI personas from a single FastAPI backend",
    venue: "Medium",
    date: "Jul 25, 2026",
    summary:
      "In progress, still being built (article only, no release yet). Lessons so far from building an agent ecosystem: LangGraph orchestration, YAML-swappable personas and tools, and a React dashboard for routing and monitoring.",
    href: "https://medium.com/@agorotimilehin05/i-built-quantvault-a-multi-agent-runtime-that-deploys-specialist-ai-personas-from-a-single-fastapi-4560ab6a6243",
    thumb: "/articles/quantvault.webp",
    tags: ["In progress", "Agents", "LangGraph"],
  },
  {
    slug: "2-hour-gigabyte",
    kind: "article",
    title: "The 2-Hour Gigabyte: Why Nigeria's Internet is a Trap",
    venue: "Medium",
    date: "Dec 22, 2025",
    summary:
      "A data-driven look at telco pricing from 2021–2025: shrinking validity windows, diesel ghost-costs and 3G speeds at 5G prices, backed by a custom scraper and infrastructure reports.",
    href: "https://medium.com/@agorotimilehin05/the-2-hour-gigabyte-why-nigerias-internet-is-a-trap-d1c80890ac75",
    thumb: "/articles/2-hour-gigabyte.webp",
    tags: ["Data journalism", "Nigeria"],
  },
];

export const hobbies = [
  { emoji: "🎧", title: "Music on repeat", body: "Drake in the rotation, always. The playlist below is what's in my ears while I code." },
  { emoji: "⚽", title: "Barça till I die", body: "FC Barcelona fan through the highs and the heartbreaks. Visca el Barça." },
  { emoji: "🎮", title: "Football games", body: "If there's a controller nearby, there's a match about to happen." },
  { emoji: "♟️", title: "Chess", body: "Openings, blunders and the occasional brilliant move. Same energy as debugging." },
  { emoji: "💜", title: "Women in tech", body: "Advocate for women's empowerment and for more seats at the table, in tech and beyond." },
  { emoji: "📱", title: "Certified brainrot", body: "Occasional TikTok brainrot. Strictly for research purposes, obviously." },
];

// Cover art: AniList CDN (via the public AniList API), stored locally in /public/anime. Links go to MyAnimeList.
export const anime = [
  { title: "Hunter x Hunter", sub: "2011 \u00b7 Madhouse \u00b7 148 eps", img: "/anime/hunter-x-hunter.webp", w: 460, h: 651, mal: "https://myanimelist.net/anime/11061", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Berserk", sub: "1997 \u00b7 OLM \u00b7 25 eps", img: "/anime/berserk.webp", w: 460, h: 619, mal: "https://myanimelist.net/anime/33", genres: ["Action", "Adventure", "Drama"] },
  { title: "Naruto", sub: "2002 \u00b7 Studio Pierrot \u00b7 220 eps", img: "/anime/naruto.webp", w: 460, h: 649, mal: "https://myanimelist.net/anime/20", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Black Clover", sub: "2017 \u00b7 Studio Pierrot \u00b7 170 eps", img: "/anime/black-clover.webp", w: 460, h: 650, mal: "https://myanimelist.net/anime/34572", genres: ["Action", "Adventure", "Comedy"] },
];
