import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// Production = fully static export (out/), served by Cloudflare Workers Static Assets so page
// requests never run worker code (free plan: 10ms CPU). /api/chat lives in worker/index.ts.
export default function config(phase: string): NextConfig {
  const isBuild = phase === PHASE_PRODUCTION_BUILD;
  return {
    output: isBuild ? "export" : undefined,
    // GitHub Pages mirror (drizzy765.github.io/portfolio) sets PAGES_BASE_PATH=/portfolio; workers.dev build leaves it unset.
    basePath: process.env.PAGES_BASE_PATH || undefined,
    assetPrefix: process.env.PAGES_BASE_PATH || undefined,
    env: { NEXT_PUBLIC_BASE_PATH: process.env.PAGES_BASE_PATH || "" },
    images: { unoptimized: true },
    // `route.api.ts` (dev-only chat route) is only picked up outside the production build.
    pageExtensions: isBuild ? ["tsx", "ts", "jsx", "js"] : ["tsx", "ts", "jsx", "js", "api.ts"],
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}
