import { chromium, devices } from "playwright";
const BASE="http://localhost:3210", OUT="/workspace/portfolio/screens";
const browser = await chromium.launch({ executablePath:"/usr/bin/google-chrome", args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
async function warm(page){ const h=await page.evaluate(()=>document.body.scrollHeight); for(let y=0;y<h;y+=400){await page.evaluate(v=>scrollTo(0,v),y);await page.waitForTimeout(100);} await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(1200);}
const errs=[];
const d=await browser.newContext({viewport:{width:1440,height:900},colorScheme:"dark"});
let p=await d.newPage(); p.on("pageerror",e=>errs.push(e.message));
for (const [n,u] of [["home-desktop","/"],["writing-desktop","/writing"],["about-desktop","/about"],["paper-reader-desktop","/writing/sauticivic-benchmark"]]) {
  await p.goto(BASE+u,{waitUntil:"networkidle"}); await p.waitForTimeout(2500); await warm(p);
  await p.screenshot({path:`${OUT}/${n}.png`,fullPage:n!=="paper-reader-desktop"}); console.log("saved",n);
}
await p.goto(BASE+"/",{waitUntil:"networkidle"}); await p.waitForTimeout(6000);
await p.screenshot({path:`${OUT}/hero-desktop.png`});
await p.locator("#contributions").scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
await p.screenshot({path:`${OUT}/contributions-desktop.png`});
await p.locator("#projects").scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
await p.screenshot({path:`${OUT}/projects-desktop.png`});
await p.getByRole("button",{name:"Ask about Timi",exact:true}).click();
await p.getByRole("heading",{name:"Ask about Timi"}).waitFor({timeout:10000});
await p.waitForTimeout(700); await p.screenshot({path:`${OUT}/chat-open-desktop.png`});
await p.getByRole("button",{name:"Tell me about SautiCivic"}).click().catch(()=>{});
await p.waitForTimeout(5000); await p.screenshot({path:`${OUT}/chat-answer-desktop.png`}); console.log("saved chat");
const m=await browser.newContext({...(({defaultBrowserType:_,...r})=>r)(devices["iPhone 13"]),colorScheme:"dark"});
p=await m.newPage(); p.on("pageerror",e=>errs.push(e.message));
await p.goto(BASE+"/",{waitUntil:"networkidle"}); await p.waitForTimeout(7000);
console.log("mobile scrollWidth", await p.evaluate(()=>document.documentElement.scrollWidth));
await p.screenshot({path:`${OUT}/home-mobile-viewport.png`});
await warm(p); await p.screenshot({path:`${OUT}/home-mobile.png`,fullPage:true}); console.log("saved mobile");
console.log("pageerrors:",errs.length?errs:"none");
await browser.close();
