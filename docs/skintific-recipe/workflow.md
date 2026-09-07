# WORKFLOW.md — Alur Eksekusi Pembangunan Demo "Skintific Store"

> Panduan urutan kerja untuk AI/dev yang mengeksekusi `prompt.md` dengan referensi `context.md`. Ditulis sebagai checklist bertahap agar hasil tidak berantakan dan mudah di-review per fase.

---

## FASE 0 — Persiapan
1. Baca `context.md` penuh — pahami anatomi halaman, data produk contoh, dan design tokens.
2. Baca `prompt.md` penuh — pahami hard constraint (tidak boleh pakai aset asli, ganti nama wordmark platform).
3. **Skill yang dipanggil** (di lingkungan Claude):
   - `frontend-design` → untuk arahan estetika non-generik, pemilihan font pairing, hindari "AI slop" layout
   - `ui-ux-pro-max` → untuk pola UI e-commerce (product card, filter sidebar, dashboard-like listing), spacing system, palet warna
   - Jika tersedia skill lain seperti "prompt-master" / "web-artifacts-builder" di environment eksekusi, jalankan sebagai lapisan tambahan; jika tidak ada, lanjut tanpa itu (fungsinya sudah tercakup di `prompt.md`).
4. Tentukan nama brand platform demo (pengganti "sociolla") — konsisten dipakai di seluruh komponen.

---

## FASE 1 — Skeleton & Data Layer
1. Buat struktur komponen kosong (Header, PromoBar, HeroCarousel, TabNav, HomeTab, ProductsTab, Footer) sebagai placeholder.
2. Bangun **array data mock produk** (≥16 item) sesuai skema di `prompt.md` §4 — variasikan kategori, stok, diskon, bundle.
3. Bangun **array data promo** untuk section "Special Promo" (5-6 item).
4. Setup **state global** di komponen root: `activeTab`, `wishlist` (Set/array id), `cartCount`, `filters` (category, priceRange, saleOnly), `sortBy`, `itemsPerPage`, `currentPage`.

## FASE 2 — Komponen Global (selalu tampil)
1. Implement **CountdownTimer** (komponen terpisah, `useEffect` + `setInterval`, cleanup di `return`).
2. Implement **Header** (logo, search bar dummy, login button, cart icon + badge dari `cartCount`).
3. Implement **PromoStrip** & **UtilityBar** (statis, styling sesuai token warna).
4. Implement **CategoryNav** (pill icon, tidak perlu fungsi navigasi nyata — cukup `onClick` set filter kategori jika relevan).
5. Implement **Breadcrumb**.
6. Verifikasi: tidak ada elemen yang overflow di mobile width 375px.

## FASE 3 — Hero Carousel
1. Bangun **HeroCarousel** dengan state `currentSlide`, auto-advance via `setInterval` 5 detik, tombol prev/next, dot indicator klik-able.
2. Styling 2 slide sesuai deskripsi `context.md` §2.C (gradient, heart-frame produk, badge klaim, dekorasi bintang/hati).
3. Uji transisi slide halus (CSS transition transform/opacity).

## FASE 4 — Tab Navigation & Tab "Home"
1. Implement **TabNav** dengan underline indikator animasi (posisi berdasarkan `activeTab`).
2. Bangun **PromoGrid** (Special Promo) — horizontal scroll pastel cards.
3. Bangun **ProductCard** (komponen reusable dipakai di semua listing) sesuai spesifikasi `prompt.md` §2.6 — ini komponen paling kritikal, selesaikan dan uji dulu sebelum dipakai berulang:
   - Ribbon diskon + NEW
   - Toggle wishlist (update state global)
   - Badge ukuran
   - Status stok 3 varian warna
   - Bundle mode (2 gambar + pill BUNDLE)
   - Harga terhitung otomatis dari `basePrice` & `discountPercent`
4. Bangun **ProductCarousel** (pakai ProductCard, scroll-snap horizontal + tombol arrow).
5. Bangun section **"Rekomendasi Beauty Profile"** (statis + link dummy → toast "Fitur demo").
6. Bangun section **"Best Seller"** (grid pakai ProductCard).

## FASE 5 — Tab "Products" (Listing Page)
1. Bangun **FilterSidebar**: kategori (radio list), price range (dual slider atau 2 input number sinkron), checkbox SALE.
2. Bangun **Toolbar**: hitung `results found` dari hasil filter real-time, dropdown `Tampilkan`, dropdown `Sort by`.
3. Implement **logika filter + sort** murni di JS (derive dari `products` state, bukan mutate langsung):
   - Filter kategori → filter harga → filter SALE → sort → slice pagination
4. Bangun **ProductGrid** (4 kolom desktop → 2 kolom tablet → 1-2 kolom mobile) pakai ProductCard yang sama dari Fase 4.
5. Bangun **Pagination** sederhana (Prev/Next + nomor halaman) berbasis `itemsPerPage` & `currentPage`.
6. Uji: ubah setiap filter/sort harus langsung mengubah grid & angka "results found".

## FASE 6 — Elemen Penutup & Polish
1. Implement **ScrollToTopButton** (listener scroll, muncul >400px).
2. Implement **Toast** ringan untuk notifikasi wishlist/login dummy.
3. Bangun **Footer** dengan disclaimer demo.
4. **Review responsif menyeluruh**: 375px (mobile), 768px (tablet), 1280px+ (desktop) — cek tidak ada elemen terpotong/overflow horizontal tak sengaja (kecuali carousel yang memang di-scroll).
5. **Review aksesibilitas dasar**: kontras teks vs background, alt text/aria-label pada icon-only button (heart, cart, arrow).

## FASE 7 — Audit Kepatuhan (Copyright & Kebijakan)
1. Pastikan **tidak ada** logo asli "Sociolla" dipakai — sudah diganti wordmark platform sendiri.
2. Pastikan **tidak ada** foto produk asli hasil scraping — semua visual produk adalah mockup CSS/SVG buatan sendiri.
3. Pastikan nama produk sudah diparafrasekan/digeneralisasi, bukan disalin persis dari listing asli.
4. Tambahkan disclaimer "proyek demo edukasi, tidak berafiliasi dengan Sociolla/Skintific" di footer — final check sebelum dianggap selesai.

## FASE 8 — Delivery
1. Render sebagai satu file React artifact.
2. Sampaikan ringkasan fitur yang sudah jadi vs yang masih disederhanakan (misal: pagination dummy, login dummy) supaya user tahu batas fidelity demo.
3. Tawarkan iterasi lanjutan: tambah halaman detail produk, keranjang belanja penuh, atau versi checkout dummy — sebagai next step opsional, bukan bagian wajib scope awal.

---

## Catatan Prioritas Jika Waktu/Kompleksitas Terbatas
Urutan **wajib ada** (MVP demo): Header + Countdown + Hero Carousel + Tab Nav + ProductCard (lengkap dengan semua state) + Grid Products dengan filter & sort fungsional.
Urutan **boleh disederhanakan duluan**: Special Promo grid, Best Seller section, Rekomendasi Beauty Profile, Pagination (bisa "load more" saja).
