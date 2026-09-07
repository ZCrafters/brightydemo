# CONTEXT.md — Analisis Sumber: Sociolla x Skintific Brand Page

> Sumber: `https://www.sociolla.com/1347_skintific?tab=products`
> Metode: Analisis visual dari 4 screenshot yang diberikan user (situs memblokir bot-fetch langsung), diperkaya riset publik tentang brand Skintific.
> Tujuan dokumen: jadi "single source of truth" konten & struktur sebelum prompt dieksekusi ke AI builder (frontend-design / ui-ux-pro-max).

---

## 1. Identitas Brand yang Ditampilkan

**Brand:** SKINTIFIC (skincare, asal marketplace TikTok/Sociolla, positioning "science-based skincare")

**Value proposition yang muncul di banner:**
- "SKINCARE ROUTINE PICKS 40% OFF"
- Badge "NEW • CRUSH"
- Klaim produk: *Protects & Evens Skin Tone*, *Boosts Instant Hydration & Radiance*, *Delivers Glass Skin Radiance*
- Promo period: "1 – 8 SEP 2026" dengan syarat "S&K Berlaku"
- Diskon headline: **DISC. 40% | VOUCHERS UP TO 200K**

**Signature ingredient/teknologi (dari riset produk):**
- **5X Ceramide** — 5 jenis ceramide (NP, EOP, AP, AS, NS) untuk skin barrier
- **2% Salicylic Acid + ACSD technology** (encapsulated BHA, anti-acne)
- **SymWhite377** — dark spot eraser
- **Niacinamide 4%**, **Centella Asiatica**, **Pionin**, **BFL Probiotics**
- Sunscreen line dengan **SPF50+ PA++++** + tinted serum sunscreen

---

## 2. Struktur Halaman (Page Anatomy)

### A. Global Header / Utility Bar (dari Image 1)
1. **Promo strip #1** (pink) — "Glad2Glow — LAST CALL! SAVE UP TO 55% + FREE BODY SERUM!" + CTA "SHOP NOW"
2. **Promo strip #2** (gradient biru-pink) — badge "NEW•CRUSH" + "SKINTIFIC SKINCARE ROUTINE PICKS 40% OFF" + CTA "SHOP NOW"
3. **Top nav sekunder**: SOCIOLLA | LILLA | BEAUTY JOURNAL | SOCO — kontak (email, telepon, help center) — flag switcher ID/VN
4. **Countdown promo bar**: teks promo "OTW 9.9 : NPURE starts from 15K + FREE I'm From Pad" + timer digital `HH:MM:SS` label "Berakhir Pada" + tombol CTA merah "Shop now"
5. **Header utama**: Logo wordmark "sociolla" (serif italic) — Search bar besar berisi placeholder promosi ("SKINTIFIC: SKINTINT, PADS & MASK 40% OFF ❤") dengan icon search — "Login with SO•CO" — icon keranjang belanja dengan badge angka (0)
6. **Nav kategori** (ikon + label, pill/badge style pink pastel): Categories, Brands, Bestie Deals, New Arrivals, Best Sellers, E-Gift Card

### B. Breadcrumb
`Home / Brands / Skintific`

### C. Hero Banner Brand (carousel, 2 slide terlihat)
- **Slide 1 (Image 1):** split banner biru muda — kiri: foto produk (jar Truffle Biome, tube Panthenol Acne Calming Water Gel) + wordmark "SKINTIFIC" besar di tengah gradient biru; kanan: panel pink dengan produk sunscreen di dalam bentuk hati (heart-shape frame), badge callout "Protects & Evens Skin Tone", dekorasi bintang & hati mengambang
- **Slide 2 (Image 3):** banner penuh gradient biru→pink — 3 produk floating dalam frame hati (sunscreen, PDRN pads, sheet mask) masing-masing dengan speech-bubble callout klaim produk, di kanan ada blok promo teks "NEW•CRUSH / SKINTIFIC / DISC. 40% | VOUCHERS UP TO 200K / 1-8 SEP 2026 | S&K Berlaku"
- Carousel indicator dots di bawah banner (pill aktif + dot)

### D. Tab Navigation
`Home` (underline aktif pink) | `Products` — sederhana, underline indicator merah muda di bawah tab aktif

