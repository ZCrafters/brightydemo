# PROMPT — Crawl Referensi Sociolla Brand Page (Skintific) & Rencana Penerapan ke BRIGHTY

> Sumber: `https://www.sociolla.com/1347_skintific?tab=products`
> Metode crawl: HTML situs adalah SPA (Vue/Vite) yang render client-side + diblokir CloudFront untuk proxy.
> Solusi: endpoint **API catalog asli** ditemukan lewat arsip Wayback CDX dan di-hit langsung (sukses, 200).
> Dokumen ini melengkapi `docs/skintific-recipe/context.md` (analisis visual lama) dengan **data schema API nyata**.
> Status: **SELESAI DIEKSEKUSI (2026-09-07)** — seluruh §6 tuntas, verifikasi §5 lolos
> (validate OK 25 produk, lint 0 error, build exit 0 / 42 halaman, smoke test 16 route = 200).

---

## 1. HASIL CRAWL — Endpoint API yang ditemukan

| Endpoint | Fungsi | Status |
|---|---|---|
| `GET catalog-api.sociolla.com/v3/brands/1347_skintific?fields=...` | Detail brand (banner, logo, flag negara, deskripsi, meta) | ✅ 200 |
| `GET catalog-api.sociolla.com/v3/products?limit=12&skip=0&sort=-total_orders&filter={"brand.slug":"1347_skintific"}` | Daftar produk per brand | ✅ 200 (12 produk) |
| `GET catalog-api.sociolla.com/v3/products?...&filter={"is_trending":true}` dll | Listing lain (home) | terarsip di CDX |

Catatan: `filter` dikirim sebagai JSON ter-URL-encode di query string. Filter `brand_slug` / `brand` **tidak valid** — yang benar `"brand.slug"`.

## 2. HASIL CRAWL — Data brand Skintific (respon nyata)

- `name`: "Skintific", `slug`: `1347_skintific`, `my_sociolla_sql_id`: 1347
- `country`: canada, `flag`: `https://images.soco.id/<uuid>-<id>-<epoch>.png` — flag negara tampil di samping nama brand
- `logo`: `https://images.soco.id/<uuid>-.jpg`
- `desktop_banner` / `mobile_banner`: banner brand page terpisah per device (URL images.soco.id)
- `description`: HTML (3 paragraf positioning "skin barrier", TTE Trilogy Triangle Effect, "Repair Your Skin Barrier")
- `i18n.vi` tersedia — struktur multi-bahasa (ID default + VI)

## 3. HASIL CRAWL — Schema produk (77 field, identik di semua SKU)

### 3.1 Field yang relevan untuk desain kartu produk / PLP

| Field | Contoh | Kegunaan UI |
|---|---|---|
| `name` | "5X Ceramide Barrier Moisture Gel" | Nama produk |
| `slug` | `64154-5x-ceramide-barrier-moisture-gel` | URL PDP (prefix SQL id) |
| `brand` | `{name, slug, logo, flag, country, region}` | Baris brand + logo/flag kecil |
| `categories[]` | 3 level: Skincare → Moisturizer → Face Gel | Breadcrumb filter PLP |
| `default_category.rating_types` | `["is_star_effectiveness",...]` | Dimensi rating per kategori (dinamis, jangan hardcode) |
| `price_range` | `"Rp195.000 - Rp419.000"` | **String Rupiah pre-formatted** — siap render langsung |
| `min_price` / `max_price` | 195000 / 419000 | Angka untuk filter harga |
| `discount_percentage`, `price_after_discount_range`, `discount_range` | 50%, dst | Ribbon diskon & harga coret |
| `review_stats` | `{average_rating: 4.7212, total_reviews: 11491, total_recommended_count, repurchase_counts, average_rating_by_types}` | Bintang + count + "97% merekomendasikan" |
| `total_wishlist` | 28390 | Social proof ("28 rb menyimpan") |
| `beauty_point_earned` | 80 | Loyalty point (badge "＋80 poin") |
| `is_new`, `is_sale`, `is_flashsale`, `is_limited`, `is_exclusive`, `is_pre_order`, `is_dangerous` | flag boolean | Badge/ribbon kondisional |
| `is_in_stock`, `is_out_of_stock_sociolla` | true/false | Status stok kartu |
| `images[]` | `{url, is_cover, is_packaging, is_lilla_cover, is_cosrx_cover}` | Tepat 1 `is_cover:true` per produk = thumbnail kartu |
| `default_combination` | objek varian default | **Sumber harga/ukuran/shade kartu tanpa scan array** |
| `combinations[].attributes` | key dinamis: `size` ("30 gr") atau `shade` ("01 Vanilla") | Picker varian; `shade.value` = URL gambar swatch warna |
| `combinations[].stock` | 1852 / 294 / **-2 (negatif mungkin!)** | Urgensi "Tersisa n" |
| `combinations[].status_item` | `active` / `hold_po` / `to_be_discontinue` | Varian disabled/strikethrough |
| `halal_status`, `halal_cert_no`, `bpom_expired_at` | "halal" | Trust mark BPOM/halal |
| `pack_detail[]` | kosong di batch ini | Isi bundle kalau terisi |

