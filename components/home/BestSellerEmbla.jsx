"use client";

import Autoplay from "embla-carousel-autoplay";
import { useMemo } from "react";
import { ProductCard } from "../ui/ProductCard";
import {
  Carousel,
  Slider,
  SliderContainer,
  SliderDotButton,
  SliderNextButton,
  SliderPrevButton,
  SliderSnapDisplay,
} from "../ui/EmblaCarousel";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";

// Rel Best Seller pakai embla (port ui-layouts `carousel`): drag + autoplay +
// counter + dots + panah + navigasi keyboard. Autoplay mati saat
// prefers-reduced-motion. SSR aman: DOM server & klien identik.
export function BestSellerEmbla({ items }) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true })],
    [reduceMotion]
  );

  const arrowCls =
    "grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition hover:bg-bg disabled:opacity-40 disabled:hover:bg-surface";

  return (
    <section aria-label="Best seller">
      <div className="section-head">
        <h2>Best Seller</h2>
        <a href="/catalog?sort=sold">Lihat semua →</a>
      </div>
      <Carousel options={{ align: "start", loop: false }} plugins={plugins}>
        <SliderContainer viewportClassName="bleed" className="bleed-inset">
          {items.map((p) => (
            <Slider
              key={p.slug}
              className="basis-[200px] pr-[14px] sm:basis-[230px] md:basis-[240px]"
            >
              <ProductCard p={p} />
            </Slider>
          ))}
        </SliderContainer>
        <div className="mt-3 flex items-center justify-between gap-3">
          <SliderDotButton />
          <div className="flex items-center gap-2">
            <SliderSnapDisplay className="mr-1 text-sm font-bold tabular-nums text-ink" />
            <SliderPrevButton className={arrowCls} aria-label="Geser ke kiri">
              <ChevronLeftIcon size={18} />
            </SliderPrevButton>
            <SliderNextButton className={arrowCls} aria-label="Geser ke kanan">
              <ChevronRightIcon size={18} />
            </SliderNextButton>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