### E. Section "Special Promo" (tab Home)
- Header icon tiket + judul "Special Promo" — link "See all" di kanan (pink, dengan chevron)
- Baris kartu promo horizontal (6 kartu terlihat), masing-masing kartu pink pucat berisi: badge icon diskon (%), judul promo pendek (2 baris max), contoh:
  - "FREE GIFT 7 SEP 2026"
  - "VOUCHER 15% SKINTIFIC..."
  - "REDEEM BEAUTIES WITH BESTIE DEA..."
  - "VOUCHER UP TO 200K ROAD TO 99..."
  - "VOUCHER UP TO 150K ROAD TO 99..."
  - kartu terakhir putih polos: "Masih ada promo menarik lainnya, lho!" (CTA implisit)

### F. Product Carousel (Image 2, masih di tab Home — kemungkinan "New Arrivals" atau grid produk highlight)
Card produk horizontal-scroll dengan navigasi arrow kiri/kanan (`<` `>`), setiap card:
- Ribbon diskon pojok kiri-atas (merah, contoh "50%", "52%") ATAU ribbon abu "OUT OF STOCK"
- Icon love/wishlist pojok kanan-atas (outline heart)
- Foto produk (packaging asli, background putih)
- Badge ukuran (pill abu, contoh "20 ml", "1 x 25ml", "80 ml")
- **Status stok** — pill bar warna:
  - Hijau solid = "Masih Tersedia"
  - Merah gradient = "Tersisa {n}" (urgency, contoh "Tersisa 49", "Tersisa 47")
  - Abu-abu = "Stok Habis"
- Nama brand (bold, uppercase kecil): SKINTIFIC
- Nama produk (truncated dengan "...")
- Harga: harga diskon (merah/pink, bold) + icon petir/flash + harga coret (strikethrough, abu)

Contoh data produk nyata dari screenshot:
| Produk | Ukuran | Stok | Harga | Harga Asli | Diskon |
|---|---|---|---|---|---|
| 2% Salicylic Acid Anti Acne Serum | 20 ml | Masih Tersedia | Rp97.500 | Rp195.000 | 50% |
| SymWhite377 Dark Spot Eraser Serum | 20 ml | Masih Tersedia | Rp104.500 | Rp209.000 | 50% |
| 5X Ceramide Soothing Sheet Mask | 1x25ml | Tersisa 49 | Rp19.500 | Rp39.000 | 50% |
| REFILL Cover All Perfect Cushion | — | Tersisa 47 | Rp80.160 | Rp167.000 | 52% |
| 5X Ceramide Barrier Moisture... | 80 ml | Stok Habis | Rp209.500 | Rp419.000 | 50% |

### G. Section "Rekomendasi Sesuai Beauty Profile-mu" 💄
- Icon lipstick + judul
- Sub-teks ajakan login: "Login ke akunmu & dapatkan rekomendasi produk berdasarkan beauty profile-mu!" + link pink bold "Login sekarang"

### H. Section "Best Seller"
- Judul section — grid/carousel produk best seller (terpotong di screenshot, terlihat produk tube krim biru "5X Ceramide")

### I. Tombol Scroll-to-top
- Floating circular button (outline pink, icon chevron-up) pojok kanan-bawah

### J. Tab "Products" — Product Listing Page (Image 3 & Image 4)
- **Sidebar filter kiri:**
  - "Category" — dropdown/list "All Category"
  - "Price" — dual-handle range slider Rp0 — Rp1.000.000++
  - Checkbox "SALE"
- **Toolbar hasil:**
  - "111 results found" (kiri)
  - "TAMPILKAN" dropdown jumlah per halaman (default 16)
  - "SORT BY" dropdown (default "-")
- **Grid produk 4 kolom**, tiap card:
  - Ribbon ganda: badge diskon merah ("45%", "40%") DI ATAS badge hitam "NEW"
  - Beberapa produk tampil sebagai **bundle** (2 item foto bersisian) dengan pill "BUNDLE" (pink pucat) di bawah foto
  - Icon wishlist outline di kanan atas
  - Nama brand + nama produk + harga (format sama seperti carousel)

