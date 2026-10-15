// Multi-turn chat UI check. BASE=http://localhost:3210 node scripts/check-chat.mjs [shot.png]
import { chromium } from "playwright";
const B = process.env.BASE || "http://localhost:3210";
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const errs = []; p.on("pageerror", (e) => errs.push(e.message.slice(0, 100))); p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(1500);
await p.getByRole("button", { name: "Ask about Timi", exact: true }).click();
for (const q of [...(process.env.QS ? JSON.parse(process.env.QS) : ["What anime does Timi like?", "And which one is the oldest?"])]) {
  await p.locator("textarea").first().fill(q); await p.getByRole("button", { name: "Send" }).click(); await p.waitForTimeout(9000);
}
console.log((await p.locator('[role="dialog"]').innerText()).replace(/\n+/g, " | ").slice(0, 1400));
console.log("errors:", errs.length ? errs : "none");
if (process.argv[2]) await p.screenshot({ path: process.argv[2] });
await b.close();
