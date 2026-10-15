// Full-page desktop + mobile screenshots of the running site (default http://localhost:3210).
import { chromium, devices } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3210";
const OUT = process.env.OUT_DIR ?? "/workspace/portfolio/screens";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME ?? "/usr/bin/google-chrome",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

async function warm(page) {
  // Scroll through so on-scroll reveals / tickers fire, then return to top.
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}

const targets = [
  { name: "desktop", ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  { name: "mobile", ctx: (({ defaultBrowserType: _d, ...rest }) => rest)(devices["iPhone 13"]) },
];

for (const t of targets) {
  const ctx = await browser.newContext({ ...t.ctx, colorScheme: "dark" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[${t.name}] pageerror:`, e.message));

  for (const [name, path] of [["home", "/"], ["writing", "/writing"], ["about", "/about"]]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    await warm(page);
    await page.screenshot({ path: `${OUT}/${name}-${t.name}.png`, fullPage: true });
    console.log("saved", `${name}-${t.name}.png`);
  }

  // Hero viewport shot (3D sphere)
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/hero-${t.name}.png` });

  // Case-study modal
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /SautiCivic/ }).first().click();
  await page.getByRole("dialog").waitFor({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/case-study-${t.name}.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Chat panel via floating FAB (hash-open is flaky under Playwright)
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Ask about Timi" }).click();
  await page.getByRole("heading", { name: "Ask about Timi" }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/chat-empty-${t.name}.png` });
  await page.getByRole("button", { name: "What has Timi built with LLMs?" }).click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/chat-${t.name}.png` });
  console.log("saved chat", t.name);
  await ctx.close();
}
await browser.close();
