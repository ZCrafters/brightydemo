// Bangun brighty/brighty-marketplace-data.xlsx — data produk official store
// marketplace (fokus Tokopedia brightyindonesia, 64 listing, diambil 2026-09-07)
// + pemetaan 25 SKU katalog demo vs harga Tokopedia. Tanpa gambar (data saja).
// Sumber: brighty/marketplace-tokopedia.json (via scripts/parse-tokopedia.js)
//         + data/products.brighty.json
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MP = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "brighty", "marketplace-tokopedia.json"), "utf-8"));
const PROD = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "products.brighty.json"), "utf-8"));
const OUT = path.join(__dirname, "..", "brighty", "brighty-marketplace-data.xlsx");
const FETCH_DATE = "2026-09-07";

// Tebakan kategori (7 kategori demo) dari nama listing Tokopedia.
function guessCategory(name) {
  const n = name.toLowerCase();
  if (/(bundle|paket|\sx\s|\+|\d+\s*pcs)/.test(n)) return "bundle";
  if (/(underarm|ketiak|deodorant|odor|charcoal)/.test(n)) return "underarm-care";
  if (/(scrub|masque|mask|slime)/.test(n)) return "scrub-mask";
  if (/(serum|lotion)/.test(n)) return "body-serum";
  if (/(soap|wash|barsoap)/.test(n)) return "body-wash";
  if (/(toner|peeling|aha|exfoliating)/.test(n)) return "toner";
  if (/(wax|removal|shaving)/.test(n)) return "hair-removal";
  return "lainnya";
}
const CAT_LABEL = {
  "body-serum": "Body Serum", "body-wash": "Body Wash & Sabun", "scrub-mask": "Scrub & Mask",
  "underarm-care": "Underarm Care", "toner": "Toner & AHA", "hair-removal": "Hair Removal",
  "bundle": "Bundle & Paket", "lainnya": "Lainnya",
};

// Pemetaan kurasi: slug katalog web -> no listing Tokopedia + catatan.
const MAP = {
  "gel-glowing-underarm": { tok: 63, note: "Harga web 12% di bawah listing satuan terdekat" },
  "underarm-scrub-microscrub": { tok: 62, note: "Harga persis sama" },
  "charcoal-underarm-masque": { tok: 38, note: "Selisih Rp500 (web sedikit di atas)" },
  "aha-hero-exfoliating-liquid": { tok: 58, note: "Harga persis sama (varian Exclusive Live)" },
  "multipurpose-exfoliating-toner": { tok: 60, note: "Harga persis sama" },
  "swipe-removal-cream": { tok: 36, note: "Selisih Rp1.700 (3%)" },
  "post-shaving-waxing-gel": { tok: 32, note: "Satuan tidak ada; hanya dalam bundle Swipe Cream X Post Shaving Gel" },
  "hair-removal-waxing-strip-kit": { tok: 31, note: "Satuan tidak ada; hanya dalam bundle Waxing Kit X Scrub (Live ATR)" },
  "good-body-odor-deodorant": { tok: 59, note: "Satuan tidak ada; hanya dalam bundle AHA Hero X Good Body Odor" },
  "good-body-odor-anti-perspirant-sensitive": { tok: 29, note: "Hanya tercantum dalam paket raksasa 5pcs" },
  "bmd-pomegranate-body-scrub": { tok: 13, note: "Satuan tidak ada; hanya dalam bundle Bar Soap X Scrub" },
  "glow-it-up-body-serum-180ml": { tok: 6, note: "Satuan 180ml tidak ada; hanya dalam bundle Bar Soap 4pcs X Glow It Up 180ml" },
  "glow-it-up-body-serum-tone-up-01-vanilla-100ml": { tok: 8, note: "Varian Vanilla satuan tidak ada; padanan terdekat bundle varian Almond (live)" },
  "glow-it-up-body-serum-tone-up-02-almond-100ml": { tok: 8, note: "Satuan tidak ada; hanya dalam bundle Bar Soap X Glow It Up Almond (live)" },
  "whipped-mousse-body-serum": { tok: 54, note: "Selisih Rp50 — praktis sama" },
  "bmd-kojic-body-serum": { tok: 29, note: "Satuan tidak ada; hanya tercantum dalam paket raksasa 5pcs" },
  "glowing-moisturizing-body-serum": { tok: 48, note: "Harga web (98.000) sama dengan harga CORET Tokopedia; harga promo berjalan 81.700 — pertimbangkan samakan harga web ke 81.700" },
  "advanced-glowing-body-slime-mask": { tok: 27, note: "Satuan tidak ada; hanya dalam bundle Toner X Slime Mask" },
  "bmd-niacinamide-body-wash-300ml": { tok: 29, note: "Hanya tercantum dalam paket raksasa 5pcs (BMD Wash 60/300ml)" },
  "bmd-niacinamide-body-wash-60ml": { tok: 16, note: "Satuan tidak ada; hanya dalam bundle Toner X BMD Wash 60ml X Bar Soap" },
  "whipped-mousse-body-wash": { tok: 55, note: "GAP TERBESAR: harga web (32.582) jauh di bawah listing (50.400) — verifikasi sumber harga web sebelum dipakai" },
  "glow-bright-bar-soap": { tok: 25, note: "Selisih Rp500 (web sedikit di atas)" },
  "bmd-brightening-kit-besar": { tok: 29, note: "Komposisi TIDAK sama (kit = wash 300ml + kojic serum + scrub vs paket raksasa 5pcs) — hanya pembanding harga bundle, jangan samakan harga" },
  "bmd-brightening-kit-kecil": { tok: 16, note: "Komposisi TIDAK sama (kit = wash 60ml + kojic serum + scrub vs bundle Toner X Wash 60ml X Bar Soap) — hanya pembanding, jangan samakan harga" },
  "whipped-mousse-body-wash-body-serum-bundle": { tok: 56, note: "Harga persis sama" },
};

