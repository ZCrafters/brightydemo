import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Heart, ShoppingBag, Search, ChevronLeft, ChevronRight, ChevronUp,
  Sparkles, Droplet, Sun, ShieldCheck, Star, X
} from "lucide-react";

// ============ MOCK DATA ============

const CATEGORIES = ["All", "Serum", "Moisturizer", "Sunscreen", "Mask", "Cleanser", "Toner"];

const CAT_COLOR = {
  Serum: "from-sky-200 to-sky-300",
  Moisturizer: "from-blue-200 to-blue-300",
  Sunscreen: "from-amber-100 to-amber-200",
  Mask: "from-pink-200 to-pink-300",
  Cleanser: "from-cyan-100 to-cyan-200",
  Toner: "from-indigo-100 to-indigo-200",
};

const NAMES = [
  ["5X Ceramide Barrier Repair Serum", "Serum", 50],
  ["Salicylic Acid Anti-Acne Gel", "Serum", 45],
  ["Niacinamide Dark Spot Serum", "Serum", 40],
  ["5X Ceramide Barrier Moisture Gel", "Moisturizer", 50],
  ["Panthenol Soothing Water Gel", "Moisturizer", 35],
  ["Truffle Biome Cream Gel Moisturizer", "Moisturizer", 42],
  ["Glow Tinted Sunscreen SPF 50+", "Sunscreen", 38],
  ["Hybrid Sunscreen SPF 50+ PA++++", "Sunscreen", 45],
  ["5X Ceramide Soothing Sheet Mask", "Mask", 52],
  ["Mugwort Acne Clay Stick Mask", "Mask", 48],
  ["5X Ceramide Low pH Cleanser", "Cleanser", 30],
  ["3X Acid Acne Gel Cleanser", "Cleanser", 44],
  ["4X Hyaluronic Acid Toner", "Toner", 36],
  ["Probiotic Barrier Toner", "Toner", 41],
  ["Refill Cover All Perfect Cushion", "Sunscreen", 52],
  ["Radiance Booster Serum Spray", "Serum", 33],
  ["Ceramide Duo Repair Cream", "Moisturizer", 46],
  ["Centella Calming Sheet Mask", "Mask", 39],
  ["Peptide Renewal Night Serum", "Serum", 43],
  ["Vitamin C Brightening Cleanser", "Cleanser", 37],
];

function buildProducts() {
  return NAMES.map((n, i) => {
    const [name, category, discountPercent] = n;
    const basePrice = 90000 + (i * 7000) % 260000 + 39000;
    const rounded = Math.round(basePrice / 500) * 500;
    const price = Math.round((rounded * (1 - discountPercent / 100)) / 500) * 500;
    let stock;
    const r = i % 6;
    if (r === 0) stock = { type: "out" };
    else if (r === 1 || r === 2) stock = { type: "low", qty: 12 + i * 3 };
    else stock = { type: "available" };
    return {
      id: i + 1,
      brand: "SKINTIFIC",
      name,
      category,
      size: category === "Mask" ? "1 x 25ml" : `${20 + (i % 4) * 20} ml`,
      basePrice: rounded,
      discountPercent,
      price,
      stock,
      isNew: i % 5 === 0,
      isBundle: i % 7 === 0,
      createdAt: 100 - i,
    };
  });
}

const PRODUCTS = buildProducts();

const PROMOS = [
  "Free gift 7 Sep 2026",
  "Voucher 15% skincare set",
  "Redeem points with bestie deals",
  "Voucher up to 200K road to 9.9",
  "Voucher up to 150K road to 9.9",
  "More promos waiting for you",
];

// ============ HELPERS ============

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

