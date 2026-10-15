import { chromium, devices } from "playwright";
const OUT="/workspace/portfolio/screens/final";
const b=await chromium.launch({ args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const m=await b.newContext({...(({defaultBrowserType:_,...r})=>r)(devices["iPhone 13"]),colorScheme:"dark"});
const q=await m.newPage();
await q.goto("http://localhost:3210/",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.waitForTimeout(5000);
await q.screenshot({path:`${OUT}/mobile-home.png`});
for (const [n,sel,off] of [["mobile-marquee",'[aria-label="Tech stack"]',220],["mobile-experience","#experience",-10],["mobile-certificates","#certificates",-10]]) {
  const top=await q.evaluate(([s])=>document.querySelector(s).getBoundingClientRect().top+scrollY,[sel]);
  for (let y=0;y<top;y+=300){await q.evaluate(v=>scrollTo(0,v),y);await q.waitForTimeout(60);}
  await q.evaluate(v=>scrollTo(0,v), top-off); await q.waitForTimeout(1500);
  await q.screenshot({path:`${OUT}/${n}.png`});
}
console.log("ok", await q.evaluate(()=>document.documentElement.scrollWidth));
await b.close();