const tokByNo = new Map(MP.map((m) => [m.no, m]));
const rupiahFmt = '"Rp"#,##0';

const wb = new ExcelJS.Workbook();

// ---------- Sheet 1: Tokopedia ----------
const ws = wb.addWorksheet("Tokopedia", { views: [{ state: "frozen", ySplit: 1 }] });
ws.columns = [
  { header: "No", key: "no", width: 5 },
  { header: "Nama Produk (Listing)", key: "name", width: 70 },
  { header: "Harga Promo (Rp)", key: "price", width: 16 },
  { header: "Harga Coret (Rp)", key: "orig", width: 16 },
  { header: "Badge Diskon", key: "disc", width: 12 },
  { header: "Rating", key: "rating", width: 8 },
  { header: "Terjual", key: "sold", width: 14 },
  { header: "Tipe", key: "tipe", width: 20 },
  { header: "Kategori (tebakan)", key: "cat", width: 18 },
  { header: "URL Listing", key: "url", width: 70 },
];
for (const m of MP) {
  const cat = guessCategory(m.name);
  ws.addRow({
    no: m.no, name: m.name, price: m.price, orig: m.originalPrice,
    disc: m.discountBadge || "-", rating: m.rating, sold: m.sold || "-",
    tipe: cat === "bundle" ? "Bundling / Isi banyak" : "Satuan",
    cat: CAT_LABEL[cat], url: m.url,
  });
}
for (const r of [3]) ws.getColumn(r).numFmt = rupiahFmt;
ws.getColumn(4).numFmt = rupiahFmt;
ws.getRow(1).eachCell((c) => {
  c.font = { bold: true, color: { argb: "FFFFFFFF" } };
  c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F766E" } };
  c.alignment = { vertical: "middle", wrapText: true };
});
ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: MP.length + 1, column: 10 } };

