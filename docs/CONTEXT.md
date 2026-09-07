# BRIGHTY — Demo Body Care (Context)

> Brand: **Brighty** — body care & brightening asal Indonesia (ketiak cerah → body serum/wash/scrub/toner).
> Sifat: demo edukasi + portofolio. **Bukan** afiliasi resmi; harga provisional mengikuti official store.

## Data & sumber
- Katalog `data/products.brighty.json` (25 SKU, 8 hero id 1-8) dihasilkan `scripts/import-brighty.js`
  dari kurasi produk resmi `brighty/brighty.official/_raw_a.json` + `_raw_b.json`.
- Sumber data = halaman produk **official store**: Tokopedia `brightyindonesia` (mayoritas),
  TikTok `@brighty.id`, Shopee `brighty_id`, Lazada `brighty-official-store`. Anti-bot menghalangi
  full-scrape listing; data dikurasi per-PDP + harga/BPOM dari listing resmi (tercatat di Excel).
- Audit: `brighty/brighty-katalog-audit.xlsx` (2 sheet: Katalog + Ringkasan) ← `scripts/make-brighty-audit.js`.
- Data marketplace (tanpa gambar, diambil 2026-09-07): `brighty/marketplace-tokopedia.json`
  (64 listing Tokopedia `brightyindonesia`, hal. 1–7, via `scripts/parse-tokopedia.js`) →
  `brighty/brighty-marketplace-data.xlsx` (sheet Tokopedia + Pemetaan Katalog 25 SKU + Ringkasan)
  via `npm run audit:marketplace`. Shopee/Lazada/Blibli terblokir anti-bot (hanya info toko).
- Validasi: `scripts/validate-brighty.js` (slug/id unik, harga>0, gambar https, kategori ada).

## Skema SKU (engine-compatible)
`{ id, slug, name, category, categoryLabel, pack, sizes:[], colors:[], price, originalPrice,
   bpom, claim, images[], source:"brighty-official", provisional, heroFlag, newTag }`
- `sizes`/`colors` kosong → PDP tidak memaksa pilih size; ukuran kemasan (30ml/150ml/…) = nama SKU.
- `bpom` nomor registrasi; `claim` ringkasan klaim/kandungan dari listing resmi (max 300 char).

## Kategori & label
`body-serum` Body Serum · `body-wash` Body Wash & Sabun · `scrub-mask` Scrub & Mask ·
`underarm-care` Underarm Care · `toner` Toner & AHA · `hair-removal` Hair Removal ·
`bundle` Bundle & Paket → map label di `lib/products.js` (`CATEGORY_LABELS`).

## Design tokens (app/globals.css)
Palet "Blueberry": sky dominan `#eef6fd`, navy `#0b5cab`, aksen hot pink `#e6007e`,
gradien glow `#cfe7fa → #e2f1fc → #f2f9fe`. Font Outfit + Cabinet Grotesk.

## Stack & komponen utama
- Next.js 14 (static export) + Tailwind v3 (utility layer, preflight OFF, token = palet di atas)
  + `motion` (animasi) + `embla-carousel` (rel Best Seller) + `animejs` + `clsx`/`tailwind-merge`.
- Komponen motion terpisah per file: `CursorFollow`, `CarouselCursor`, `TiltCard`/`useTilt`,
  `CountdownBar`, `Toast`, `ScrollTop`, `HeroCarousel`, `CouponStrip`, `RitualSticky`,
  `Spotlight`, `AnimatedText`, port `EmblaCarousel` (ui-layouts, MIT).
- Header ala Sociolla: strip promo + countdown global + search lebar + pill kategori.

## Git/GitHub (keputusan user, revisi: sebelumnya tanpa git)
Repo: **https://github.com/ZCrafters/brightydemo.git**, branch `main`.
`node_modules/`, `out/`, `.next/`, `*.xlsx` di-ignore (lihat `.gitignore`).