### 3.2 Skema promo (combination-level; null di batch ini, terisi saat periode flash sale)
`deduction_type/percentage/amount`, `deduction_for_sociolla/brand`, `saving`, `total_quota`/`sold_quota` (progress bar flash sale), `product_price_rule_name`, `label_bmsm` + `label_bmsm_expire_at`, `qpr_badge`.

### 3.3 Pola URL gambar
Host: `https://images.soco.id/` — dua konvensi berdampingan:
1. Legacy: `<uuid>-.jpg`
2. Current: `<uuid>-image-<index>-<epoch-millis>` (tanpa ekstensi)
Tanpa parameter resize di URL — transformasi dilakukan client. Peran: cover, packaging, swatch, logo, flag.

### 3.4 Pagination
Response **tanpa metadata total** — array polos. Klien hanya tahu "ada lagi" dengan request halaman berikut (blind pagination).

## 4. PETA PENERAPAN — Sociolla → BRIGHTY (yang akan diterapkan)

Prinsip: **improve yang ada, bukan rewrite**. Stack: Next.js 14 + anime.js + Tailwind (utility layer, preflight off) + vanilla CSS Glow yang sudah ada.

| # | Pola Sociolla (crawl + context.md lama) | Diterapkan ke Brighty | File target |
|---|---|---|---|
| 1 | Countdown bar promo (`HH:MM:SS` kotak gelap per digit + CTA) | `CountdownBar` client component di atas home (tema Glow: plum/raspberry, bukan pink Sociolla) | `components/ui/CountdownBar.jsx` (baru) |
| 2 | Kartu promo horizontal scroll ("Special Promo") | Section promo kartu kecil ala Sociolla, warna pastel Glow | `components/home/PromoCards.jsx` (baru) |
| 3 | Hero carousel 2 slide auto + dot + arrow | Hero Brighty jadi carousel slide (tetap tema glow gradient) dengan `CarouselCursor` effect | `components/home/HeroCarousel.jsx` (baru), ganti Hero statis |
| 4 | Kartu produk: ribbon diskon/NEW, wishlist heart, badge ukuran, **status stok pill 3 warna**, brand name, harga coret, rating + total_wishlist | Upgrade `ProductCard`: tambah pill status stok (deterministik dari id — konsisten dgn rating/sold), badge diskon % dari `originalPrice` | `components/ui/ProductCard.jsx` (edit) |
| 5 | `price_range` pre-formatted | Tidak perlu — `rupiah()` helper sudah ada | — |
| 6 | Filter sidebar: kategori + price range + SALE checkbox + sort + per-page | Brighty sudah punya; polish: tambah checkbox "Promo saja" (= SALE), slider harga min-max | `components/plp/Filters.jsx` (edit) |
| 7 | Blind pagination "muat lagi" | Sudah ada (load more) — dipertahankan | — |
| 8 | Varian `size`/`shade` dinamis + swatch gambar | PDP Brighty: `sizes[]`/`colors[]` sudah ada; polish tampilan swatch | `components/pdp/BuyBox.jsx` (edit) |
| 9 | Breadcrumb kategori 3-level | Sudah ada `Breadcrumb` — konsistensi label kategori | `components/ui/Chrome.jsx` (polish) |
| 10 | Flag negara + logo brand di header brand page | Bagian "Tentang" — info brand Brighty (asal Indonesia) | `app/about/page.jsx` (polish) |
| 11 | **Cursor animation (pengganti Cursify MCP)** | `CursorFollow` dot+halo (rAF + lerp, off di touch/reduced-motion), besar saat hover `[data-cursor]` | `components/motion/CursorFollow.jsx` (baru) |
| 12 | **Carousel cursor effect (pengganti Cursify)** | Tilt/parallax kartu mengikuti kursor di carousel & hero | `components/motion/CarouselCursor.jsx` (baru) |
| 13 | Interaksi ringan ala 21st MCP | `TiltCard` (3D tilt hover) + `Toast` (notifikasi wishlist/add-to-cart) | `components/motion/TiltCard.jsx`, `components/ui/Toast.jsx` (baru) |
| 14 | Scroll-to-top floating | Ada di demo ref; tambahkan ke layout Brighty | `components/ui/ScrollTop.jsx` (baru) |
| 15 | Tab Home ↔ Products tanpa reload | Brighty pakai route riil (`/`, `/catalog`) — **tidak diubah**, prinsip SSR/static export tetap | — |

