// Animation health check. BASE=... TAG=before|after node scripts/check-anim.mjs
import { chromium } from "playwright";
import { createHash } from "node:crypto";
const B = process.env.BASE || "http://localhost:3210", TAG = process.env.TAG || "run";
const OUT = "/workspace/portfolio/screens/drizzy-live/anim-check";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const h = (buf) => createHash("md5").update(buf).digest("hex").slice(0, 10);
for (const vp of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500, reducedMotion: "no-preference" });
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push("pageerror " + e.message.slice(0, 120)));
  p.on("console", (m) => m.type() === "error" && errs.push("console " + m.text().slice(0, 120)));
  p.on("response", (r) => r.status() >= 400 && errs.push(r.status() + " " + r.url().slice(0, 100)));
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForFunction(() => document.querySelector("canvas"), null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(2000);
  const info = await p.evaluate(() => ({
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    canvas: document.querySelectorAll("canvas").length,
    svgSphere: !!document.querySelector("#sg"),
    hydrated: !!Object.keys(document.querySelector("#main") || {}).find((k) => k.startsWith("__react")),
    fab: (() => { const e = document.querySelector(".fab-breathe"); return e ? getComputedStyle(e).animationName + "/" + getComputedStyle(e).animationPlayState : "missing"; })(),
    marquee: [...document.querySelectorAll("[class*=marquee]")].slice(0, 4).map((e) => `${e.className.toString().slice(0, 40)} :: ${getComputedStyle(e).animationName} ${getComputedStyle(e).animationPlayState} ${getComputedStyle(e).animationDuration}`),
  }));
  console.log(vp.name, JSON.stringify(info));
  // Sphere: two screenshots of the hero right half, 1.5s apart
  const cbox = await p.locator("canvas").first().boundingBox().catch(() => null);
  const sphereClip = cbox ? { x: Math.max(0, cbox.x), y: Math.max(0, cbox.y), width: Math.min(cbox.width, vp.width - Math.max(0, cbox.x)), height: Math.min(cbox.height, vp.height - Math.max(0, cbox.y)) } : { x: 0, y: 0, width: vp.width, height: 400 };
  await p.screenshot({ path: `${OUT}/${TAG}-${vp.name}-hero.png` });
  const s1 = await p.screenshot({ clip: sphereClip }); await p.waitForTimeout(1500); const s2 = await p.screenshot({ clip: sphereClip, path: `${OUT}/${TAG}-${vp.name}-sphere.png` });
  console.log(vp.name, "sphere frames differ:", h(s1) !== h(s2));
  // Marquee: transform of first strip over time
  const mq = async () => p.evaluate(() => { const e = [...document.querySelectorAll("[class*=marquee]")].find((x) => getComputedStyle(x).animationName !== "none"); return e ? getComputedStyle(e).transform : "no-animated-el"; });
  const marqueeEl = p.locator("[class*=marquee]").first();
  if (await marqueeEl.count()) { await marqueeEl.scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -200)); }
  await p.waitForTimeout(400); const m1 = await mq(); const a = await p.screenshot(); await p.waitForTimeout(1200); const m2 = await mq();
  await p.screenshot({ path: `${OUT}/${TAG}-${vp.name}-marquee.png` });
  console.log(vp.name, "marquee transform moves:", m1 !== m2, m1.slice(0, 50), "->", m2.slice(0, 50));
  // Scroll reveal: project cards opacity
  await p.evaluate(() => document.querySelector("#projects").scrollIntoView()); await p.waitForTimeout(1200);
  console.log(vp.name, "project card opacities:", await p.evaluate(() => [...document.querySelectorAll("#projects li > div")].slice(0, 4).map((d) => getComputedStyle(d).opacity).join(",")));
  if (vp.width > 500) {
    // Tilt: hover a project card -> rotate transform
    const card = p.locator("#projects li button").first(); const cb = await card.boundingBox();
    await p.mouse.move(cb.x + cb.width * 0.85, cb.y + cb.height * 0.2, { steps: 6 }); await p.waitForTimeout(600);
    console.log(vp.name, "tilt transform on hover:", await p.evaluate(() => getComputedStyle(document.querySelector("#projects li button").parentElement.parentElement).transform.slice(0, 40)));
    await p.mouse.move(5, 5);
    // Magnetic Contact
    await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await p.waitForTimeout(400);
    const c = p.locator('header a[href="#contact"]').first(); const kb = await c.boundingBox();
    await p.mouse.move(kb.x + kb.width * 0.92, kb.y + kb.height * 0.9, { steps: 6 }); await p.waitForTimeout(500);
    console.log(vp.name, "magnetic transform near Contact:", await p.evaluate(() => getComputedStyle(document.querySelector('header a[href="#contact"]').parentElement).transform));
  }
  console.log(vp.name, "errors:", errs.length ? errs : "none");
  await ctx.close();
}
await b.close();
