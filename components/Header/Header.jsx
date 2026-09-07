"use client";
import { allCategories } from "../../lib/products";
import { useWishlist } from "../wishlist/Wishlist";
import { HeartIcon, SearchIcon } from "../ui/Icons";
import { ExpandableSearch } from "./ExpandableSearch";
import { CartBadge } from "./CartBadge";
import { MobileNav } from "./MobileNav";
import { CountdownBar } from "../ui/CountdownBar";

// Header ala Sociolla (diadaptasi ke tema Glow Brighty): strip demo + strip
// promo + countdown (statis, ikut scroll) lalu bar navigasi sticky berisi
// wordmark, search lebar (desktop), wishlist, keranjang, dan pill kategori.
const SHORT_LABEL = {
  "body-serum": "Body Serum",
  "body-wash": "Body Wash",
  "scrub-mask": "Scrub & Mask",
  "underarm-care": "Underarm",
  "toner": "Toner & AHA",
  "hair-removal": "Hair Removal",
  "bundle": "Bundle & Paket",
};

function WishlistButton() {
  const { slugs } = useWishlist();
  return (
    <a className="icon-btn" href="/wishlist" aria-label={`Wishlist, ${slugs.length} produk`}>
      <HeartIcon size={22} />
      {slugs.length > 0 && <span className="cart-badge">{slugs.length > 99 ? "99+" : slugs.length}</span>}
    </a>
  );
}

export function Header() {
  return (
    <>
      <div className="top-strip">Demo edukasi — harga provisional, mengikuti official store Brighty.</div>
      <a className="promo-strip" href="/catalog?sale=1">
        <span><strong>Harga promo official store</strong> · s&amp;k berlaku</span>
        <span className="promo-strip-cta">Belanja Promo →</span>
      </a>
      <CountdownBar />
      <header className="site-header">
        <nav className="nav" aria-label="Navigasi utama">
          <MobileNav />
          <a href="/" className="wordmark" aria-label="Brighty, beranda">brighty<span>.</span></a>
          <form className="head-search" action="/catalog" method="get" role="search">
            <SearchIcon size={18} aria-hidden="true" />
            <input name="q" type="search" placeholder="Cari: serum, scrub, toner…" aria-label="Cari produk" autoComplete="off" />
          </form>
          <div className="nav-right">
            <span className="mobile-search"><ExpandableSearch /></span>
            <WishlistButton />
            <CartBadge />
          </div>
        </nav>
        <nav className="cat-pills" aria-label="Kategori produk">
          <div className="cat-pills-track">
            <a className="cat-pill" href="/catalog">Semua</a>
            {allCategories.map((c) => (
              <a key={c} className="cat-pill" href={`/catalog?cat=${c}`}>
                {SHORT_LABEL[c] || c}
              </a>
            ))}
            <a className="cat-pill cat-pill-hot" href="/catalog?sale=1">Promo</a>
            <a className="cat-pill" href="/catalog?sort=sold">Best Seller</a>
          </div>
        </nav>
      </header>
    </>
  );
}
