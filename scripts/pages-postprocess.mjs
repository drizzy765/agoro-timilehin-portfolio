// GitHub Pages mirror only: prefix public-folder paths with the basePath (next/image unoptimized + plain
// string paths in content don't get basePath automatically) and add .nojekyll.
import fs from "node:fs"; import path from "node:path";
const bp = process.env.PAGES_BASE_PATH; if (!bp) process.exit(0);
const dirs = fs.readdirSync("public", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).join("|");
const re = new RegExp(`(["'(=]|https://drizzy765\\.github\\.io)/(${dirs})/`, "g");
let n = 0;
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) walk(p);
  else if (/\.(html|txt|js|css|json)$/.test(f)) { const s = fs.readFileSync(p, "utf8"); const t = s.replace(re, (_, a, b) => `${a}${bp}/${b}/`); if (t !== s) { fs.writeFileSync(p, t); n++; } } } })("out");
fs.writeFileSync("out/.nojekyll", ""); fs.rmSync("out/_headers", { force: true });
console.log(`pages-postprocess: rewrote ${n} files`);
