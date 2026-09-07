# PROMPT.md — Master Prompt: Bangun Website Demo "Skintific Store" (Kloning Fungsional dari Halaman Brand Sociolla)

> Gunakan file ini sebagai **satu prompt utuh** untuk AI builder (Claude + skill `frontend-design` / `ui-ux-pro-max`, atau tool sejenis Cursor/Lovable/v0). Referensi data & aturan detail ada di `context.md`. Urutan eksekusi ada di `workflow.md`.

---

## 0. PERAN & TUJUAN

Kamu adalah **senior front-end engineer + UI/UX designer** yang ditugaskan membuat **website demo e-commerce skincare** bernama **"Skintific Store"** (versi kedua/inspired-by, BUKAN reproduksi pixel-perfect dari Sociolla). Tujuan: portofolio/demo interaktif yang meniru **struktur, alur, dan pola interaksi** halaman brand Skintific di Sociolla, dengan konten & aset yang di-generate ulang (bukan copy aset asli berhak cipta).

**Hard constraint:** JANGAN gunakan logo asli "Sociolla" atau foto produk asli Skintific dari internet. Gunakan nama brand demo (misal "Skintific" boleh tetap sebagai nama produk fiktif dalam konteks demo edukasi, tapi wordmark "sociolla" diganti nama platform sendiri, misal **"Bellava"** atau nama lain yang kamu tentukan) + gambar produk berupa mockup CSS/SVG sederhana (botol/jar minimalis dengan gradient) sebagai pengganti foto asli.

---

## 1. TECH STACK

- **React (functional component + hooks)**, single-file artifact
- Styling: **Tailwind core utility classes only** (sesuai batasan environment artifact — no compiler tambahan)
- Icon: `lucide-react`
- State management: `useState`/`useReducer` lokal (tanpa backend nyata — semua data mock di dalam file)
- Tidak ada `localStorage`/`sessionStorage` — gunakan in-memory state saja
- Struktur: satu file utama, dipecah jadi beberapa **sub-komponen dalam file yang sama** agar terbaca rapi (Header, PromoBar, HeroCarousel, TabNav, PromoGrid, ProductCarousel, ProductGrid, FilterSidebar, Footer)

---

## 2. INFORMASI ARSITEKTUR (mengikuti context.md)

Bangun **1 halaman brand** dengan **2 tab state**: `Home` dan `Products`, plus komponen global yang selalu tampil.

### 2.1 Global (selalu render, di atas tab manapun)
1. **Top promo strip** — 2 baris banner tipis (bisa 1 baris cukup untuk demo), warna pink→biru gradient, teks promo + tombol "Shop Now" kecil.
2. **Utility bar** — kiri: menu teks (Home Demo | Journal | Help), kanan: email/kontak dummy + language switch (ID/EN toggle dummy).
3. **Countdown promo bar** — teks promo "Flash Sale 9.9" + **countdown timer real** (gunakan `useEffect` + `setInterval`, hitung mundur ke waktu target, format `HH:MM:SS` dalam kotak gelap per digit) + tombol CTA merah "Shop Now".
4. **Header utama**:
   - Logo wordmark (buat nama sendiri, font serif italic, contoh style seperti "sociolla" tapi nama beda)
   - Search bar lebar dengan placeholder animasi/promosi ("Cari: Serum, Sunscreen, Sheet Mask...")
   - Tombol "Login" + icon keranjang belanja dengan **badge counter** (state jumlah wishlist/cart, update saat user klik heart di produk)
5. **Nav kategori pill**: Categories, Brands, Deals, New Arrivals, Best Sellers, Gift Card — masing-masing dengan icon lucide-react.
6. **Breadcrumb**: `Home / Brands / Skintific`

### 2.2 Hero Banner (carousel, auto-slide tiap 5 detik + dot indicator + tombol arrow)
- Minimal 2 slide, style sesuai `context.md` section C:
  - Slide 1: split panel biru muda (kiri foto mockup produk + wordmark brand besar; kanan panel pink dengan produk dalam frame heart-shape + badge klaim)
  - Slide 2: gradient penuh biru→pink, 3 mockup produk floating dalam heart-frame dengan speech-bubble callout, blok teks promo besar di kanan ("DISC. 40% | VOUCHER UP TO 200K", tanggal promo)
- Dekorasi: bintang & hati mengambang (SVG kecil, posisi absolute, subtle animation float opsional)

### 2.3 Tab Navigation
Dua tab: `Home` (default aktif) & `Products`, dengan underline indicator animasi pindah tab (transisi CSS).

### 2.4 TAB "Home" — isi:
1. **Section "Special Promo"** — heading + link "See all" — carousel horizontal 5-6 kartu promo pastel pink berisi judul promo pendek (badge icon %).
2. **Product Carousel** — heading "New Arrivals" (atau nama lain) + tombol prev/next arrow — render 6-8 mock product card (lihat spesifikasi card di 2.6) hasil scroll horizontal dengan `overflow-x-auto` + snap.
3. **Section "Rekomendasi Sesuai Beauty Profile-mu"** — icon lipstick + ajakan login (dummy link, tidak perlu benar-benar login, cukup tampilkan alert/toast state "Fitur demo").
4. **Section "Best Seller"** — grid produk 4 kolom (desktop) dari data mock yang sama/berbeda.

### 2.5 TAB "Products" — isi (Product Listing Page):
- **Sidebar filter kiri** (collapsible di mobile):
  - Kategori (radio/list "All Category", "Serum", "Moisturizer", "Sunscreen", "Mask")
  - Price range slider dual-handle (Rp0 – Rp1.000.000, gunakan `<input type="range">` custom styled dua handle atau simulasikan dengan 2 slider)
  - Checkbox "SALE" (filter produk diskon saja — state harus benar-benar memfilter array produk)
