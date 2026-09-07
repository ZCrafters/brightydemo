// Data + helper terpusat. Enrichment deterministik (stabil antar-build).
import raw from "../data/products.brighty.json";

export const rupiah = (v) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v || 0);

const hash = (n, m) => Math.abs((n * 137 + 11) % m);

export const CATEGORY_LABELS = {
  "body-serum": "Body Serum",
  "body-wash": "Body Wash & Sabun",
  "scrub-mask": "Scrub & Mask",
  "underarm-care": "Underarm Care",
  "toner": "Toner & AHA",
  "hair-removal": "Hair Removal",
  "bundle": "Bundle & Paket",
};
export const categoryLabel = (slug) => CATEGORY_LABELS[slug] || slug;

export const products = raw.map((p) => {
  const rating = 46 + hash(p.id, 5); // 4.6 - 5.0 (x10)
  const sold = 120 + hash(p.id * 3, 8800);
  const isNew = Boolean(p.newTag);
  // Status stok demo deterministik ala Sociolla (stabil antar-build):
  // ~10% habis, ~20% tersisa sedikit (urgency), sisanya tersedia.
  const stockR = hash(p.id * 13, 10);
  const stock =
    stockR === 0
      ? { type: "out" }
      : stockR < 3
        ? { type: "low", qty: 4 + hash(p.id * 17, 42) }
        : { type: "available" };
  const discountPct = p.originalPrice && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;
  return {
    ...p,
    gender: p.categoryLabel || categoryLabel(p.category),
    sizeRange: p.pack || "",
    rating: rating / 10,
    reviews: 38 + hash(p.id * 7, 860),
    sold,
    soldLabel: sold.toLocaleString("id-ID"),
    isNew,
    stock,
    discountPct,
    badge: p.heroFlag ? "Best Seller" : isNew ? "New" : p.originalPrice ? "Promo" : null,
    // Harga promo dari data real official store; catatan periode generik (s&k berlaku).
    originalPrice: p.originalPrice || null,
    promoNote: p.originalPrice ? "Promo official store" : null,
    promoUntil: p.originalPrice ? "s&k berlaku" : null,
  };
});

export const promoProducts = products.filter((p) => p.originalPrice);

export const getProduct = (slug) => products.find((p) => p.slug === slug);

export const getRelated = (p, n = 8) =>
  products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, n);

export const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 10);
export const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

export const allCategories = [...new Set(products.map((p) => p.category))].sort();
export const allColors = [];
export const allSizes = [];

export const maxPrice = Math.max(...products.map((p) => p.price));
export const minPrice = Math.min(...products.map((p) => p.price));

// Mega menu: rutinitas & kategori body care Brighty.
export const MEGA_MENU = [
  { title: "Body Glow Routine", desc: "Cerah dari luar ke dalam", links: [{ label: "Body Serum", cat: "body-serum" }, { label: "Body Wash & Sabun", cat: "body-wash" }, { label: "Scrub & Mask", cat: "scrub-mask" }] },
  { title: "Underarm Care", desc: "Ketiak cerah, halus & wangi", links: [{ label: "Underarm Care", cat: "underarm-care" }, { label: "Toner & AHA", cat: "toner" }, { label: "Hair Removal", cat: "hair-removal" }] },
  { title: "Paket Hemat", desc: "Rutinitas lengkap sekali belanja", links: [{ label: "Bundle & Paket", cat: "bundle" }] },
];
