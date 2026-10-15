# Agoro Oluwatimilehin (Timi): Portfolio

Personal portfolio of **Agoro Oluwatimilehin (Timi)**, AI/ML Engineer in Lagos, Nigeria. It covers speech, LLM, retrieval and forecasting systems for emerging markets.

**Live:** https://agoro-timilehin.agoro-timilehin.workers.dev

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

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Motion · React Three Fiber / drei / postprocessing · react-activity-calendar · Vercel AI SDK + `@ai-sdk/groq` · simple-icons · lucide-react · deployed on **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

## Develop

```bash
npm install
cp .dev.vars.example .dev.vars        # for wrangler preview; add GROQ_API_KEY=... (gitignored)
echo "GROQ_API_KEY=..." > .env.local  # for next dev / next start (gitignored)
npm run dev                           # http://localhost:3000
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | `next build` (runs `scripts/build-knowledge.mjs` first to regenerate the chat knowledge base) |
| `npm run preview` | OpenNext build + local Workers runtime preview (needs Node ≥ 22 for Wrangler) |
| `npm run deploy` | OpenNext build + deploy to Cloudflare Workers |
| `npm run content` | Re-import projects and rebuild the knowledge base |

## Deploy (Cloudflare Workers, free plan)

```bash
export CLOUDFLARE_API_TOKEN=...            # token with Workers Scripts:Edit
export CLOUDFLARE_ACCOUNT_ID=...
export NEXT_PUBLIC_SITE_URL=https://agoro-timilehin.agoro-timilehin.workers.dev   # inlined at build time
printf '%s' "$GROQ_API_KEY" | npx wrangler secret put GROQ_API_KEY
npm run deploy
```

Optional env: `GROQ_MODEL` (defaults to `openai/gpt-oss-20b`).

Notes:
- Next.js `cacheComponents` is intentionally **off**: it hangs requests on the Workers runtime ([vercel/next.js#94880](https://github.com/vercel/next.js/issues/94880)). Home uses ISR (`revalidate = 3600`) instead.
- No R2 incremental cache is configured (free tier, zero setup). Add `NEXT_INC_CACHE_R2_BUCKET` later for persistent ISR.

## License

Code: MIT. Content (text, photos, papers, logos) © Agoro Oluwatimilehin and the respective owners. Not for reuse.
