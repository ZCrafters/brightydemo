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
Palet "Pinky Girl": krem pink `#fff5f9`, berry dalam `#7c1d4e`, aksen hot pink `#e6007e`,
gradien glow `#ffd0e3 → #ffe3ee → #fff0f6`. Font Outfit + Cabinet Grotesk.

## Tanpa git/GitHub (keputusan user)
Folder ini sengaja **tanpa `.git` & `.github`**. Untuk riwayat, backup manual folder.
