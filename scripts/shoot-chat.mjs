import { chromium } from "playwright";
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage();
await p.goto("http://localhost:3210/",{waitUntil:"networkidle"}); await p.waitForTimeout(1500);
await p.getByRole("button",{name:"Ask about Timi",exact:true}).click(); await p.locator("textarea").first().fill("What has Timi built with LLMs?");
await p.getByRole("button",{name:"Send"}).click(); await p.waitForTimeout(16000);
console.log((await p.locator('[role="dialog"]').innerText()).replace(/\n+/g," | ").slice(0,1800));
await p.screenshot({path:"/workspace/portfolio/screens/final/chat-answer.png"}); await p.screenshot({path:"/workspace/portfolio/screens/chat-live.png"}); await b.close();
