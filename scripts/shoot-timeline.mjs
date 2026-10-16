// Mobile timeline/certificates screenshots + count of reveal elements still hidden after a full scroll.
import { chromium } from "playwright";
const B = process.env.BASE, TAG = process.env.TAG, OUT = "/workspace/portfolio/screens/drizzy-live/anim-check";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const p = await ctx.newPage();
await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(2500);
const H = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < H; y += 300) { await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y); await p.waitForTimeout(150); }
await p.waitForTimeout(1200);
const stuck = await p.evaluate(() => [...document.querySelectorAll("#main *")].filter((e) => e.style && e.style.opacity !== "" && Number(e.style.opacity) < 0.05 && !e.className.toString().includes("pointer-events-none")).map((e) => e.className.toString().slice(0, 40)));
console.log(TAG, "mobile reveal elements still hidden after full scroll:", stuck.length, JSON.stringify(stuck));
for (const id of ["experience", "certificates"]) {
  const y = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top + scrollY - 70, id);
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y); await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/${TAG}-mobile-${id}.png` });
}
await b.close();
