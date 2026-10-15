import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Free tier: no R2/KV incremental cache. Prerendered pages are served from static assets;
// revalidation falls back to the default (in-memory) cache. Add R2 later if needed.
export default defineCloudflareConfig({});
