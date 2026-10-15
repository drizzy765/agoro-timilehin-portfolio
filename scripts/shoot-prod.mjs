import { chromium, devices } from "playwright";
const BASE=process.env.BASE||"https://drizzy.agoro-timilehin.workers.dev", OUT="/workspace/portfolio/screens/live";
const b=await chromium.launch({ args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const errs=[];
async function warm(p){ const h=await p.evaluate(()=>document.body.scrollHeight); for(let y=0;y<h;y+=300){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(80);} await p.waitForTimeout(600);}
async function at(p,sel,off=-24){ const t=await p.evaluate(s=>document.querySelector(s).getBoundingClientRect().top+scrollY,sel); await p.evaluate(v=>scrollTo(0,v),t+off); await p.waitForTimeout(1500); }
const d=await b.newContext({viewport:{width:1280,height:800},colorScheme:"dark"});
const p=await d.newPage(); p.on("pageerror",e=>errs.push(e.message)); p.on("console",m=>{if(m.type()==="error")errs.push("console: "+m.text().slice(0,150))});
await p.goto(BASE+"/",{waitUntil:"networkidle"}); await p.evaluate(()=>document.fonts.ready); await p.waitForSelector("canvas",{timeout:15000}).catch(()=>errs.push("no canvas")); await p.waitForTimeout(4000);
await p.screenshot({path:`${OUT}/hero.png`});
await warm(p);
await at(p,'[aria-label="Tech stack"]',-300); await p.screenshot({path:`${OUT}/marquee.png`});
await at(p,"#projects",-80); await p.screenshot({path:`${OUT}/projects.png`});
await at(p,"#experience",-80); await p.screenshot({path:`${OUT}/experience.png`});
await at(p,"#certificates",-80); await p.screenshot({path:`${OUT}/certificates.png`});
await at(p,"#contributions",-80);
await p.getByRole("radio",{name:/leetcode/i}).first().click().catch(async()=>{await p.getByText("LeetCode",{exact:true}).first().click().catch(()=>{})});
await p.waitForTimeout(1500); await p.screenshot({path:`${OUT}/contributions-leetcode.png`});
await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(600);
await p.getByRole("button",{name:"Ask about Timi",exact:true}).click();
await p.locator("textarea").first().fill("What has Timi built with LLMs?");
await p.getByRole("button",{name:"Send"}).click(); await p.waitForTimeout(16000);
console.log("CHAT:", (await p.locator('[role="dialog"]').innerText()).replace(/\n+/g," | ").slice(0,500));
await p.screenshot({path:`${OUT}/chat-answer.png`});
for (const [n,u] of [["about","/about"],["writing","/writing"],["paper","/writing/sauticivic-benchmark"]]) { await p.goto(BASE+u,{waitUntil:n==="paper"?"load":"networkidle",timeout:60000}); await p.waitForTimeout(2500); if(n!=="paper") await warm(p); await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(800); await p.screenshot({path:`${OUT}/${n}.png`}); }
const m=await b.newContext({...(({defaultBrowserType:_,...r})=>r)(devices["iPhone 13"]),colorScheme:"dark"});
const q=await m.newPage(); q.on("pageerror",e=>errs.push("mobile: "+e.message));
await q.goto(BASE+"/",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.waitForTimeout(5000);
await q.screenshot({path:`${OUT}/mobile-home.png`});
await warm(q); await at(q,'[aria-label="Tech stack"]',-200); await q.screenshot({path:`${OUT}/mobile-marquee.png`});
await at(q,"#experience",-10); await q.screenshot({path:`${OUT}/mobile-experience.png`});
console.log("mobile scrollWidth", await q.evaluate(()=>document.documentElement.scrollWidth));
console.log("errors:", errs.length?errs:"none");
await b.close();