function ProductMock({ category, size = "md" }) {
  const grad = CAT_COLOR[category] || "from-slate-200 to-slate-300";
  const h = size === "sm" ? "h-24" : "h-40";
  return (
    <div className={`relative w-full ${h} bg-gradient-to-br ${grad} rounded-lg flex items-center justify-center overflow-hidden`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-white/70 rounded-b-sm" />
      <div className="w-1/2 h-2/3 bg-white/50 rounded-md border border-white/70" />
      <Droplet className="absolute bottom-2 right-2 w-4 h-4 text-white/80" />
    </div>
  );
}

// ============ STOCK PILL ============

function StockPill({ stock }) {
  if (stock.type === "available")
    return <span className="text-[11px] font-medium text-white bg-emerald-500 rounded-full px-2 py-0.5 inline-block">Masih Tersedia</span>;
  if (stock.type === "low")
    return <span className="text-[11px] font-medium text-white bg-rose-500 rounded-full px-2 py-0.5 inline-block">Tersisa {stock.qty}</span>;
  return <span className="text-[11px] font-medium text-white bg-gray-400 rounded-full px-2 py-0.5 inline-block">Stok Habis</span>;
}

// ============ PRODUCT CARD ============

function ProductCard({ p, wishlist, toggleWishlist }) {
  const isOut = p.stock.type === "out";
  const isWished = wishlist.has(p.id);
  return (
    <div className={`relative border border-gray-100 rounded-xl p-3 bg-white hover:shadow-md transition-shadow ${isOut ? "opacity-70" : ""}`}>
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {p.isNew && <span className="text-[10px] font-semibold text-white bg-gray-900 rounded px-1.5 py-0.5">NEW</span>}
        <span className="text-[10px] font-semibold text-white bg-pink-600 rounded px-1.5 py-0.5">{p.discountPercent}%</span>
      </div>
      <button
        onClick={() => toggleWishlist(p.id)}
        aria-label="Toggle wishlist"
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center border border-gray-100"
      >
        <Heart className={`w-4 h-4 ${isWished ? "fill-pink-600 text-pink-600" : "text-gray-400"}`} />
      </button>

      {p.isBundle ? (
        <div className="flex gap-1">
          <div className="w-1/2"><ProductMock category={p.category} size="sm" /></div>
          <div className="w-1/2"><ProductMock category={p.category} size="sm" /></div>
        </div>
      ) : (
        <ProductMock category={p.category} />
      )}

      {p.isBundle && (
        <span className="mt-2 inline-block text-[10px] font-medium text-pink-700 bg-pink-50 rounded-full px-2 py-0.5">BUNDLE</span>
      )}

      <div className="mt-2 text-[11px] text-gray-500">{p.size}</div>
      <div className="mt-1"><StockPill stock={p.stock} /></div>
      <div className="mt-2 text-[11px] font-bold tracking-wide text-gray-800">{p.brand}</div>
      <div className="text-[13px] text-gray-700 line-clamp-2 leading-snug h-[34px]">{p.name}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-pink-600 font-bold text-sm">{rupiah(p.price)}</span>
        <span className="text-gray-400 text-xs line-through">{rupiah(p.basePrice)}</span>
      </div>
    </div>
  );
}

// ============ COUNTDOWN ============

function useCountdown(hours = 30) {
  const [remaining, setRemaining] = useState(hours * 3600);
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return { h, m, s };
}

function CountdownBar({ onShop }) {
  const { h, m, s } = useCountdown(30);
  const Digit = ({ v }) => <span className="bg-gray-900 text-white text-xs font-semibold rounded px-1.5 py-1">{v}</span>;
  return (
    <div className="bg-pink-50 border-b border-pink-100 px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-xs">
      <span className="text-pink-700 font-medium">Flash Sale 9.9: Diskon hingga 50% + Free Gift</span>
      <span className="text-gray-500">Berakhir dalam</span>
      <div className="flex items-center gap-1">
        <Digit v={h} /><span>:</span><Digit v={m} /><span>:</span><Digit v={s} />
      </div>
      <button onClick={onShop} className="bg-pink-600 text-white rounded-full px-3 py-1 font-medium hover:bg-pink-700">
        Shop now
      </button>
    </div>
  );
}

// ============ HERO CAROUSEL ============

const SLIDES = [
  {
    title: "5X Ceramide Barrier Ritual",
    subtitle: "Protects & evens skin tone",
    grad: "from-sky-100 via-sky-200 to-pink-100",
  },
  {
    title: "New Crush: Glow Set",
    subtitle: "Delivers glass skin radiance",
    grad: "from-pink-100 via-blue-100 to-sky-200",
  },
];

function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);
  const s = SLIDES[idx];
  return (
    <div className={`relative rounded-2xl overflow-hidden h-64 md:h-80 bg-gradient-to-br ${s.grad} flex items-center justify-between px-6 md:px-12`}>
      <div className="max-w-xs">
        <span className="inline-block bg-pink-600 text-white text-[11px] font-semibold rounded-full px-3 py-1 mb-3">New crush</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{s.title}</h2>
        <p className="mt-2 text-sm text-gray-700">{s.subtitle}</p>
        <button className="mt-4 bg-gray-900 text-white text-sm rounded-full px-4 py-2">Shop the ritual</button>
      </div>
      <div className="hidden sm:flex items-center justify-center relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-white/40" style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }} />
        <ProductMock category="Serum" />
      </div>
      <Sparkles className="absolute top-4 right-6 w-5 h-5 text-white/70" />
      <Star className="absolute bottom-6 left-1/3 w-4 h-4 text-white/70" />
      <button onClick={() => setIdx((idx - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous slide" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1">
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button onClick={() => setIdx((idx + 1) % SLIDES.length)} aria-label="Next slide" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1">
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-pink-600" : "w-1.5 bg-white/70"}`} />
        ))}
      </div>
    </div>
  );
}

// ============ CAROUSEL ROW (Home) ============

