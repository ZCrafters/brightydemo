import { rupiah } from "../../lib/products";
import { ProductCard } from "./ProductCard";
import { Rating, StarIcon } from "./Icons";

const DOT = { Black: "#1c1917", White: "#ffffff", Cream: "#f3ead9", Ivory: "#fffff0", Choco: "#5b3a29", Grey: "#9aa0a6", Gray: "#9aa0a6", Blue: "#3b6ea5", Maroon: "#7e2a3a", Pink: "#f2b8c6", Sage: "#9caf88", Green: "#3f6212", Midnight: "#1e2a4a", Lilac: "#c8b6e2", Yellow: "#f2d06b", Brown: "#7a4a21", Khaki: "#b6a77a", Navy: "#22304a", Denim: "#4a6fa5", Pastel: "#f6dfe3" };

export function ProductRow({ p }) {
  const full = Math.round(p.rating);
  const stock = p.stock || { type: "available" };
  const stockLabel =
    stock.type === "out" ? "Stok Habis" : stock.type === "low" ? `Tersisa ${stock.qty}` : "Masih Tersedia";
  return (
    <a className="row-card" href={`/produk/${p.slug}`}>
      <span className="row-img">
        {p.badge && <span className="badge">{p.badge}</span>}
        <img src={p.images?.[0]} alt={p.name} loading="lazy" />
      </span>
      <span className="row-info">
        <span className="meta">{p.gender}{p.sizeRange ? ` · ${p.sizeRange}` : ""}</span>
        <strong className="card-name">{p.name}</strong>
        <span
          className={`inline-block self-start rounded-full px-2 py-0.5 text-[11px] font-semibold leading-5 text-white ${stock.type === "out" ? "bg-muted" : stock.type === "low" ? "bg-danger" : "bg-success"}`}
        >
          {stockLabel}
        </span>
        <span className="row-swatches" aria-label="Pilihan warna">
          {(p.colors || []).slice(0, 6).map((c) => (
            <i key={c} title={c} style={{ background: DOT[c.split(" ")[0]] || "#999" }} />
          ))}
        </span>
        <span className="row-meta">
          <span className="stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} size={13} filled={i <= full} />)}
          </span>
          <span className="meta">{p.reviews} ulasan · {p.soldLabel} terjual</span>
        </span>
      </span>
      <span className="row-price">
        {p.originalPrice && <s className="price-was">{rupiah(p.originalPrice)}</s>}
        <span className={`price${p.originalPrice ? " price-promo" : ""}`}>{rupiah(p.price)}</span>
        {p.promoNote && <small className="promo-note">{p.promoNote}</small>}
      </span>
    </a>
  );
}
