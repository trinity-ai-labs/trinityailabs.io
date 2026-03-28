/**
 * Export blog graphics from HTML to PNG using Puppeteer.
 * Usage: node scripts/export-blog-graphics.mjs
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require("/Users/dev-wynberg/.nvm/versions/node/v24.13.1/lib/node_modules/puppeteer");
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.join(__dirname, "blog-graphics.html");
const PUBLIC = path.join(__dirname, "..", "public", "blog");

const graphics = [
  { id: "cover",        file: "covers/ralph-wiggum-loop-evolved.png", width: 1200, height: 630 },
  { id: "prd-releases", file: "inline/ralph-wiggum-prd-releases.png", width: 1200, height: 500 },
  { id: "pipeline",     file: "inline/ralph-wiggum-pipeline.png",     width: 1200, height: 480 },
  { id: "gates",        file: "inline/ralph-wiggum-gates.png",        width: 1200, height: 480 },
  { id: "parallel",     file: "inline/ralph-wiggum-parallel.png",     width: 1200, height: 460 },
  { id: "knowledge",    file: "inline/ralph-wiggum-knowledge.png",    width: 1200, height: 460 },
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 4000, deviceScaleFactor: 2 });

  await page.goto(`file://${HTML_PATH}`, { waitUntil: "networkidle0" });

  for (const g of graphics) {
    const el = await page.$(`#${g.id}`);
    if (!el) {
      console.error(`Element #${g.id} not found, skipping`);
      continue;
    }

    const box = await el.boundingBox();
    const outPath = path.join(PUBLIC, g.file);

    // Use page.screenshot with clip to capture overflow content
    await page.screenshot({
      path: outPath,
      type: "png",
      clip: {
        x: box.x,
        y: box.y,
        width: g.width,
        height: g.height,
      },
    });
    console.log(`✓ ${g.file} (${g.width}×${g.height})`);
  }

  await browser.close();
  console.log(`\nDone — ${graphics.length} images exported to public/blog/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
