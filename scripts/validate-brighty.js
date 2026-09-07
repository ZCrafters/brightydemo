import fs from "node:fs";
const p = JSON.parse(fs.readFileSync(new URL("../data/products.brighty.json", import.meta.url), "utf-8"));
const slugs = new Set();
const ids = new Set();
for (const it of p) {
  if (!it.slug || slugs.has(it.slug)) throw new Error("slug duplikat: " + it.slug);
  slugs.add(it.slug);
  if (ids.has(it.id)) throw new Error("id duplikat: " + it.id);
  ids.add(it.id);
  if (!(it.price > 0)) throw new Error("harga invalid: " + it.slug);
  if (!/^https:\/\//.test(it.images?.[0] || "")) throw new Error("image invalid: " + it.slug);
  if (!it.categoryLabel) throw new Error("categoryLabel kosong: " + it.slug);
}
const heroes = p.filter((x) => x.heroFlag);
if (heroes.some((x) => x.id < 1 || x.id > 8)) throw new Error("id hero harus 1-8");
console.log(`OK ${p.length} produk (${heroes.length} hero), ${new Set(p.map((x) => x.category)).size} kategori.`);
