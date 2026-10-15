import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const jobs = [...["lime","midnight-gold","ember","aurora","mono-red"].map(t=>[`theme-${t}`,`?theme=${t}`]), ...["editorial","grotesk","luxe","futurist"].map(f=>[`font-${f}`,`?theme=lime&font=${f}`])];
for (const [name,q] of jobs) {
  const ctx = await b.newContext({ viewport:{width:1280,height:800}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3210/"+q, { waitUntil:"networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForSelector("canvas", { timeout: 15000 }).catch(()=>console.log(name,"no canvas"));
  await p.waitForTimeout(4000);
  const info = await p.evaluate(()=>({t:document.documentElement.dataset.theme||"(default)",f:document.documentElement.dataset.font||"(default)",h1:getComputedStyle(document.querySelector("h1")).fontFamily.slice(0,40),fonts:[...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i).join(",")}));
  console.log(name, JSON.stringify(info));
  await p.screenshot({ path:`/workspace/portfolio/screens/themes/${name}.png` });
  await ctx.close();
}
await b.close();
