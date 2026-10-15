// Tiny Cloudflare Worker. Every page is a prebuilt static file served straight from Workers Static Assets
// (no worker CPU). Only /api/* runs this code (see run_worker_first in wrangler.jsonc).
import { handleChat } from "../src/server/chat";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (pathname === "/api/chat") {
      if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
      return handleChat(req, env);
    }
    return env.ASSETS.fetch(req);
  },
};