### Aturan teknis eksekusi
- Tailwind: `tailwindcss@3` + `postcss` + `autoprefixer`, `preflight:false`, token Glow di-extend ke theme (warna `plum`, `raspberry`, `glow-1..3`, font Outfit/Cabinet Grotesk) — utility layer di atas `globals.css` yang ada.
- Package tambahan sesuai skill setup-website: `motion` TIDAK perlu (sudah ada anime.js); `clsx` + `tailwind-merge` berguna untuk komponen Tailwind baru.
- Semua komponen baru `"use client"` + file terpisah; komponen berat di-mount lazy (`next/dynamic`, `ssr:false` aman untuk static export di client-only, dengan fallback yang tidak menghalangi konten).
- Semua animasi: transform/opacity saja, hormati `prefers-reduced-motion`, konten tetap terlihat tanpa JS (pola `Reveal` yang sudah ada).
- Data tetap dari `data/products.brighty.json` (25 SKU) — enrichment stok deterministik dari `hash(id)` (pola yang sama dengan rating/sold).
- **Legal**: tidak menyalin aset/logo/foto Sociolla/Skintific; hanya pola struktur & interaksi. Disclaimer demo tetap di footer.

## 5. VERIFIKASI (Definition of Done)
- [ ] `npm run validate` → `OK 25 produk (8 hero), 7 kategori.`
- [ ] `npm run lint` → 0 error
- [ ] `npm run build` → exit 0 (static export `out/`)
- [ ] Smoke test semua route dari `out/` = 200
- [ ] Tailwind utility bekerja (contoh class ter-render) tanpa merusak token CSS lama
- [ ] CursorFollow mati otomatis di touch device & reduced-motion
- [ ] Countdown berjalan (detik berkurang), pill stok 3 varian tampil benar
- [ ] Folder tetap tanpa `.git` / `.github`

## 6. URUTAN EKSEKUSI
1. Setup Tailwind (config + postcss + globals hook) + install `clsx`, `tailwind-merge`
2. Komponen motion: `CursorFollow`, `CarouselCursor`, `TiltCard`
3. Komponen UI: `Toast`, `CountdownBar`, `ScrollTop`, `PromoCards`
4. Integrasi layout (`CursorFollow`, `Toast`, `ScrollTop`) + home (`HeroCarousel`, `CountdownBar`, `PromoCards`)
5. Upgrade `ProductCard` (stok pill, ribbon diskon, wishlist) + PLP (checkbox promo, slider harga)
6. Polish PDP (swatch, trust mark BPOM/halal) + about/faq/wishlist/checkout
7. Verifikasi penuh (§5)
