import { chromium, devices } from "playwright";
const BASE="https://drizzy.agoro-timilehin.workers.dev", OUT="/workspace/portfolio/screens/live";
const b=await chromium.launch({ args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const errs=[];
async function warm(p){ const h=await p.evaluate(()=>document.body.scrollHeight); for(let y=0;y<h;y+=300){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(80);} await p.waitForTimeout(600);}
async function at(p,sel,off=-24){ const t=await p.evaluate(s=>document.querySelector(s).getBoundingClientRect().top+scrollY,sel); await p.evaluate(v=>scrollTo(0,v),t+off); await p.waitForTimeout(1500); }
const d=await b.newContext({viewport:{width:1280,height:800},colorScheme:"dark"}); const p=await d.newPage(); p.on("pageerror",e=>errs.push(e.message));
await p.goto(BASE+"/writing/sauticivic-benchmark",{waitUntil:"load",timeout:60000}); await p.waitForTimeout(4000); await p.screenshot({path:`${OUT}/paper.png`});
const m=await b.newContext({...(({defaultBrowserType:_,...r})=>r)(devices["iPhone 13"]),colorScheme:"dark"});
const q=await m.newPage(); q.on("pageerror",e=>errs.push("mobile: "+e.message));
await q.goto(BASE+"/",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.waitForTimeout(5000);
await q.screenshot({path:`${OUT}/mobile-home.png`});
await warm(q); await at(q,'[aria-label="Tech stack"]',-200); await q.screenshot({path:`${OUT}/mobile-marquee.png`});
await at(q,"#experience",-10); await q.screenshot({path:`${OUT}/mobile-experience.png`});
console.log("mobile scrollWidth", await q.evaluate(()=>document.documentElement.scrollWidth));
console.log("errors:", errs.length?errs:"none"); await b.close();
