import { chromium, devices } from "playwright";
const BASE="http://localhost:3210", OUT="/workspace/portfolio/screens/final";
const browser = await chromium.launch({ args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
async function warm(p){ const h=await p.evaluate(()=>document.body.scrollHeight); for(let y=0;y<h;y+=400){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(100);} await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(1000);}
const errs=[];
const d=await browser.newContext({viewport:{width:1280,height:800},colorScheme:"dark"});
let p=await d.newPage(); p.on("pageerror",e=>errs.push(e.message));
await p.goto(BASE+"/",{waitUntil:"networkidle"}); await p.evaluate(()=>document.fonts.ready); await p.waitForSelector("canvas").catch(()=>{}); await p.waitForTimeout(5000);
console.log("default attrs:", await p.evaluate(()=>({theme:document.documentElement.dataset.theme??"(none=mono-red)",font:document.documentElement.dataset.font??"(none=grotesk)",h1:getComputedStyle(document.querySelector("h1")).fontFamily.split(",")[0],body:getComputedStyle(document.body).fontFamily.split(",")[0],bg:getComputedStyle(document.body).backgroundColor})));
await p.screenshot({path:`${OUT}/hero.png`});
await warm(p);
for (const id of ["projects","contributions"]) { await p.locator("#"+id).scrollIntoViewIfNeeded(); await p.evaluate(()=>scrollBy(0,-80)); await p.waitForTimeout(1500); await p.screenshot({path:`${OUT}/${id}.png`}); }
await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(500);
await p.getByRole("button",{name:"Ask about Timi",exact:true}).click();
await p.getByRole("heading",{name:"Ask about Timi"}).waitFor({timeout:10000}); await p.waitForTimeout(800);
await p.screenshot({path:`${OUT}/chat-open.png`});
await p.locator("textarea").first().fill("What has Timi built with LLMs?");
await p.getByRole("button",{name:"Send"}).click(); await p.waitForTimeout(15000);
console.log("CHAT:", (await p.locator('[role="dialog"]').innerText()).replace(/\n+/g," | ").slice(0,1600));
await p.screenshot({path:`${OUT}/chat-answer.png`});
for (const [n,u] of [["writing","/writing"],["about","/about"]]) { await p.goto(BASE+u,{waitUntil:"networkidle"}); await p.waitForTimeout(2500); await warm(p); await p.screenshot({path:`${OUT}/${n}.png`}); }
console.log("link style:", await p.evaluate(()=>{const a=document.querySelector("a.text-cyan"); if(!a) return "no a.text-cyan on about"; const c=getComputedStyle(a); return c.textDecorationLine+" "+c.textDecorationColor;}));
const m=await browser.newContext({...(({defaultBrowserType:_,...r})=>r)(devices["iPhone 13"]),colorScheme:"dark"});
p=await m.newPage(); p.on("pageerror",e=>errs.push(e.message));
await p.goto(BASE+"/",{waitUntil:"networkidle"}); await p.waitForTimeout(6000);
await p.screenshot({path:`${OUT}/mobile-home.png`});
console.log("pageerrors:", errs.length?errs:"none");
await browser.close();
