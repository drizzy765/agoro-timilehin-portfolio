// Click every project card and measure time until its case-study dialog is visible in the viewport.
// BASE=... node scripts/check-projects.mjs [screenshot.png]
import { chromium } from "playwright";
const B = process.env.BASE || "http://localhost:3210";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const results = [];
for (const vp of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500, deviceScaleFactor: vp.width < 500 ? 2 : 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(2000);
  if (process.env.WRAP) console.log("wrapper style:", await p.evaluate(() => document.querySelector("#main > div")?.getAttribute("style")));
  const n = await p.locator("#projects button[data-slug], #projects li button").count();
  for (let i = 0; i < n; i++) {
    const card = p.locator("#projects li button").nth(i);
    await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
    const title = (await card.locator("h3").first().innerText()).trim();
    const t0 = Date.now();
    if (vp.width < 500) await card.tap(); else await card.click();
    let ok = false, ms = 0, rect = null;
    while (Date.now() - t0 < 4000) {
      rect = await p.evaluate(() => { const a = document.querySelector('[role="dialog"] article'); if (!a) return null; const r = a.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), op: getComputedStyle(a).opacity }; });
      if (rect && rect.top >= -2 && rect.top < vp.height - 100 && rect.h > 150 && Number(rect.op) > 0.95) { ok = true; ms = Date.now() - t0; break; }
      await p.waitForTimeout(25);
    }
    if (ok && i === 0 && process.argv[2] && vp.name === "desktop") { await p.waitForTimeout(400); await p.screenshot({ path: process.argv[2] }); }
    results.push({ vp: vp.name, i, title, ok, ms: ok ? ms : null, rect });
    console.log(vp.name, String(i).padStart(2), ok ? `OK ${ms}ms` : `FAIL ${JSON.stringify(rect)}`, title);
    await p.keyboard.press("Escape"); await p.waitForTimeout(150);
    const still = await p.locator('[role="dialog"]').count();
    if (still) { await p.locator('[aria-label="Close case study"]').first().click({ force: true }).catch(() => {}); await p.waitForTimeout(600); }
  }
  console.log(vp.name, "errors:", errs.length ? errs : "none");
  await ctx.close();
}

// Phase 2: hero "View Projects", every filter, and arriving from /about and /writing via client nav.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
  const openFirst = async (label) => {
    const card = p.locator("#projects li button").first(); await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
    const t0 = Date.now(); await card.click();
    await p.waitForFunction(() => { const a = document.querySelector('[role="dialog"] article'); if (!a) return false; const r = a.getBoundingClientRect(); return r.top >= -2 && r.top < innerHeight - 100 && Number(getComputedStyle(a).opacity) > 0.95; }, null, { timeout: 4000 }).then(() => console.log(label, "open OK", Date.now() - t0 + "ms"), () => console.log(label, "open FAIL"));
    await p.keyboard.press("Escape"); await p.waitForTimeout(500);
  };
  const visibleCards = () => p.evaluate(() => [...document.querySelectorAll("#projects li")].filter((li) => { const r = li.getBoundingClientRect(); return r.height > 50 && Number(getComputedStyle(li).opacity) > 0.9; }).length);
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(1500);
  const t0 = Date.now(); await p.locator('a[href="#projects"]').first().click(); await p.waitForTimeout(700);
  const top = await p.evaluate(() => Math.round(document.querySelector("#projects").getBoundingClientRect().top));
  console.log("View Projects: #projects top =", top, "| visible cards after 700ms:", await visibleCards());
  const filters = p.locator("#projects [role=group] button, #projects [aria-pressed]");
  const fc = await filters.count();
  for (let i = 0; i < fc; i++) {
    const f = filters.nth(i); const name = (await f.innerText()).replace(/\s+/g, " ");
    await f.click(); await p.waitForTimeout(450);
    console.log("filter", name.padEnd(22), "visible cards:", await visibleCards());
  }
  await filters.first().click(); await p.waitForTimeout(400);
  await openFirst("home");
  for (const from of ["/about", "/writing"]) {
    await p.goto(B + from, { waitUntil: "load" }); await p.waitForTimeout(1200);
    await p.locator('nav a[href="/"], header a[href="/"]').first().click(); await p.waitForURL(B + "/"); await p.waitForTimeout(800);
    const wrap = await p.evaluate(() => getComputedStyle(document.querySelector("#main > div")).filter);
    console.log(`from ${from}: wrapper filter after transition = ${wrap}`);
    await openFirst(`from ${from}`);
  }
  console.log("phase2 errors:", errs.length ? errs : "none");
  await ctx.close();
}
const bad = results.filter((r) => !r.ok || r.ms > 1000);
console.log(`total ${results.length}, slow/failed ${bad.length}, max ${Math.max(...results.filter((r) => r.ok).map((r) => r.ms))}ms`);
await b.close();
