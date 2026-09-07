# BRIGHTY Demo — Workflow & Cara Jalankan

## Pipeline data (urutan)
1. `node scripts/import-brighty.js`  → `data/products.brighty.json` dari raw official.
2. `node scripts/validate-brighty.js` → cek slug/id/harga/gambar/kategori.
3. `node scripts/make-brighty-audit.js` → `brighty/brighty-katalog-audit.xlsx`.
4. Marketplace (opsional, data saja tanpa gambar):
   `node scripts/parse-tokopedia.js` → `brighty/marketplace-tokopedia.json`
   (butuh file HTML halaman 1–7 di `%TEMP%/opencode/tokped/p1..p7.html`),
   lalu `npm run audit:marketplace` → `brighty/brighty-marketplace-data.xlsx`.

## Jalankan demo
- Dev: `npm run dev`  → http://localhost:3000
- Build static: `npm run build` → folder `out/`
- Preview hasil static: `npm run preview` (http-server di `out/`)
- Lint: `npm run lint`

## Struktur
- `lib/products.js` — helper + enrichment (rating/review/sold/stok deterministik dari id,
  `discountPct`, rupiah). `lib/cn.js` — helper class Tailwind.
- `app/` — home, catalog (client-side filter/sort), kategori/[slug], produk/[slug], faq, about, wishlist, checkout.
- `components/` — Header Sociolla-style (strip promo, countdown, search, pill kategori),
  home (HeroCarousel, CouponStrip, PromoCards, BestSellerEmbla, RitualSticky, PromoPeriod),
  PDP (Gallery lightbox+tilt, BuyBox, Review, Share, Related), cart drawer, wishlist,
  plp filter/sort, motion (`CursorFollow`, `CarouselCursor`, `TiltCard`, `Spotlight`,
  `AnimatedText`, `Toast`, `ScrollTop`, `CountdownBar`), `ui/EmblaCarousel` (port ui-layouts).
- `brighty/brighty.official/` — raw data resmi (kurasi) + audit xlsx.
- `tailwind.config.js` — token Tailwind = cermin token CSS (preflight OFF agar CSS lama menang).

## Git
- Remote: `https://github.com/ZCrafters/brightydemo.git`, branch `main`.
- Alur: `git add -A` → `git commit -m "..."` → `git push -u origin main`
  (push pertama; selanjutnya cukup `git push`).
- Yang di-ignore: `node_modules/`, `out/`, `.next/`, `*.xlsx`, `.env*`.

## Verifikasi akhir
- `npm run validate` → `OK 25 produk (8 hero), 7 kategori.`
- `npm run lint` → 0 error
- `npm run build` → exit 0 (static export)
- Smoke test seluruh route dari `out/` = 200
- Cek kontras pasangan teks penting lolos WCAG AA (4.5) tiap ganti palet
- Commit + push ke `origin/main` setelah verifikasi lolos

## Catatan legal
Demo edukasi, tidak berafiliasi dengan Brighty. Gunakan untuk belajar/portofolio;
harga & foto produk adalah milik official store masing-masing.
