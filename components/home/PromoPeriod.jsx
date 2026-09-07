import { promoProducts } from "../../lib/products";
import { ProductCard } from "../ui/ProductCard";
import { Reveal } from "../motion/Reveal";

// Section promo berperiode ala referensi: banner + tab + grid promo + tanggal periode.
export function PromoPeriod() {
  if (!promoProducts.length) return null;
  return (
    <section aria-label="Promo" id="promo" style={{ marginTop: 36 }}>
      <a className="promo-frame" href="/catalog?sort=price-asc" aria-label="Harga promo resmi, lihat katalog">
        <span className="promo-frame-title">HARGA PROMO OFFICIAL STORE</span>
        <span className="promo-frame-date">Periode promo — s&amp;k berlaku</span>
        <span className="promo-frame-note">Harga tertera adalah harga listing resmi Brighty di marketplace.</span>
      </a>
      <div className="pills" role="navigation" aria-label="Tab promo">
        <a className="pill" href="#promo" aria-current="page">Harga Promo</a>
        <a className="pill" href="/catalog?sort=sold">Terlaris</a>
        <a className="pill" href="/catalog?sort=new">New Launch</a>
        <a className="pill" href="/catalog?sort=price-asc">Termurah</a>
      </div>
      <div className="section-head">
        <div>
          <h2>Sedang Promo</h2>
          <p className="meta" style={{ margin: "2px 0 0" }}>Harga promo resmi official store — dapat berubah.</p>
        </div>
        <a href="/catalog">Lihat semua →</a>
      </div>
      <Reveal className="grid grid-5" staggerChildren>
        {promoProducts.map((p) => <ProductCard key={p.slug} p={p} />)}
      </Reveal>
    </section>
  );
}
