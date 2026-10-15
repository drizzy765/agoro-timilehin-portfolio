import { chromium } from "playwright";
const b = await chromium.launch();
async function shot(path, mock) {
  const ctx = await b.newContext({ viewport:{width:1280,height:800} });
  const p = await ctx.newPage();
  if (mock) await p.route("https://api.lanyard.rest/**", r => { const n=Date.now(); r.fulfill({ contentType:"application/json", headers:{"access-control-allow-origin":"*"}, body: JSON.stringify({ success:true, data:{ discord_status:"online", listening_to_spotify:true, spotify:{ song:"Passionfruit", artist:"Drake", album:"More Life", album_art_url:"http://localhost:3210/img/timi-square.jpg", track_id:"5mCPDVBb16L4XQwDdbRUpz", timestamps:{ start:n-90000, end:n+208000 } } } }) }); });
  await p.goto("http://localhost:3210/about", { waitUntil:"networkidle" });
  const h = p.getByText("Soundtrack").first(); await h.scrollIntoViewIfNeeded();
  await p.evaluate(()=>window.scrollBy(0,-120));
  await p.waitForTimeout(5000);
  console.log(path, "card visible:", await p.getByText("Now playing").count());
  await p.screenshot({ path });
  await ctx.close();
}
await shot("/workspace/portfolio/screens/about-lanyard.png", false);
await shot("/workspace/portfolio/screens/about-lanyard-mock-playing.png", true);
await b.close();
