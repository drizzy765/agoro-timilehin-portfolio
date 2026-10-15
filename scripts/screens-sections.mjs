import { chromium, devices } from "playwright";
const BASE="http://localhost:3210", OUT="/workspace/portfolio/screens/final";
const b = await chromium.launch({ args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const errs=[];
async function warm(p){ const h=await p.evaluate(()=>document.body.scrollHeight); for(let y=0;y<h;y+=300){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(120);} await p.waitForTimeout(800);}
const d=await b.newContext({viewport:{width:1280,height:800},colorScheme:"dark"});
const p=await d.newPage(); p.on("pageerror",e=>errs.push(e.message));
await p.goto(BASE+"/",{waitUntil:"networkidle"}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(3000);
await warm(p);
// marquee: hero bottom + strips
const mTop = await p.evaluate(()=>document.querySelector('[aria-label="Tech stack"]').getBoundingClientRect().top + scrollY);
await p.evaluate(v=>scrollTo(0,v), mTop-330); await p.waitForTimeout(1500);
await p.screenshot({path:`${OUT}/marquee.png`});
console.log("marquee anim:", await p.evaluate(()=>[...document.querySelectorAll(".marquee-track")].map(t=>getComputedStyle(t).animationName+" "+getComputedStyle(t).transform).join(" | ")));
for (const id of ["experience","certificates"]) {
  await p.setViewportSize({width:1280,height:1300});
  await p.addStyleTag({content:"body > header, header.fixed, .fixed{visibility:hidden !important}"});
  const top = await p.evaluate(id=>document.getElementById(id).getBoundingClientRect().top+scrollY, id);
  await p.evaluate(v=>scrollTo(0,v), top-24); await p.waitForTimeout(1500);
  const r = await p.evaluate(id=>{const b=document.getElementById(id).getBoundingClientRect();return {x:b.left,y:b.top,w:b.width,h:b.height}}, id);
  await p.screenshot({path:`${OUT}/${id}.png`, clip:{x:Math.max(0,r.x-48),y:Math.max(0,r.y-16),width:r.w+96,height:Math.min(r.h+32,1300-Math.max(0,r.y-16))}});
  console.log(id, JSON.stringify(r));
}
await p.setViewportSize({width:1280,height:800});
console.log("logos:", await p.evaluate(()=>[...document.querySelectorAll('#experience img')].map(i=>i.alt+":"+(i.complete&&i.naturalWidth>0))));
console.log("verify links:", await p.evaluate(()=>[...document.querySelectorAll('#certificates a')].map(a=>a.href.slice(0,70))));
const m=await b.newContext({...(({defaultBrowserType:_,...r})=>r)(devices["iPhone 13"]),colorScheme:"dark"});
const q=await m.newPage(); q.on("pageerror",e=>errs.push(e.message));
await q.goto(BASE+"/",{waitUntil:"networkidle"}); await q.waitForTimeout(3000); await warm(q); await q.evaluate(()=>scrollTo(0,0)); await q.waitForTimeout(1000);
await q.screenshot({path:`${OUT}/mobile-home.png`,fullPage:true});
console.log("mobile scrollWidth", await q.evaluate(()=>document.documentElement.scrollWidth));
console.log("pageerrors:", errs.length?errs:"none");
await b.close();
