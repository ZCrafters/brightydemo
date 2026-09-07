// Bangun brighty/brighty-katalog-audit.xlsx (Excel audit katalog demo Brighty).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROD = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "products.brighty.json"), "utf-8"));
const SRC_DIR = path.join(__dirname, "..", "brighty", "brighty.official");
const OUT = path.join(__dirname, "..", "brighty", "brighty-katalog-audit.xlsx");

const rupiah = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v || 0);

// kunci lookup raw (nama-strip + ukuran) -> source/channel/hero penuh
const rawByKey = new Map();
for (const f of ["_raw_a.json", "_raw_b.json"]) {
  const arr = JSON.parse(fs.readFileSync(path.join(SRC_DIR, f), "utf-8"));
  for (const r of arr) {
    const cleaned = (r.name || "")
      .replace(/^\s*\[\s*[^\]]+\]\s*/gi, "")
      .replace(/^promo\s*/i, "")
      .replace(/\b(brighty)\b/gi, "")
      .replace(/[()]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    const key = cleaned.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + (r.size || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    rawByKey.set(key, r);
  }
}

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet("Katalog", { views: [{ state: "frozen", ySplit: 1 }] });

const disc = (p) => (p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0);

ws.columns = [
  { header: "No", key: "no", width: 5 },
  { header: "Slug", key: "slug", width: 42 },
  { header: "Nama Produk", key: "name", width: 40 },
  { header: "Kategori", key: "cat", width: 18 },
  { header: "Kemasan", key: "pack", width: 12 },
  { header: "Harga (Rp)", key: "price", width: 14 },
  { header: "Harga Coret (Rp)", key: "orig", width: 16 },
  { header: "Diskon", key: "disc", width: 8 },
  { header: "BPOM", key: "bpom", width: 16 },
  { header: "Channel", key: "chan", width: 10 },
  { header: "Best Seller", key: "hero", width: 11 },
  { header: "New", key: "new", width: 8 },
  { header: "Source URL (Official)", key: "url", width: 70 },
  { header: "Klaim Utama / Hero Ingredients", key: "claim", width: 90 },
  { header: "Gambar", key: "img", width: 80 },
];

for (const p of PROD) {
  const raw = rawByKey.get(
    p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + (p.pack || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  );
  ws.addRow({
    no: p.id,
    slug: p.slug,
    name: p.name,
    cat: p.categoryLabel,
    pack: p.pack,
    price: rupiah(p.price),
    orig: p.originalPrice ? rupiah(p.originalPrice) : "-",
    disc: disc(p) ? disc(p) + "%" : "-",
    bpom: p.bpom || "-",
    chan: raw?.channel || "",
    hero: p.heroFlag ? "✓" : "",
    new: p.newTag ? "✓" : "",
    url: raw?.sourceUrl || "",
    claim: p.claim,
    img: p.images[0] || "",
  });
}

// gaya
ws.getRow(1).eachCell((c) => {
  c.font = { bold: true, color: { argb: "FFFFFFFF" } };
  c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF7A4D8F" } };
  c.alignment = { vertical: "middle" };
});
ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: PROD.length + 1, column: 15 } };

// sheet ringkasan
const wsum = wb.addWorksheet("Ringkasan");
const catRows = {};
for (const p of PROD) catRows[p.categoryLabel] = (catRows[p.categoryLabel] || 0) + 1;
const heroCount = PROD.filter((p) => p.heroFlag).length;
const newCount = PROD.filter((p) => p.newTag).length;
const minPrice = Math.min(...PROD.map((p) => p.price));
const maxPrice = Math.max(...PROD.map((p) => p.price));
wsum.columns = [{ header: "Ringkasan", key: "k", width: 34 }, { header: "Nilai", key: "v", width: 22 }];
wsum.getRow(1).font = { bold: true };
wsum.addRows([
  { k: "Merek / Demo", v: "Brighty — body care & brightening (demo, tidak berafiliasi)" },
  { k: "Total SKU (produk unik)", v: PROD.length },
  { k: "Best Seller (hero)", v: heroCount },
  { k: "Peluncuran baru", v: newCount },
  { k: "Rentang harga (Rp)", v: `${rupiah(minPrice)} - ${rupiah(maxPrice)}` },
  { k: "Sumber data", v: "PDP official store (Tokopedia brightyindonesia, TikTok @brighty.id, dll.)" },
  { k: "Tanggal audit", v: new Date().toISOString().slice(0, 10) },
  { k: "", v: "" },
  { k: "Produk per kategori", v: "" },
  ...Object.entries(catRows).map(([k, v]) => ({ k: "  " + k, v })),
  { k: "", v: "" },
  { k: "Catatan", v: "Harga adalah harga promo/listing resmi saat pengambilan data; SKU bertipe bundle tetap produk jual resmi. Disclaimer: demo edukasi." },
]);
for (const row of wsum.getRows(1, wsum.rowCount)) {
  row.eachCell((c, col) => { c.alignment = { vertical: "top", wrapText: col === 1 }; });
  if (row.number > 1) row.getCell(1).font = { bold: row.getCell(1).value?.toString().startsWith("  ") ? false : true };
}

await wb.xlsx.writeFile(OUT);
console.log("Excel ditulis:", OUT, `(${PROD.length} baris)`);
