import { notFound } from "next/navigation";
import { getProduct, getRelated, products } from "../../../lib/products";
import { Gallery } from "../../../components/pdp/Gallery";
import { BuyBox } from "../../../components/pdp/BuyBox";
import { RelatedCarousel } from "../../../components/pdp/RelatedCarousel";
import { ReviewSection } from "../../../components/pdp/ReviewSection";
import { Breadcrumb } from "../../../components/ui/Chrome";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  return {
    title: p ? `${p.name} — Brighty` : "Produk tidak ditemukan — Brighty",
    robots: { index: false },
  };
}

export default function ProductDetail({ params }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Katalog", href: "/catalog" }, { label: p.name }]} />
      <div className="pdp">
        <Gallery images={p.images} name={p.name} />
        <BuyBox p={p} />
      </div>
      <ReviewSection product={p} />
      <RelatedCarousel items={getRelated(p)} category={p.category} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Product", name: p.name,
        sku: p.slug, brand: { "@type": "Brand", name: "Brighty" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
        offers: { "@type": "Offer", priceCurrency: "IDR", price: p.price, availability: "https://schema.org/InStock" }
      }) }} />
    </>
  );
}
