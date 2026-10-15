import { chromium } from "playwright";
const B = process.env.BASE || "https://drizzy.agoro-timilehin.workers.dev", OUT = process.env.OUT || "/workspace/portfolio/screens/drizzy-live";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
async function walk(p) { const h = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < h; y += 500) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(150); } }
async function to(p, sel, off = 80) { await p.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o); }, [sel, off]); await p.waitForTimeout(1000); }
// fresh-load console/page errors, desktop + mobile
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) for (const path of ["/", "/about", "/writing", "/writing/sauticivic-benchmark"]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 }); const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 90)));
  p.on("response", (r) => r.status() >= 400 && errs.push(r.status() + " " + r.url().slice(0, 120)));
  p.on("console", (m) => m.type() === "error" && errs.push("console: " + m.text().slice(0, 110)));
  const r = await p.goto(B + path, { waitUntil: "load" }); await p.waitForTimeout(3000);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(vp.width, path, r.status(), "scrollWidth", sw, errs.length ? errs : "no errors"); await ctx.close();
}
// desktop shots
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(3500); await p.screenshot({ path: `${OUT}/desktop-hero.png` });
  await walk(p); await to(p, "#projects", 60); await p.screenshot({ path: `${OUT}/desktop-projects.png` });
  const lc = await p.getByText(/LeetCode/i).count(); const solved = await p.evaluate(() => /LeetCode[\s\S]{0,400}?(\d+)\s*(solved|Solved)/.test(document.body.innerText));
  console.log("LeetCode mentions:", lc, "solved count rendered:", solved);
  const el = p.getByText(/LeetCode/i).first(); await el.scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -200)); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/desktop-leetcode.png` });
  await p.goto(B + "/about", { waitUntil: "load" }); await p.waitForTimeout(1500); await walk(p); await to(p, "#anime");
  const imgs = await p.evaluate(() => [...document.querySelectorAll("#anime img")].map((i) => i.complete && i.naturalWidth > 0));
  const links = await p.evaluate(() => [...document.querySelectorAll("#anime a[href*=\"myanimelist.net/anime\"]")].map((a) => a.href));
  console.log("anime images loaded:", imgs, "MAL links:", links);
  await p.screenshot({ path: `${OUT}/about-anime-desktop.png` }); await ctx.close();
}
// mobile shots
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const p = await ctx.newPage();
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(3500); await p.screenshot({ path: `${OUT}/mobile-home.png` });
  await p.goto(B + "/about", { waitUntil: "load" }); await p.waitForTimeout(1500); await walk(p); await to(p, "#anime"); await p.screenshot({ path: `${OUT}/about-anime-mobile.png` });
  await ctx.close();
}
await b.close();