function ProductCarousel({ items, wishlist, toggleWishlist }) {
  const ref = useRef(null);
  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-3 overflow-x-auto scroll-smooth snap-x pb-2 [scrollbar-width:none]">
        {items.map((p) => (
          <div key={p.id} className="min-w-[160px] w-40 snap-start">
            <ProductCard p={p} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          </div>
        ))}
      </div>
      <button onClick={() => scrollBy(-300)} aria-label="Scroll left" className="hidden md:flex absolute -left-3 top-1/3 bg-white shadow border border-gray-100 rounded-full p-1.5">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={() => scrollBy(300)} aria-label="Scroll right" className="hidden md:flex absolute -right-3 top-1/3 bg-white shadow border border-gray-100 rounded-full p-1.5">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============ HOME TAB ============

function HomeTab({ wishlist, toggleWishlist, toast }) {
  return (
    <div className="space-y-8">
      <HeroCarousel />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">Special promo</h3>
          <button className="text-pink-600 text-xs font-medium">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
          {PROMOS.map((t, i) => (
            <div key={i} className="min-w-[140px] bg-pink-50 border border-pink-100 rounded-xl p-3 text-xs text-pink-800 font-medium flex flex-col justify-between h-20">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="line-clamp-2">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">New arrivals</h3>
        </div>
        <ProductCarousel items={PRODUCTS.slice(0, 10)} wishlist={wishlist} toggleWishlist={toggleWishlist} />
      </section>

      <section className="bg-gradient-to-r from-pink-50 to-sky-50 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-pink-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Rekomendasi sesuai beauty profile-mu</p>
          <p className="text-xs text-gray-600">
            Masuk ke akunmu untuk rekomendasi produk sesuai jenis kulit.{" "}
            <button onClick={() => toast("Fitur demo — belum terhubung ke akun asli")} className="text-pink-600 font-semibold underline">
              Login sekarang
            </button>
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-3">Best seller</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PRODUCTS.slice(10, 18).map((p) => (
            <ProductCard key={p.id} p={p} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ============ PRODUCTS TAB ============

function ProductsTab({ wishlist, toggleWishlist }) {
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [saleOnly, setSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => category === "All" || p.category === category);
    list = list.filter((p) => p.price <= maxPrice);
    if (saleOnly) list = list.filter((p) => p.discountPercent > 0);
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [category, maxPrice, saleOnly, sortBy]);

  useEffect(() => setPage(1), [category, maxPrice, saleOnly, sortBy, perPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-56 shrink-0 space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Category</p>
          <div className="space-y-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`block w-full text-left text-sm px-2 py-1 rounded-md ${category === c ? "bg-pink-50 text-pink-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Price</p>
          <input
            type="range" min="20000" max="500000" step="10000" value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-pink-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Rp0</span><span>{rupiah(maxPrice)}</span>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} className="accent-pink-600" />
          Sale only
        </label>
      </aside>

      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <p className="text-sm text-gray-600">{filtered.length} results found</p>
          <div className="flex items-center gap-2 text-sm">
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="border border-gray-200 rounded-md px-2 py-1">
              <option value={8}>8</option><option value={12}>12</option><option value={20}>20</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1">
              <option value="default">Sort by</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="text-sm text-gray-500 py-10 text-center">Tidak ada produk yang cocok dengan filter ini.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {shown.map((p) => (
              <ProductCard key={p.id} p={p} wishlist={wishlist} toggleWishlist={toggleWishlist} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border rounded-md disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border rounded-md disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ROOT APP ============

export default function SkinticStoreDemo() {
  const [tab, setTab] = useState("Home");
  const [wishlist, setWishlist] = useState(new Set());
  const [showTop, setShowTop] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <CountdownBar onShop={() => setTab("Products")} />

      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <span className="text-xl font-extrabold tracking-tight text-sky-900">SKINTIFIC</span>
          <span className="hidden sm:inline text-[10px] font-medium text-pink-600 border border-pink-200 rounded-full px-2 py-0.5">
            science-based skincare
          </span>
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 max-w-md">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input placeholder="Cari serum, sunscreen, sheet mask..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
          </div>
          <button onClick={() => toast("Fitur login demo")} className="hidden sm:block text-sm text-gray-600 hover:text-pink-600">Login</button>
          <button onClick={() => toast("Keranjang demo")} className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {wishlist.size > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.size}
              </span>
            )}
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-4 text-xs text-gray-500 overflow-x-auto">
          {["Categories", "Deals", "New Arrivals", "Best Sellers", "Gift Card"].map((c) => (
            <span key={c} className="whitespace-nowrap flex items-center gap-1"><Sun className="w-3 h-3 text-pink-400" />{c}</span>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-4 text-xs text-gray-400">Home / Skintific</div>

      <nav className="max-w-6xl mx-auto px-4 mt-3 border-b border-gray-100 flex gap-6">
        {["Home", "Products"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm font-medium ${tab === t ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-500"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === "Home"
          ? <HomeTab wishlist={wishlist} toggleWishlist={toggleWishlist} toast={toast} />
          : <ProductsTab wishlist={wishlist} toggleWishlist={toggleWishlist} />}
      </main>

      <footer className="border-t border-gray-100 mt-10 py-6 text-center text-xs text-gray-400">
        Ini adalah proyek demo edukasi tentang UI e-commerce skincare, tidak berafiliasi dengan Sociolla atau pihak manapun.
      </footer>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 bg-white border border-pink-200 shadow rounded-full p-2"
        >
          <ChevronUp className="w-5 h-5 text-pink-600" />
        </button>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
          {toastMsg}
          <button onClick={() => setToastMsg(null)} aria-label="Close"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
    </div>
  );
}
