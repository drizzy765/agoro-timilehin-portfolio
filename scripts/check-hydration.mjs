// Fresh-load hydration + hero photo check. BASE=... node scripts/check-hydration.mjs [runs]
import { chromium } from "playwright";
const B = process.env.BASE || "http://localhost:3210", RUNS = Number(process.argv[2] || 2);
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
let total = 0;
for (const reducedMotion of ["no-preference", "reduce"]) for (const width of [1280, 1366, 1440, 1920]) for (let r = 0; r < RUNS; r++) {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, reducedMotion, locale: "en-GB", timezoneId: "Africa/Lagos" });
  for (const path of ["/", "/about", "/writing"]) {
    const p = await ctx.newPage(); const errs = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
    p.on("console", (m) => m.type() === "error" && /React|hydrat|#418|#423|#425/i.test(m.text()) && errs.push(m.text().slice(0, 160)));
    await p.goto(B + path, { waitUntil: "load" }); await p.waitForTimeout(2500);
    let photo = "";
    if (path === "/") photo = await p.evaluate(() => { const i = document.querySelector('img[alt^="Portrait"]'); if (!i) return "no-img"; let e = i, op = 1; while (e) { op *= Number(getComputedStyle(e).opacity); e = e.parentElement; } const r = i.getBoundingClientRect(); return `photo opacity=${op.toFixed(2)} loaded=${i.complete && i.naturalWidth > 0} box=${Math.round(r.width)}x${Math.round(r.height)}`; });
    total += errs.length;
    if (errs.length || (photo && !photo.includes("opacity=1.00"))) console.log(`${reducedMotion} ${width} run${r} ${path} ${photo} ${errs.length ? JSON.stringify(errs) : ""}`);
    else if (path === "/" && r === 0) console.log(`${reducedMotion} ${width} ${path} OK ${photo}`);
    if (path === "/" && process.env.SHOT && width === 1440 && r === 0 && reducedMotion === "no-preference") await p.screenshot({ path: process.env.SHOT });
    await p.close();
  }
  await ctx.close();
}
console.log("TOTAL React/page errors:", total);
await b.close();
