import Image from "next/image";
import { rupiah } from "../../lib/products";
import { StarIcon } from "./Icons";
import { WishlistHeart } from "../wishlist/Wishlist";

const DOT = { Black: "#1c1917", White: "#ffffff", Cream: "#f3ead9", Ivory: "#fffff0", Choco: "#5b3a29", Grey: "#9aa0a6", Gray: "#9aa0a6", Blue: "#3b6ea5", Maroon: "#7e2a3a", Pink: "#f2b8c6", Sage: "#9caf88", Green: "#3f6212", Midnight: "#1e2a4a", Lilac: "#c8b6e2", Yellow: "#f2d06b", Brown: "#7a4a21", Khaki: "#b6a77a", Navy: "#22304a", Denim: "#4a6fa5", Pastel: "#f6dfe3" };

export function Rating({ value, reviews, size = 14 }) {
  const full = Math.round(value);
  return (
    <span className="rating" aria-label={`Rating ${value.toFixed(1)} dari 5, ${reviews} ulasan`}>
      <span className="stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} size={size} filled={i <= full} />)}
      </span>
      <span className="rating-num">{value.toFixed(1)}</span>
      {reviews != null && <span className="rating-count">({reviews})</span>}
    </span>
  );
}

// Anatomi card ala referensi Sociolla: foto → ribbon diskon/NEW + hati →
// ukuran → status stok (pill 3 warna) → nama → harga (coret + promo + catatan).
export function ProductCard({ p }) {
  const stock = p.stock || { type: "available" };
  const stockLabel =
    stock.type === "out" ? "Stok Habis" : stock.type === "low" ? `Tersisa ${stock.qty}` : "Masih Tersedia";
  return (
    <a className="card group" href={`/produk/${p.slug}`}>
      <span className="card-img">
        {(p.discountPct > 0 || p.isNew || p.badge) && (
          <span className="badge-stack" aria-hidden="true">
            {p.discountPct > 0 && <span className="badge badge-off">-{p.discountPct}%</span>}
            {p.isNew && <span className="badge badge-new">NEW</span>}
            {!p.discountPct && !p.isNew && p.badge && <span className="badge">{p.badge}</span>}
            {p.badge && (p.discountPct > 0 || p.isNew) && p.badge !== "New" && p.badge !== "Promo" && (
              <span className="badge">{p.badge}</span>
            )}
          </span>
        )}
        <Image src={p.images?.[0]} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy"
          className="transition-transform duration-300 ease-out group-hover:scale-[1.06]" />
      </span>
      <span className="card-swatches">
        <span className="dots" aria-hidden="true">
          {(p.colors || []).slice(0, 5).map((c) => (
            <i key={c} title={c} style={{ background: DOT[c.split(" ")[0]] || "#999" }} />
          ))}
        </span>
        <WishlistHeart slug={p.slug} name={p.name} size={18} />
      </span>
      <span className="info">
        <span className="meta">{p.gender}{p.sizeRange ? ` · ${p.sizeRange}` : ""}</span>
        <span
          className={`inline-block self-start rounded-full px-2 py-0.5 text-[11px] font-semibold leading-5 text-white ${stock.type === "out" ? "bg-muted" : stock.type === "low" ? "bg-danger" : "bg-success"}`}
        >
          {stockLabel}
        </span>
        <strong className="card-name">{p.name}</strong>
        {p.originalPrice ? (
          <>
            <s className="price-was">{rupiah(p.originalPrice)}</s>
            <span className="price price-promo">{rupiah(p.price)}</span>
            <span className="promo-note">{p.promoNote}{p.promoUntil ? ` · ${p.promoUntil}` : ""}</span>
          </>
        ) : (
          <span className="price">{rupiah(p.price)}</span>
        )}
      </span>
    </a>
  );
}

export function SkeletonCard() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <span className="card-img shimmer" />
      <span className="info">
        <span className="sk-line shimmer" style={{ width: "80%" }} />
        <span className="sk-line shimmer" style={{ width: "50%" }} />
        <span className="sk-line shimmer" style={{ width: "60%" }} />
      </span>
    </div>
  );
}
