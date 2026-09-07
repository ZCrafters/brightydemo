// Import: brighty/brighty.official/_raw_a.json + _raw_b.json (katalog resmi Brighty,
// dikurasi dari PDP official store Tokopedia/Lazada/Shopee/TikTok) -> data/products.brighty.json
// Skema kompatibel engine demo (ids 1-8 = hero/best-seller).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "brighty", "brighty.official");
const OUT_FILE = path.join(__dirname, "..", "data", "products.brighty.json");

const CAT_MAP = {
  "body-serum": "body-serum",
  "body-wash": "body-wash",
  soap: "body-wash",
  scrub: "scrub-mask",
  "body-scrub": "scrub-mask",
  "body-mask": "scrub-mask",
  underarm: "underarm-care",
  deodorant: "underarm-care",
  toner: "toner",
  removal: "hair-removal",
  wax: "hair-removal",
  bundle: "bundle",
};
const CAT_LABEL = {
  "body-serum": "Body Serum",
  "body-wash": "Body Wash & Sabun",
  "scrub-mask": "Scrub & Mask",
  "underarm-care": "Underarm Care",
  "toner": "Toner & AHA",
  "hair-removal": "Hair Removal",
  "bundle": "Bundle & Paket",
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Tahap 1: bersihkan sampah listing (bracket promo, kata brand, tanda kurung).
const strip = (raw) => {
  let n = (raw || "").replace(/^\s*\[\s*[^\]]+\]\s*/gi, "");
  n = n.replace(/^promo\s*/i, "");
  n = n.replace(/\b(brighty)\b/gi, "");
  n = n.replace(/[()]/g, " ");
  n = n.replace(/\s+/g, " ").trim();
  return n;
};

// Tahap 2: nama tampilan singkat untuk SKU tertentu (kunci = hasil strip, nilai = nama tampilan).
const RENAME = {
  "Glowing Underarm Gel Perawatan Ketiak & Selangkangan": "Gel Glowing Underarm",
  "Glowing Underarm Scrub Microscrub": "Underarm Scrub Microscrub",
  "AHA Hero Exfoliating Liquid Back Acne / Chicken Skin": "AHA Hero Exfoliating Liquid",
  "Bright My Day BMD Pomegranate Body Scrub": "BMD Pomegranate Body Scrub",
  "Bright My Day BMD Kojic Body Serum": "BMD Kojic Body Serum",
  "Bright My Day BMD Niacinamide Body Wash 300ml": "BMD Niacinamide Body Wash 300ml",
  "Bright My Day BMD Niacinamide Body Wash 60ml": "BMD Niacinamide Body Wash 60ml",
  "BMD Series Brightening Kit Bundling Besar": "BMD Brightening Kit (Besar)",
  "BMD Series Brightening Kit Bundling Kecil": "BMD Brightening Kit (Kecil)",
  "Good Body Odor For Sensitive Skin Anti Perspirant": "Good Body Odor Anti Perspirant Sensitive",
};

// Hero/best-seller (id 1-8) & peluncuran baru, dinilai dari NAMA TAMPILAN final.
const HERO = new Set([
  "Gel Glowing Underarm",
  "Underarm Scrub Microscrub",
  "Multipurpose Exfoliating Toner",
  "Glow It Up Body Serum 180ml",
  "BMD Kojic Body Serum",
  "Whipped Mousse Body Serum",
  "Glow & Bright Bar Soap",
  "BMD Niacinamide Body Wash 300ml",
]);
const NEW = new Set([
  "Glow It Up Body Serum Tone Up 01 Vanilla 100ml",
  "Glow It Up Body Serum Tone Up 02 Almond 100ml",
  "Hair Removal Waxing Strip Kit",
]);

const normKey = (cleaned) => slugify(cleaned.toLowerCase());

// gabung raw A+B, dedup per nama-strip+ukuran; prefer entry ber-BPOM
const best = new Map();
for (const f of ["_raw_a.json", "_raw_b.json"]) {
  const arr = JSON.parse(fs.readFileSync(path.join(SRC, f), "utf-8"));
  for (const r of arr) {
    const key = normKey(`${strip(r.name)} ${r.size}`);
    const prev = best.get(key);
    if (!prev || (!prev.bpom && r.bpom)) best.set(key, { ...r, _cleaned: strip(r.name) });
  }
}

const out = [];
const used = new Set();
let heroSeq = 0;
for (const r of best.values()) {
  const name = RENAME[r._cleaned] || r._cleaned;
  let slug = slugify(name);
  let n = 2;
  while (used.has(slug)) slug = `${slugify(name)}-${n++}`;
  used.add(slug);

  const cat = CAT_MAP[r.category] || "body-serum";
  const id = HERO.has(name) ? ++heroSeq : 1000 + out.length + 1;
  out.push({
    id,
    slug,
    name,
    category: cat,
    categoryLabel: CAT_LABEL[cat],
    pack: (r.size || "").trim(),
    sizes: [],
    colors: [],
    price: r.price || 0,
    originalPrice: r.originalPrice > r.price ? r.originalPrice : null,
    bpom: r.bpom || "",
    claim: (r.hero || "").slice(0, 300),
    images: r.image ? [r.image] : [],
    source: "brighty-official",
    provisional: true,
    heroFlag: HERO.has(name),
    newTag: NEW.has(name),
  });
}

const final = out.filter((p) => p.price > 0 && p.images.length > 0);
const skipped = out.filter((p) => !p.price || p.images.length === 0);
if (skipped.length) console.warn("SKU tanpa harga/gambar (dilewati):", skipped.map((p) => p.name).join(", "));

fs.writeFileSync(OUT_FILE, JSON.stringify(final, null, 2) + "\n", "utf-8");
console.log(
  `wrote ${final.length} products (hero ${final.filter((p) => p.heroFlag).length}, new ${final.filter((p) => p.newTag).length}).`
);
console.log("kategori:", [...new Set(final.map((p) => p.categoryLabel))].join(", "));
