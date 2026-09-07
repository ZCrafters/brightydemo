"use client";
import { useEffect, useRef } from "react";

// Efek kursor carousel (reimplementasi manual ala Cursify MCP): kartu di dalam
// container "terangkat" (translateY + scale) mengikuti kedekatan pointer —
// makin dekat makin naik, kuadrat agar halus di tepi. Transform-only lewat
// rAF; nonaktif di touch & prefers-reduced-motion.
// Dipakai sebagai container horizontal-scroll: <CarouselCursor className="h-scroll">.
export function CarouselCursor({ children, className = "", radius = 200, lift = 12, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let mx = Number.NaN;
    const rect = () => el.getBoundingClientRect();
    const cards = () => Array.from(el.children);

    const apply = () => {
      raf = 0;
      if (Number.isNaN(mx)) return;
      const r = rect();
      for (const c of cards()) {
        const cr = c.getBoundingClientRect();
        const center = cr.left + cr.width / 2 - r.left;
        const d = Math.abs(mx - center);
        const k = d < radius ? 1 - d / radius : 0;
        const e = k * k;
        c.style.transform = e > 0.004
          ? `translateY(${(-lift * e).toFixed(2)}px) scale(${(1 + 0.03 * e).toFixed(3)})`
          : "";
        c.style.zIndex = e > 0.25 ? "2" : "";
      }
    };
    const onMove = (e) => {
      mx = e.clientX - rect().left;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const clear = () => {
      mx = Number.NaN;
      for (const c of cards()) {
        c.style.transform = "";
        c.style.zIndex = "";
      }
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", clear);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", clear);
      clear();
    };
  }, [radius, lift]);

  return (
    <div ref={ref} className={className} data-cursor="drag" {...rest}>
      {children}
    </div>
  );
}
