/**
 * Open Graph images — run with `npm run og` (after `npm run media`).
 * Renders a 1200×630 card per locale (name, headshot, role, headline, three project stills) in a real browser so typography matches the site.
 * Uses an installed Chrome (or set CHROME_PATH). Fonts load from Google Fonts at render time.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const root = process.cwd();
const COPY = {
  en: { role: "Senior Photo, Image & Video Editor · AI Visual Creator", a: "Images with impact.", b: "Motion with purpose.", foot: "10 years of experience · Retouching · Film · Motion · AI" },
  es: { role: "Edición sénior de foto, imagen y video · Creación visual con IA", a: "Imágenes con impacto.", b: "Movimiento con propósito.", foot: "10 años de experiencia · Retoque · Cine · Motion · IA" },
  "pt-BR": { role: "Edição sênior de foto, imagem e vídeo · Criação visual com IA", a: "Imagens com impacto.", b: "Movimento com propósito.", foot: "10 anos de experiência · Tratamento · Cinema · Motion · IA" },
};

const img = (slug) => "data:image/jpeg;base64," + fs.readFileSync(path.join(root, "public/media/work", slug, "still.jpg")).toString("base64");
const grain = "data:image/png;base64," + fs.readFileSync(path.join(root, "public/textures/grain.png")).toString("base64");
const avatar = "data:image/png;base64," + fs.readFileSync(path.join(root, "public/avatar/Diego.png")).toString("base64");
const mark = fs.readFileSync(path.join(root, "public/icon.svg"), "utf8");

const html = (c) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Manrope:wght@600;800&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#f6f2ea url(${grain});background-size:220px;font-family:Manrope,sans-serif;color:#1d1f22;position:relative}
.l{position:absolute;left:64px;top:60px;bottom:60px;width:560px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:16px;font-weight:800;letter-spacing:.14em;font-size:22px}
.brand svg{width:64px;height:64px;border-radius:50%;box-shadow:0 8px 24px -10px rgba(29,31,34,.3)}
.brand small{display:block;font-size:15px;letter-spacing:.2em;color:#5d5f63;font-weight:600;margin-top:4px}.brand span{line-height:1.1}.avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;border:4px solid #fbf9f4;box-shadow:0 8px 24px -10px rgba(29,31,34,.35)}.brand svg{display:none}
.role{margin-top:auto;font-size:19px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5f6f58;line-height:1.35}
h1{font-family:Fraunces,serif;font-weight:500;font-size:68px;line-height:1.0;letter-spacing:-.02em;margin-top:18px}
h1 em{display:block;color:#2b48d4}
.foot{margin-top:26px;font-size:18px;font-weight:600;color:#5d5f63}
.f{position:absolute;overflow:hidden;box-shadow:0 30px 60px -28px rgba(29,31,34,.45)}
.f img{width:100%;height:100%;object-fit:cover;display:block}
.a{right:56px;top:56px;width:470px;height:330px;border-radius:30px}
.b{right:330px;bottom:-30px;width:190px;height:270px;border-radius:999px 999px 24px 24px;border:7px solid #f6f2ea}
.c{right:80px;bottom:40px;width:170px;height:170px;border-radius:50%;border:7px solid #f6f2ea}
.o{position:absolute;right:40px;top:40px;width:470px;height:330px;border:2px solid rgba(43,72,212,.25);border-radius:34px}
</style></head><body>
<div class="o"></div>
<div class="f a"><img src="${img("fieldnote")}" style="object-position:45% 50%"></div>
<div class="f b"><img src="${img("morrow")}" style="object-position:31% 30%"></div>
<div class="f c"><img src="${img("kanso")}" style="object-position:72% 60%"></div>
<div class="l">
  <div class="brand"><img class="avatar" src="${avatar}" alt="">${mark}<span>DIEGO FERREIRA<small>DOS SANTOS</small></span></div>
  <p class="role">${c.role}</p>
  <h1>${c.a}<em>${c.b}</em></h1>
  <p class="foot">${c.foot}</p>
</div></body></html>`;

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
fs.mkdirSync(path.join(root, "public/og"), { recursive: true });
for (const [locale, c] of Object.entries(COPY)) {
  await page.setContent(html(c), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, "public/og", `og-${locale}.png`) });
  console.log(`✓ og-${locale}.png`);
}
await browser.close();
