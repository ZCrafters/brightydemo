"use client";
import { useRef, useState } from "react";
import { animate } from "animejs";
import { rupiah } from "../../lib/products";
import { useCart } from "../cart/CartProvider";
import { Rating } from "../ui/ProductCard";
import { CheckIcon, ShieldIcon, TruckIcon } from "../ui/Icons";
import { ShareButtons } from "./Share";

const SWATCH = { Black: "#1c1917", White: "#ffffff", Cream: "#f3ead9", Ivory: "#fffff0", Choco: "#5b3a29", Grey: "#9aa0a6", Blue: "#3b6ea5", Maroon: "#7e2a3a", Pink: "#f2b8c6", Sage: "#9caf88", Green: "#3f6212", Midnight: "#1e2a4a", Lilac: "#c8b6e2", Yellow: "#f2d06b", Brown: "#7a4a21", Gray: "#9aa0a6", Khaki: "#b6a77a", Navy: "#22304a", Denim: "#4a6fa5", Pastel: "#f6dfe3" };

export function BuyBox({ p }) {
  const { add, setOpen } = useCart();
  const hasVariants = (p.sizes || []).length > 0;
  const [size, setSize] = useState("");
  const [color, setColor] = useState(p.colors?.[0] || "");
  const [tried, setTried] = useState(false);
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);
  const needSize = hasVariants && !size && tried;

  const buy = () => {
    if (hasVariants && !size) {
      setTried(true);
      document.getElementById("size-group")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const finalSize = hasVariants ? size : p.pack || "";
    add(p.slug, finalSize, color, 1);
    setAdded(true);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && btnRef.current) {
      animate(btnRef.current, { scale: [1, 0.94, 1], duration: 320, ease: "out(2)" });
    }
    setOpen(true);
  };

  return (
    <div>
      {p.badge && <span className="badge" style={{ position: "static" }}>{p.badge}</span>}
      <h1>{p.name}</h1>
      <p className="meta">{p.gender}{p.sizeRange ? ` · ${p.sizeRange}` : ""}</p>
      {p.originalPrice ? (
        <p style={{ margin: "6px 0" }}>
          <s className="price-was">{rupiah(p.originalPrice)}</s>{" "}
          <span className="price price-promo" style={{ fontSize: 24 }}>{rupiah(p.price)}</span>
          <br /><span className="promo-note">{p.promoNote}{p.promoUntil ? ` · ${p.promoUntil}` : ""}</span>
        </p>
      ) : (
        <p className="price" style={{ fontSize: 24 }}>{rupiah(p.price)}</p>
      )}
      <Rating value={p.rating} reviews={p.reviews} />
      {p.stock && (
        <p style={{ margin: "8px 0 0" }}>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold leading-5 text-white ${p.stock.type === "out" ? "bg-muted" : p.stock.type === "low" ? "bg-danger" : "bg-success"}`}
          >
            {p.stock.type === "out" ? "Stok Habis" : p.stock.type === "low" ? `Tersisa ${p.stock.qty}` : "Masih Tersedia"}
          </span>
        </p>
      )}
      {p.provisional && <p className="meta">Harga provisional — konfirmasi di official store.</p>}

      {hasVariants && (
        <>
          <p className="opt-label" id="size-group">
            <span>Pilih varian</span>
            {needSize && <span className="opt-hint" role="alert">Wajib pilih varian dulu</span>}
          </p>
          <div className="size-grid" role="group" aria-label="Pilihan varian" aria-describedby={needSize ? "size-err" : undefined}>
            {(p.sizes || []).map((s) => (
              <button key={s} className="size-btn" aria-pressed={size === s} onClick={() => setSize(s)}>
                {s} {size === s && <CheckIcon size={16} />}
              </button>
            ))}
          </div>
          {needSize && <p id="size-err" className="opt-hint">Pilih salah satu varian untuk lanjut.</p>}
        </>
      )}

      {(p.colors || []).length > 0 && (
        <>
          <p className="opt-label"><span>Varian warna{color ? `: ${color}` : ""}</span></p>
          <div className="swatches" role="group" aria-label="Pilihan warna">
            {(p.colors || []).map((c) => (
              <button key={c} className="swatch" aria-pressed={color === c} aria-label={c} title={c}
                style={{ "--sw": SWATCH[c.split(" ")[0]] || "#999" }} onClick={() => setColor(c)}>
                {color === c && <CheckIcon size={18} />}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="buy-sticky">
        <button ref={btnRef} className="btn" onClick={buy} aria-disabled={hasVariants && !size}>
          Tambah ke Keranjang
        </button>
      </div>
      {added && <p className="meta" role="status">Ditambahkan: {p.name}{p.pack ? ` · ${p.pack}` : ""}.</p>}

      <p className="meta" style={{ display: "flex", gap: 16, marginTop: 14 }}>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><TruckIcon size={18} /> Kirim official store</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><ShieldIcon size={18} /> Produk BPOM &amp; Halal</span>
      </p>

      <ShareButtons slug={p.slug} name={p.name} />

      {p.bpom && (
        <p className="meta" style={{ marginTop: 10 }}><strong>BPOM</strong> {p.bpom} {p.sizeRange ? `· ${p.sizeRange}` : ""}</p>
      )}

      {p.claim && (
        <details className="acc" open>
          <summary>Kandungan &amp; Manfaat</summary>
          <div className="acc-body">{p.claim}</div>
        </details>
      )}

      <details className="acc">
        <summary>Cara Pakai</summary>
        <div className="acc-body">Gunakan sesuai petunjuk pada kemasan produk. Hentikan pemakaian bila terjadi iritasi dan konsultasikan ke dokter kulit.</div>
      </details>
      <details className="acc">
        <summary>Info Pengiriman</summary>
        <div className="acc-body">Order final dilakukan di official store Brighty (Tokopedia / Shopee / Lazada / TikTok). Demo ini hanya simulasi — harga &amp; stok dapat berubah.</div>
      </details>
    </div>
  );
}