// ---------- Sheet 2: Pemetaan Katalog ----------
const wm = wb.addWorksheet("Pemetaan Katalog", { views: [{ state: "frozen", ySplit: 1 }] });
wm.columns = [
  { header: "No", key: "no", width: 5 },
  { header: "Slug (Web)", key: "slug", width: 42 },
  { header: "Nama (Web)", key: "wname", width: 36 },
  { header: "Harga Web (Rp)", key: "wprice", width: 15 },
  { header: "No. Tokopedia", key: "tno", width: 13 },
  { header: "Padanan Tokopedia", key: "tname", width: 60 },
  { header: "Harga Tokopedia (Rp)", key: "tprice", width: 18 },
  { header: "Selisih Rp (Web−Tokped)", key: "diff", width: 18 },
  { header: "Selisih %", key: "diffp", width: 10 },
  { header: "Status", key: "status", width: 16 },
  { header: "Catatan", key: "note", width: 60 },
  { header: "URL Tokopedia", key: "url", width: 60 },
];
PROD.forEach((p, i) => {
  const m = MAP[p.slug];
  const t = m ? tokByNo.get(m.tok) : null;
  let status = "Belum dipetakan", diff = null, diffp = null;
  if (t) {
    diff = p.price - t.price;
    diffp = t.price ? diff / t.price : null;
    status = Math.abs(diffp) <= 0.02 ? "Sesuai ✓" : Math.abs(diffp) <= 0.1 ? "Selisih kecil" : "Perlu perhatian";
  }
  wm.addRow({
    no: i + 1, slug: p.slug, wname: `${p.name}${p.pack ? ` (${p.pack})` : ""}`, wprice: p.price,
    tno: t ? t.no : "-", tname: t ? t.name : "-", tprice: t ? t.price : null,
    diff, diffp, status, note: m ? m.note : "-", url: t ? t.url : "-",
  });
});
for (const c of [4, 7, 8]) wm.getColumn(c).numFmt = rupiahFmt;
wm.getColumn(9).numFmt = "0.0%";
wm.getRow(1).eachCell((c) => {
  c.font = { bold: true, color: { argb: "FFFFFFFF" } };
  c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF7A4D8F" } };
  c.alignment = { vertical: "middle", wrapText: true };
});
wm.autoFilter = { from: { row: 1, column: 1 }, to: { row: PROD.length + 1, column: 12 } };

// ---------- Sheet 3: Ringkasan ----------
const prices = MP.map((m) => m.price);
const wr = wb.addWorksheet("Ringkasan");
wr.columns = [{ header: "Ringkasan", key: "k", width: 34 }, { header: "Nilai", key: "v", width: 80 }];
wr.getRow(1).font = { bold: true };
const rated = MP.filter((m) => m.rating !== null);
wr.addRows([
  { k: "Tanggal pengambilan", v: FETCH_DATE },
  { k: "Toko Tokopedia", v: "brighty.id (brightyindonesia), Kota Bekasi — rating 4.8 (274,6 rb ulasan) • 3 jt terjual" },
  { k: "Jumlah listing Tokopedia", v: `${MP.length} (halaman 1–7, terakhir 4 item)` },
  { k: "Rentang harga Tokopedia", v: `Rp${Math.min(...prices).toLocaleString("id-ID")} – Rp${Math.max(...prices).toLocaleString("id-ID")}` },
  { k: "Rata-rata rating listing", v: rated.length ? (rated.reduce((n, m) => n + m.rating, 0) / rated.length).toFixed(2) + ` (dari ${rated.length} listing ber-rating)` : "-" },
  { k: "", v: "" },
  { k: "Shopee (brighty_id)", v: "Produk tidak dapat diambil — API 403 + halaman JS-shell (anti-bot). URL: https://shopee.co.id/brighty_id" },
  { k: "Lazada (official store)", v: "Produk tidak dapat diambil — halaman promo JS-rendered. URL: https://www.lazada.co.id/shop/brighty-official-store/" },
  { k: "Blibli (BRI-70014)", v: "Produk tidak dapat diambil — API 403 + halaman JS-rendered. Info toko: Brighty Indonesia, badge silver, rating 4,9 (858 ulasan), 702 pengikut, pesanan berhasil 100%" },
  { k: "", v: "" },
  { k: "Pemetaan katalog web", v: `${PROD.length} SKU dipetakan ke listing Tokopedia terdekat (lihat sheet Pemetaan Katalog)` },
  { k: "", v: "" },
  { k: "Catatan", v: "Harga marketplace berubah-ubah (flash sale/live). Kolom Harga Coret = harga sebelum diskon saat diambil. Tanpa gambar sesuai permintaan (data saja). Demo edukasi — bukan afiliasi resmi." },
]);
for (const row of wr.getRows(1, wr.rowCount)) {
  row.eachCell((c, col) => { c.alignment = { vertical: "top", wrapText: col === 1 }; });
}

await wb.xlsx.writeFile(OUT);
console.log("Excel ditulis:", OUT, `(${MP.length} listing Tokopedia, ${PROD.length} SKU peta)`);
