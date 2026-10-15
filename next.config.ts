import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// Production = fully static export (out/), served by Cloudflare Workers Static Assets so page
// requests never run worker code (free plan: 10ms CPU). /api/chat lives in worker/index.ts.
export default function config(phase: string): NextConfig {
  const isBuild = phase === PHASE_PRODUCTION_BUILD;
  return {
    output: isBuild ? "export" : undefined,
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
