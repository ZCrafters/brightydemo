// Parse HTML hasil unduhan halaman produk Tokopedia brightyindonesia (p1..p7.html
// di $env:TEMP\opencode\tokped) menjadi brighty/marketplace-tokopedia.json.
// Data: nama, harga promo, harga coret, badge diskon, rating, terjual, URL.
// Tanpa gambar (sesuai permintaan user).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(os.tmpdir(), "opencode", "tokped");
const OUT = path.join(__dirname, "..", "brighty", "marketplace-tokopedia.json");

const EXPECTED = [10, 10, 10, 10, 10, 10, 4];

function parseCard(chunk) {
  const card = chunk.split("</a>")[0];
  const urlM = card.match(/<a\b[^>]*?\bhref="([^"]+)"/);
  const nameM = card.match(/<span class="\+tnoqZhn89[^"]*">([^<]+)<\/span>/);
  // Harga promo flash-sale muncul 2x (alt gambar + teks) → ambil nilai unik berurutan.
  const seen = new Set();
  const amounts = [...card.matchAll(/Rp([\d.]+)/g)]
    .map((m) => parseInt(m[1].replace(/\./g, ""), 10))
    .filter((v) => (seen.has(v) ? false : (seen.add(v), true)));
  const discM = card.match(/<span[^>]*background:#F94D63[^>]*>([^<]+)<\/span>/);
  const soldM = card.match(/(\d+(?:rb\+|\+)?)\s*terjual/);
  let rating = null;
  const rIx = card.indexOf('alt="rating"');
  if (rIx >= 0) {
    const rM = card.slice(rIx, rIx + 500).match(/(\d\.\d)/);
    if (rM) rating = parseFloat(rM[1]);
  }
  if (!urlM || !nameM || !amounts.length) return null;
  const rawUrl = urlM[1].split("?")[0];
  const url = rawUrl.startsWith("http") ? rawUrl : "https://www.tokopedia.com" + rawUrl;
  return {
    name: nameM[1].trim(),
    price: amounts[0],
    originalPrice: amounts[1] || null,
    discountBadge: discM ? discM[1].trim() : null,
    rating,
    sold: soldM ? soldM[1] + " terjual" : null,
    url,
  };
}

const all = [];
const errors = [];
for (let p = 1; p <= 7; p++) {
  const file = path.join(SRC_DIR, `p${p}.html`);
  const html = fs.readFileSync(file, "utf-8");
  const chunks = html.split('<div class="css-79elbk">').slice(1);
  const items = [];
  chunks.forEach((c, i) => {
    if (!c.includes("+tnoqZhn89")) return; // blok <style>/tab navigasi, bukan kartu produk
    const it = parseCard(c);
    if (it) items.push({ no: all.length + items.length + 1, page: p, ...it });
    else errors.push(`p${p} card#${i + 1}: gagal parse`);
  });
  console.log(`p${p}: ${items.length} produk (ekspektasi ${EXPECTED[p - 1]})`);
  if (items.length !== EXPECTED[p - 1]) errors.push(`p${p}: jumlah ${items.length} != ${EXPECTED[p - 1]}`);
  all.push(...items);
}

if (errors.length) {
  console.error("ERROR VALIDASI:");
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}

fs.writeFileSync(OUT, JSON.stringify(all, null, 2));
console.log(`OK: ${all.length} produk -> ${OUT}`);
