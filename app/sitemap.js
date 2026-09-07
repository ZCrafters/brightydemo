import { products } from "../lib/products";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();
  const staticUrls = ["", "/catalog", "/about", "/faq", "/wishlist"]
    .map((p) => ({ url: `${SITE}${p}`, lastModified: now, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
  const catUrls = [...new Set(products.map((p) => p.category))]
    .map((c) => ({ url: `${SITE}/kategori/${c}`, lastModified: now, changeFrequency: "daily", priority: 0.8 }));
  const pdpUrls = products.map((p) => ({ url: `${SITE}/produk/${p.slug}`, lastModified: now, changeFrequency: "daily", priority: 0.6 }));
  return [...staticUrls, ...catUrls, ...pdpUrls];
}
