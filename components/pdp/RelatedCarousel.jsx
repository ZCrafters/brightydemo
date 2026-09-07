import { ProductCard } from "../ui/ProductCard";
import { CarouselCursor } from "../motion/CarouselCursor";

export function RelatedCarousel({ items, category }) {
  if (!items.length) return null;
  return (
    <section aria-label="Produk serupa" style={{ marginTop: 32 }}>
      <div className="section-head"><h2>Produk Serupa</h2><a href={`/catalog?cat=${category}`}>Lihat semua →</a></div>
      <CarouselCursor className="h-scroll">
        {items.map((r) => <ProductCard key={r.slug} p={r} />)}
      </CarouselCursor>
    </section>
  );
}
