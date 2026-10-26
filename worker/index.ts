// Tiny Cloudflare Worker. Every page is a prebuilt static file served straight from Workers Static Assets
// (no worker CPU). Only /api/* runs this code (see run_worker_first in wrangler.jsonc).
import { handleChat } from "../src/server/chat";

const ALLOWED = ["https://drizzy765.github.io"];

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (pathname === "/api/chat") {
      const origin = req.headers.get("origin") ?? "";
      const cors: Record<string, string> = ALLOWED.includes(origin)
        ? { "access-control-allow-origin": origin, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", vary: "Origin" }
        : {};
      if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
      if (req.method === "POST") {
        const res = await handleChat(req, env);
        const out = new Response(res.body, res);
        for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
        return out;
      }
      if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
      return handleChat(req, env);
    }
    return env.ASSETS.fetch(req);
  },
};