- **Toolbar**: "{n} results found" (n = hasil filter real-time) — dropdown "Tampilkan" (8/16/32) — dropdown "Sort by" (Harga Terendah/Tertinggi/Terbaru — implementasikan sorting beneran pada array)
- **Grid produk 4 kolom** (responsive: 2 kolom tablet, 1-2 kolom mobile) menggunakan data produk mock (min. 16-20 item, termasuk beberapa item bertipe **bundle** dengan pill "BUNDLE" dan 2 foto bersisian)
- Pagination sederhana di bawah grid (Prev/Next atau nomor halaman) — boleh dummy tapi fungsional untuk slice array

### 2.6 Spesifikasi Kartu Produk (dipakai di carousel & grid)
Card harus punya semua elemen berikut, dengan **state interaktif nyata**:
- Ribbon diskon pojok kiri-atas (badge merah "%") — muncul kondisional jika ada `discountPercent`
- Ribbon "NEW" hitam kecil di atas ribbon diskon (jika `isNew: true`)
- Icon wishlist (heart outline) pojok kanan-atas — **klik toggle** filled/unfilled + update counter cart di header
- Placeholder gambar produk: mockup CSS (misal `div` gradient rounded dengan bentuk botol/jar sederhana via SVG atau shape CSS) — jangan pakai foto asli produk dari internet
- Badge ukuran (pill abu, contoh "20 ml")
- **Status stok** pill dengan 3 varian warna sesuai state (`available` hijau / `low-stock-{n}` merah gradient teks "Tersisa {n}" / `out-of-stock` abu "Stok Habis") — tombol/klik card jadi disabled cursor jika out-of-stock
- Nama brand kecil bold uppercase
- Nama produk (line-clamp 2 baris, truncate ellipsis)
- Harga: harga diskon (bold, pink) + icon flash + harga asli (strikethrough abu) — hitung otomatis dari `basePrice` & `discountPercent`, jangan hardcode dua-duanya manual supaya konsisten
- Jika `isBundle: true`: tampilkan 2 gambar mockup bersisian + pill "BUNDLE" di bawah foto, sebelum nama produk

### 2.7 Footer
Sederhana: kolom info toko, kategori, bantuan, sosial media icon, copyright demo ("Ini adalah proyek demo edukasi, tidak berafiliasi dengan Sociolla/Skintific").

### 2.8 Elemen Global Tambahan
- Floating scroll-to-top button (muncul setelah `window.scrollY > 400`, pakai event listener di `useEffect`)
- Toast/notifikasi kecil sederhana untuk aksi (misal "Ditambahkan ke wishlist ❤")

---

## 3. DESIGN SYSTEM (ikuti context.md §3, boleh sedikit disesuaikan agar orisinal)

- Palet: pink primary (`#E6007E`-ish), soft pink bg, baby blue gradient hero, hijau sukses, merah urgency, abu netral
- Logo brand: font serif italic untuk wordmark platform; font sans bold tracking-wide untuk wordmark "SKINTIFIC" produk
- Card radius kecil (rounded-lg), shadow tipis saat hover (`hover:shadow-md transition`)
- Gunakan **micro-interaction**: hover scale kecil di card produk, transisi warna smooth di tombol, animasi underline tab
- Terapkan prinsip dari skill `ui-ux-pro-max` untuk spacing konsisten (8px grid), kontras warna aman (AA), dan hierarki tipografi jelas
- Terapkan prinsip dari skill `frontend-design` agar hasil **tidak terlihat generik/template AI** — beri detail kecil yang distinctive (dekorasi bintang/hati custom SVG, gradient unik di hero, pemilihan font pairing yang disengaja)

---

## 4. DATA MOCK YANG WAJIB DISERTAKAN

Buat array `products` (min. 16 item) di dalam kode dengan field:
```js
{
  id, brand: "SKINTIFIC", name, size, price, basePrice, discountPercent,
  stock: "available" | { status: "low", qty: number } | "out",
  isNew: boolean, isBundle: boolean, category: string, createdAt: (untuk sort "terbaru")
}
```
Gunakan variasi nama produk realistis-generik terinspirasi kategori skincare (serum, moisturizer, sunscreen, sheet mask, cleanser, toner) — **jangan salin nama produk asli kata-per-kata**, cukup terinspirasi pola penamaan (contoh: "Ceramide Barrier Repair Serum", "Salicylic Acid Anti-Acne Gel", "Glow Tinted Sunscreen SPF50").

---

## 5. KRITERIA SUKSES / DEFINITION OF DONE
- [ ] Semua section di §2 ter-render, responsive (mobile-first, breakpoint sm/md/lg)
- [ ] Countdown timer berjalan nyata (detik berkurang)
- [ ] Tab Home ↔ Products berpindah tanpa reload, state terjaga
- [ ] Filter kategori + price range + checkbox SALE benar-benar memfilter array produk yang dirender
- [ ] Sort by benar-benar mengubah urutan array
- [ ] Wishlist toggle mengubah icon & counter cart di header secara real
- [ ] Tidak ada error console, tidak ada penggunaan `localStorage`
- [ ] Tidak ada aset/logo asli pihak ketiga — semua visual produk berupa mockup buatan sendiri
- [ ] Disclaimer demo tercantum di footer

---

## 6. OUTPUT YANG DIMINTA
Hasilkan **satu file React (.jsx) artifact** siap render, lengkap dengan komentar section (`// === HEADER ===`, dst) agar mudah di-maintain, dan pastikan default export komponen utama.
