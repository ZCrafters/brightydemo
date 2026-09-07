# BRIGHTY Demo — Workflow & Cara Jalankan

## Pipeline data (urutan)
1. `node scripts/import-brighty.js`  → `data/products.brighty.json` dari raw official.
2. `node scripts/validate-brighty.js` → cek slug/id/harga/gambar/kategori.
3. `node scripts/make-brighty-audit.js` → `brighty/brighty-katalog-audit.xlsx`.

## Jalankan demo
- Dev: `npm run dev`  → http://localhost:3000
- Build static: `npm run build` → folder `out/`
- Preview hasil static: `npm run preview` (http-server di `out/`)
- Lint: `npm run lint`

## Struktur
- `lib/products.js` — helper + enrichment (rating/review/sold deterministik dari id).
- `app/` — home, catalog (client-side filter/sort), kategori/[slug], produk/[slug], faq, about, wishlist, checkout.
- `components/` — Header (mega menu), PDP (Gallery lightbox, BuyBox, Review, Share, Related),
  cart drawer, wishlist, plp filter/sort.
- `brighty/brighty.official/` — raw data resmi (kurasi) + audit xlsx.

## Verifikasi akhir
- `npm run validate` → `OK 25 produk (8 hero), 7 kategori.`
- `npm run lint` → 0 error
- `npm run build` → exit 0 (static export)
- Smoke test seluruh route dari `out/` = 200
- Pastikan folder tidak punya `.git` / `.github`

## Catatan legal
Demo edukasi, tidak berafiliasi dengan Brighty. Gunakan untuk belajar/portofolio;
harga & foto produk adalah milik official store masing-masing.
