// Import: brighty-products.json (katalog resmi, scrape PDP Shopee brighty_id) ->
// data/products.brighty.json. Skema kompatibel engine demo (ids 1-8 = hero/best-seller).
// Beda dari import-brighty.js: sumbernya sudah berisi rating/soldCount/discountPercent asli,
// bukan hasil kurasi manual _raw_a/_raw_b.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_FILE = path.join(__dirname, "..", "brighty-products.json");
const OUT_FILE = path.join(__dirname, "..", "data", "products.brighty.json");

// Sama seperti CAT_MAP di import-brighty.js: sabun batang masuk kelompok "Body Wash & Sabun"
// supaya link mega menu yang sudah ada tetap terisi. "accessories" kategori baru (1 SKU).
const CAT_MAP = { soap: "body-wash" };
const CAT_LABEL = {
  "body-serum": "Body Serum",
  "body-wash": "Body Wash & Sabun",
  "scrub-mask": "Scrub & Mask",
  "underarm-care": "Underarm Care",
  "toner": "Toner & AHA",
  "hair-removal": "Hair Removal",
  "bundle": "Bundle & Paket",
  "accessories": "Aksesoris",
};

const packFromName = (name) => {
  const size = name.match(/\b(\d+\s?(?:ml|gr|g))\b/i);
  if (size) return size[1].replace(/\s+/, "");
  const pack = name.match(/\b(\d+)\s*pack\b/i);
  if (pack) return `${pack[1]} Pack`;
  return "";
};

const raw = JSON.parse(fs.readFileSync(SRC_FILE, "utf-8"));

const out = raw.map((r) => {
  const cat = CAT_MAP[r.category] || r.category;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: cat,
    categoryLabel: CAT_LABEL[cat] || cat,
    pack: packFromName(r.name),
    sizes: [],
    colors: [],
    price: r.price,
    originalPrice: r.originalPrice > r.price ? r.originalPrice : null,
    bpom: "",
    claim: (r.description || "").slice(0, 300),
    images: r.images || [],
    source: "brighty-official",
    provisional: false,
    heroFlag: r.id >= 1 && r.id <= 8,
    newTag: false,
    rating: r.rating,
    soldCount: r.soldCount,
    soldLabel: r.soldLabel,
    discountPercent: r.discountPercent || null,
  };
});

const final = out.filter((p) => p.price > 0 && p.images.length > 0);
const skipped = out.filter((p) => !p.price || p.images.length === 0);
if (skipped.length) console.warn("SKU tanpa harga/gambar (dilewati):", skipped.map((p) => p.name).join(", "));

fs.writeFileSync(OUT_FILE, JSON.stringify(final, null, 2) + "\n", "utf-8");
console.log(
  `wrote ${final.length} products (hero ${final.filter((p) => p.heroFlag).length}, new ${final.filter((p) => p.newTag).length}).`
);
console.log("kategori:", [...new Set(final.map((p) => p.categoryLabel))].join(", "));
