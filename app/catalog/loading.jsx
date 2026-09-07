import { SkeletonCard } from "../../components/ui/ProductCard";

export default function Loading() {
  return (
    <>
      <h1>Katalog</h1>
      <section className="grid" style={{ marginTop: 14 }} aria-label="Memuat produk">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </section>
    </>
  );
}
