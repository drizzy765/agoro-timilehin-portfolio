# Agoro Oluwatimilehin (Timi): Portfolio

Personal portfolio of **Agoro Oluwatimilehin (Timi)**, AI/ML Engineer in Lagos, Nigeria. It covers speech, LLM, retrieval and forecasting systems for emerging markets.

**Live:** https://drizzy.agoro-timilehin.workers.dev

## Features

- **Hero** with a decrypting name, an interactive 3D node sphere (React Three Fiber, static SVG fallback for reduced-motion / low-end devices) and an "Ask my Agent" entry point.
- **Diagonal tech-stack marquee**: two crossing strips that loop in opposite directions, pause on hover and stay static under `prefers-reduced-motion`.
- **Projects** bento grid (24 projects) with category filters, expandable case studies and generated covers.
- **Experience timeline** with company logos and a scroll-traced beam.
- **Verified certificates** (IBM via Coursera, DataCamp) with verify links.
- **Contribution heatmaps** for GitHub, LeetCode and Deep-ML, refreshed hourly with bundled snapshot fallbacks.
- **Writing**: research papers readable in-site (PDF), plus Medium articles.
- **"Ask about Timi" chat** grounded in a generated knowledge base (CV, READMEs, papers), streaming from Groq (`openai/gpt-oss-20b`). If no key is set it falls back to a friendly static reply.
- **About** page with a Spotify playlist embed and a live "Now playing" card via [Lanyard](https://github.com/Phineas/lanyard) (Discord presence).
- **Themes**: default `mono-red` + Space Grotesk / Inter / Space Mono. Preview others with `?theme=lime|midnight-gold|ember|aurora` and `?font=geist|editorial|luxe|futurist`. All themes meet WCAG AA contrast.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Motion · React Three Fiber / drei / postprocessing · react-activity-calendar · AI SDK UI (`@ai-sdk/react`) · Groq · simple-icons · lucide-react · deployed on **Cloudflare Workers** (static export + Workers Static Assets, plus a ~30 KB worker for the chat API).

## Develop

```bash
npm install
cp .dev.vars.example .dev.vars        # for wrangler dev/preview; add GROQ_API_KEY=... (gitignored)
echo "GROQ_API_KEY=..." > .env.local  # for next dev (gitignored)
npm run dev                           # http://localhost:3000 (chat via the dev-only route.api.ts)
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | Static export to `out/` (runs `scripts/build-knowledge.mjs` first to regenerate the chat knowledge base) |
| `npm start` | Serve `out/` + the chat worker locally with `wrangler dev` on :3210 (needs Node ≥ 22) |
| `npm run preview` | Build, then `wrangler dev` |
| `npm run deploy` | Build, then `wrangler deploy` |
| `npm run content` | Re-import projects and rebuild the knowledge base |

## Deploy (Cloudflare Workers, free plan)

```bash
export CLOUDFLARE_API_TOKEN=...            # token with Workers Scripts:Edit
export CLOUDFLARE_ACCOUNT_ID=...
export NEXT_PUBLIC_SITE_URL=https://drizzy.agoro-timilehin.workers.dev   # inlined at build time
printf '%s' "$GROQ_API_KEY" | npx wrangler secret put GROQ_API_KEY
npm run deploy
```

Optional env: `GROQ_MODEL` (defaults to `openai/gpt-oss-20b`).

How it fits the free plan (10 ms CPU per request):
- Every page is prerendered at build time (`output: "export"`) and served by **Workers Static Assets**, so page and asset requests never execute worker code (no CPU billed).
- Only `/api/*` runs `worker/index.ts` (`run_worker_first`). The chat handler (`src/server/chat.ts`) calls Groq's OpenAI-compatible API with `fetch` and re-emits the AI SDK UI-message SSE stream; no AI SDK/zod on the server, so CPU stays low while it waits on I/O.
- GitHub / LeetCode / Deep-ML activity is fetched at **build time** (falls back to the snapshots in `src/data/`). Redeploy to refresh the numbers.

## License

Code: MIT. Content (text, photos, papers, logos) © Agoro Oluwatimilehin and the respective owners. Not for reuse.
