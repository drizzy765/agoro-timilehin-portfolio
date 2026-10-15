// Dev-only route (`next dev`): the ".api.ts" extension is only enabled outside production builds.
// In production the site is a static export and /api/chat is served by worker/index.ts.
import { handleChat } from "@/server/chat";

export const POST = (req: Request) => handleChat(req, { GROQ_API_KEY: process.env.GROQ_API_KEY, GROQ_MODEL: process.env.GROQ_MODEL });