Contoh data bundle dari Image 4:
| Bundle | Harga | Harga Asli |
|---|---|---|
| Skin Barrier Day Combos (5x Ceramide Moisturizer + ...) | Rp183.700 | Rp334.000 |
| Skin Barrier Best Combos (5x Ceramide Moisturizer + Serum) | Rp345.400 | Rp628.000 |
| Skin Barrier Value Combos (5x Ceramide Moisturizer + Duo...) | Rp383.350 | Rp697.000 |
| Skin Barrier Basic Combos (5x Ceramide Moisturizer + ...) | Rp229.900 | Rp410.000 |

---

## 3. Sistem Visual (Design Tokens hasil observasi)

### Warna
| Token | Hex (perkiraan) | Pemakaian |
|---|---|---|
| Primary Pink | `#E6007E` / `#EE2A7B` | CTA button, harga diskon, link aktif, underline tab |
| Soft Pink BG | `#FDE7EF` / `#FCEAF2` | banner promo strip, kartu promo pastel |
| Baby Blue | `#CFE9F5` → `#EAF3FB` (gradient) | hero banner Skintific |
| Text Dark | `#222222` | judul produk, heading |
| Text Muted | `#8A8A8A` | harga coret, label kecil |
| Success Green | `#2E9E4F` | badge "Masih Tersedia" |
| Danger Red | `#D62B4E` → gradient | badge "Tersisa n", ribbon diskon |
| Neutral Grey | `#B5B5B5` | badge "Stok Habis" |
| White | `#FFFFFF` | background utama |

### Tipografi
- **Logo "sociolla"**: serif italic, lowercase, elegan (kesan "beauty/premium")
- **Wordmark "SKINTIFIC"**: sans-serif bold, huruf besar, tracking lebar (kesan klinis/scientific)
- **Body/produk**: sans-serif standar (mirip Inter/Helvetica), size kecil-menengah, hierarki: brand name (bold, uppercase, kecil) > product name (regular, 2 baris max, truncate) > harga (bold, warna aksen)

### Layout & Komponen Berulang
- Card produk: rasio foto ±1:1, padding compact, radius sudut kecil (4–8px)
- Badge/ribbon: posisi absolute pojok kartu, sudut membulat kecil, warna solid kontras
- Countdown timer: kotak gelap per digit dengan separator `:`
- Icon set: outline minimalis (heart/wishlist, search, cart, chevron) gaya line-icon pink/dark
- Micro-decoration tema hati & bintang mengambang di banner (branding feminin/Gen-Z)

---

## 4. Interaksi & Fungsi yang Perlu Disimulasikan di Demo
1. Countdown timer real-time (mundur)
2. Carousel banner hero (auto-slide + dot indicator + swipe/arrow)
3. Carousel produk horizontal dengan tombol prev/next + scroll-snap
4. Toggle wishlist (klik heart → filled/unfilled, badge cart bertambah opsional)
5. Tab switch Home ↔ Products (client-side, tanpa reload)
6. Filter sidebar: price range slider + checkbox SALE + kategori (mem-filter grid state React)
7. Sort by & Tampilkan (pagination/jumlah item) dropdown
8. Search bar dengan placeholder promosi bergaya "typing hint"
9. Badge status stok dinamis (Tersedia / Tersisa n / Habis) berdasarkan data produk
10. Scroll-to-top floating button muncul setelah scroll > threshold
11. Responsive: dari desktop (grid 4-5 kolom) ke mobile (breakpoint di Image 4 menunjukkan header sudah versi desktop dengan browser chrome — pastikan versi mobile disiapkan terpisah)

---

## 5. Catatan Penting
- Ini adalah **demo/clone edukatif untuk keperluan desain & latihan front-end**, bukan reproduksi 1:1 aset berhak cipta (foto produk asli, logo asli Sociolla/Skintific tidak boleh disalin/dijiplak pixel-perfect). Gunakan **foto produk placeholder/generik** atau ilustrasi buatan sendiri, dan **nama brand demo alternatif** jika tujuan akhirnya adalah publikasi publik.
- Skill yang tersedia di lingkungan ini untuk eksekusi: `frontend-design` dan `ui-ux-pro-max`. Nama `/prompt-master` dan `/web-artifacts-builder` yang disebut user **tidak terdaftar** sebagai skill aktif saat ini — instruksinya sudah dilebur ke dalam `prompt.md` & `workflow.md` di bawah supaya tetap tercapai secara fungsional.
