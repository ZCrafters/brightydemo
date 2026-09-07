import Image from "next/image";
import { products } from "../../lib/products";
import { ProductCard } from "../ui/ProductCard";
import { Reveal } from "../motion/Reveal";
import { Spotlight, SpotLightItem } from "../ui/Spotlight";

const CATS = [
  { slug: "body-serum", label: "Body Serum" },
  { slug: "body-wash", label: "Body Wash" },
  { slug: "underarm-care", label: "Underarm" },
  { slug: "scrub-mask", label: "Scrub & Mask" },
  { slug: "toner", label: "Toner & AHA" },
];

export function CategoryGrid() {
  return (
    <section aria-label="Kategori">
      <div className="section-head"><h2>Belanja per Kategori</h2><a href="/catalog">Lihat semua →</a></div>
      <Reveal staggerChildren>
        <Spotlight className="cat-grid" ProximitySpotlight CursorFlowGradient>
          {CATS.map((c) => {
            const sample = products.find((p) => p.category === c.slug);
            return (
              <SpotLightItem key={c.slug}>
                <a className="cat-card h-full w-full" href={`/catalog?cat=${c.slug}`}>
                  {sample && <Image src={sample.images[0]} alt={c.label} fill sizes="(max-width: 768px) 50vw, 20vw" loading="lazy" />}
                  <span className="cat-label">{c.label}</span>
                </a>
              </SpotLightItem>
            );
          })}
        </Spotlight>
      </Reveal>
    </section>
  );
}

export function NewArrivals({ items }) {
  return (
    <section aria-label="New arrivals">
      <div className="section-head"><h2>New Arrivals</h2><a href="/catalog?sort=new">Lihat semua →</a></div>
      <Reveal className="grid" staggerChildren>
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </Reveal>
    </section>
  );
}
