import { chromium } from "playwright";
const OUT = "/workspace/portfolio/screens/anim";
const B = "http://localhost:3210";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const errors = [];
async function page(vp, opts = {}) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: vp.width < 500 ? 2 : 1, isMobile: vp.width < 500, hasTouch: vp.width < 500, ...opts });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(`${vp.width}: ${e.message}`));
  return { ctx, p };
}
async function walk(p) { // trigger all whileInView reveals
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
}
async function to(p, sel, off = 90) {
  await p.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o); }, [sel, off]);
  await p.waitForTimeout(900);
}
// ---- desktop
{
  const { ctx, p } = await page({ width: 1440, height: 900 });
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/desktop-hero.png` });
  // projects: mid-stagger then tilt hover
  await to(p, "#projects", 60); await p.screenshot({ path: `${OUT}/desktop-projects-stagger.png` });
  const card = p.locator("#projects button").first(); const bb = await card.boundingBox();
  await p.mouse.move(bb.x + bb.width * 0.85, bb.y + bb.height * 0.2, { steps: 8 }); await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/desktop-projects-tilt.png` });
  await p.mouse.move(5, 5);
  await to(p, "#experience", 40); await p.waitForTimeout(600); await p.screenshot({ path: `${OUT}/desktop-experience-timeline.png` });
  await to(p, "#certificates", 60);
  const cert = p.locator("#certificates article").first(); const cb = await cert.boundingBox();
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.waitForTimeout(350);
  await p.screenshot({ path: `${OUT}/desktop-certificates-shine.png` });
  await p.mouse.move(5, 5);
  // magnetic contact
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  const c = p.locator('header a[href="#contact"], nav a[href="#contact"]').first();
  if (await c.count()) { const kb = await c.boundingBox(); await p.mouse.move(kb.x + kb.width + 14, kb.y + kb.height + 8, { steps: 6 }); await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}/desktop-contact-magnetic.png`, clip: { x: Math.max(0, kb.x - 300), y: 0, width: 520, height: 110 } }); }
  // page transition: client nav to /writing, capture mid-transition and settled
  await p.locator('a[href="/writing"]').first().click(); await p.waitForTimeout(140);
  await p.screenshot({ path: `${OUT}/desktop-page-transition-mid.png` });
  await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/desktop-page-transition-done.png` });
  // about anime
  await p.locator('a[href="/about"]').first().click(); await p.waitForTimeout(1500);
  await walk(p); await to(p, "#anime", 80); await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/about-anime-desktop.png` });
  const ac = p.locator("#anime a").nth(1); const ab = await ac.boundingBox();
  await p.mouse.move(ab.x + ab.width / 2, ab.y + ab.height / 2); await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/about-anime-desktop-hover.png` });
  await ctx.close();
}
// ---- mobile
{
  const { ctx, p } = await page({ width: 390, height: 844 });
  for (const path of ["/", "/about", "/writing"]) {
    await p.goto(B + path, { waitUntil: "load" }); await p.waitForTimeout(1500); await walk(p);
    console.log("mobile", path, "scrollWidth", await p.evaluate(() => document.documentElement.scrollWidth));
  }
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(1500); await walk(p);
  await to(p, "#projects", 70); await p.screenshot({ path: `${OUT}/mobile-projects.png` });
  await to(p, "#experience", 70); await p.screenshot({ path: `${OUT}/mobile-experience.png` });
  await to(p, "#certificates", 70); await p.screenshot({ path: `${OUT}/mobile-certificates.png` });
  await p.goto(B + "/about", { waitUntil: "load" }); await p.waitForTimeout(1500); await walk(p);
  await to(p, "#anime", 80); await p.screenshot({ path: `${OUT}/about-anime-mobile.png` });
  await p.evaluate(() => window.scrollBy(0, 560)); await p.waitForTimeout(600); await p.screenshot({ path: `${OUT}/about-anime-mobile-2.png` });
  await ctx.close();
}
// ---- reduced motion: content must be visible without animation
{
  const { ctx, p } = await page({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(1500); await walk(p);
  await to(p, "#projects", 60); await p.screenshot({ path: `${OUT}/desktop-reduced-motion-projects.png` });
  const fab = await p.evaluate(() => { const e = document.querySelector(".fab-breathe"); return e ? getComputedStyle(e).animationName : "none"; });
  const tf = await p.evaluate(() => getComputedStyle(document.querySelector("#projects button").parentElement).transform);
  console.log("reduced: fab animation =", fab, "| tilt transform =", tf);
  await ctx.close();
}
// ---- scroll recording
{
  const { ctx, p } = await page({ width: 1280, height: 720 }, { recordVideo: { dir: "/tmp/vid", size: { width: 1280, height: 720 } } });
  await p.goto(B + "/", { waitUntil: "load" }); await p.waitForTimeout(2500);
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h - 720; y += 28) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(33); }
  await p.waitForTimeout(600);
  await p.locator('a[href="/about"]').first().click(); await p.waitForTimeout(1200);
  await to(p, "#anime", 80); await p.waitForTimeout(1200);
  await ctx.close();
  console.log("video", await p.video().path());
}
console.log("page errors:", errors.length ? errors : "none");
await b.close();
